import { useCallback, useState } from 'react';
import fetch from 'unfetch';
import { useNotify } from 'react-admin';
import { isMatch } from 'matcher';

import type { SupabaseClient } from '@supabase/supabase-js';

export const useSupabaseStorage = (
  supabase: SupabaseClient,
  bucket: string,
  bucketFolder?: string,
  accept?: string | string[],
) => {
  const [isUploading, setIsUploading] = useState(false);
  const notify = useNotify();

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

      // No need to upload again if this image was already uploaded
      if (res.status === 200) {
        return;
      }

      if (accept && !isMatch(file.type, accept)) {
        notify(`Not an accepted file type: ${file.type}`, {
          type: 'error',
        });
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
    [notify, supabase, bucket, getFileLocation, accept],
  );

  const upload = async (file: File) => {
    const publicImageUrl = getPublicImageUrl(file.name);

    setIsUploading(true);

    try {
      await uploadImage(publicImageUrl, file);
    } catch (err) {
      notify('Failed to upload image', {
        type: 'error',
      });
    }

    setIsUploading(false);

    return { src: publicImageUrl, title: file.name };
  };

  return {
    upload,
    isUploading,
  };
};
