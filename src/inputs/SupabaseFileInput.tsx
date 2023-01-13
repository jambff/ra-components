import { FC, ReactNode, useCallback, useState } from 'react';
import fetch from 'unfetch';
import { FileInput, useRecordContext, useNotify, Validator } from 'react-admin';
import { createClient } from '@supabase/supabase-js';

export const getSupabaseClient = (
  supabaseUrl: string,
  supabaseAnonKey: string,
) => createClient(supabaseUrl, supabaseAnonKey);

type SupabaseFileInputProps = {
  bucket: string;
  bucketFolder?: string;
  supabaseUrl: string;
  supabaseAnonKey: string;
  source: string;
  label?: string;
  accept?: string;
  validate?: Validator | Validator[];
  maxSize?: number;
  children?: ReactNode;
};

const getValidators = (
  defaultValidator: Validator,
  validate?: Validator | Validator[],
): Validator[] => {
  const validators: Validator[] = [defaultValidator];

  if (!validate) {
    return validators;
  }

  if (Array.isArray(validate)) {
    return [...validators, ...validate];
  }

  return [...validators, validate];
};

export const SupabaseFileInput: FC<SupabaseFileInputProps> = ({
  supabaseUrl,
  supabaseAnonKey,
  bucket,
  bucketFolder,
  label,
  accept,
  source,
  validate,
  maxSize,
  children,
}: SupabaseFileInputProps) => {
  const record = useRecordContext();
  const [uploadingFile, setUploadingFile] = useState(false);
  const notify = useNotify();
  const supabase = getSupabaseClient(supabaseUrl, supabaseAnonKey);

  const getFileLocation = useCallback(
    (fileName: string) => {
      if (!bucketFolder) {
        return fileName;
      }

      return `${bucketFolder}/${fileName}`;
    },
    [bucketFolder],
  );

  const getPublicImageUrl = useCallback(
    (fileName: string) => {
      const { data } = supabase.storage
        .from(bucket)
        .getPublicUrl(getFileLocation(fileName));

      return data.publicUrl;
    },
    [supabase, bucket, getFileLocation],
  );

  const uploadImage = useCallback(
    async (publicImageUrl: string, file: File) => {
      const res = await fetch(publicImageUrl);

      if (res.status === 200) {
        return;
      }

      const { error } = await supabase.storage
        .from(bucket)
        .upload(getFileLocation(file.name), file, {
          cacheControl: '3600',
          upsert: false,
          contentType: file.type,
        });

      if (error) {
        console.error(error);
        notify(`Failed to upload file: ${error.message}`, {
          type: 'error',
        });
      }
    },
    [notify, supabase, bucket, getFileLocation],
  );

  const validateUpload = useCallback(() => {
    if (!uploadingFile) {
      return;
    }

    return 'Please wait for the file to finish uploading';
  }, [uploadingFile]);

  return (
    <FileInput
      source={source}
      label={label}
      accept={accept}
      maxSize={maxSize}
      validate={getValidators(validateUpload, validate)}
      parse={(value) => {
        if (!value) {
          return;
        }

        const publicImageUrl = getPublicImageUrl(value.name);

        setUploadingFile(true);
        uploadImage(publicImageUrl, value).then(() => {
          setUploadingFile(false);
        });

        return publicImageUrl;
      }}
      format={(value) => {
        if (value) {
          return { src: value };
        }

        return record;
      }}>
      {children}
    </FileInput>
  );
};
