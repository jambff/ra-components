import { useCallback, useState } from 'react';
import fetch from 'unfetch';
import { isMatch } from 'matcher';
import { useMediaLibraryContext } from './MediaLibraryProvider';

export const useSupabaseStorage = () => {
  const [isUploading, setIsUploading] = useState(false);
  const { supabase, bucket, bucketFolder, accept } = useMediaLibraryContext();

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
        throw new Error(`Not an accepted file type: ${file.type}`);
      }

      const { error } = await supabase.storage
        .from(bucket)
        .upload(getFileLocation(file.name), file, {
          cacheControl: '3600',
          upsert: false,
          contentType: file.type,
        });

      if (error) {
        throw new Error(`Failed to upload file: ${error.message}`);
      }
    },
    [supabase, bucket, getFileLocation, accept],
  );

  const upload = async (file: File) => {
    const publicImageUrl = getPublicImageUrl(file.name);

    setIsUploading(true);

    try {
      await uploadImage(publicImageUrl, file);
    } catch (err) {
      setIsUploading(false);

      throw err;
    }

    setIsUploading(false);

    return { src: publicImageUrl, title: file.name };
  };

  return {
    upload,
    isUploading,
  };
};
