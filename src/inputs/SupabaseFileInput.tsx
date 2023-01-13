import { FC, useCallback, useState } from 'react';
import fetch from 'unfetch';
import {
  FileInput,
  ImageField,
  useRecordContext,
  useNotify,
  Validator,
} from 'react-admin';
import { createClient } from '@supabase/supabase-js';

export const getSupabaseClient = (
  supabaseUrl: string,
  supabaseAnonKey: string,
) => createClient(supabaseUrl, supabaseAnonKey);

type SupabaseFileInputProps = {
  bucket: string;
  supabaseUrl: string;
  supabaseAnonKey: string;
  source: string;
  imageFolder?: string;
  label?: string;
  accept?: string;
  validate?: Validator | Validator[];
  maxSize?: number;
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
  imageFolder,
  label,
  accept,
  source,
  validate,
  maxSize,
  bucket,
}: SupabaseFileInputProps) => {
  const record = useRecordContext();
  const [uploadingImage, setUploadingImage] = useState(false);
  const notify = useNotify();
  const supabase = getSupabaseClient(supabaseUrl, supabaseAnonKey);

  const getImageLocation = useCallback(
    (fileName: string) => {
      if (!imageFolder) {
        return fileName;
      }

      return `${imageFolder}/${fileName}`;
    },
    [imageFolder],
  );

  const getPublicImageUrl = useCallback(
    (fileName: string) => {
      const { data } = supabase.storage
        .from(bucket)
        .getPublicUrl(getImageLocation(fileName));

      return data.publicUrl;
    },
    [supabase, bucket, getImageLocation],
  );

  const uploadImage = useCallback(
    async (publicImageUrl: string, file: File) => {
      const res = await fetch(publicImageUrl);

      if (res.status === 200) {
        return;
      }

      const { error } = await supabase.storage
        .from(bucket)
        .upload(getImageLocation(file.name), file, {
          cacheControl: '3600',
          upsert: false,
          contentType: file.type,
        });

      if (error) {
        console.error(error);
        notify(`Failed to upload image: ${error.message}`, {
          type: 'error',
        });
      }
    },
    [notify, supabase, bucket, getImageLocation],
  );

  const validateUpload = useCallback(() => {
    if (!uploadingImage) {
      return;
    }

    return 'Please wait for the file to finish uploading';
  }, [uploadingImage]);

  return (
    <FileInput
      source={source}
      label={label}
      accept={accept}
      maxSize={maxSize}
      validate={getValidators(validateUpload, validate)}
      parse={(value) => {
        const publicImageUrl = getPublicImageUrl(value.name);

        setUploadingImage(true);
        uploadImage(publicImageUrl, value).then(() => {
          setUploadingImage(false);
        });

        return publicImageUrl;
      }}
      format={(value) => {
        if (value) {
          return { src: value };
        }

        return record;
      }}>
      <ImageField source={source} record={record} />
    </FileInput>
  );
};
