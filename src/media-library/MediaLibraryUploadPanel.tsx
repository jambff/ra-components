import { FC } from 'react';
import { FileInput, RaRecord, useCreate } from 'react-admin';
import { LinearProgress } from '@mui/material';
import type { MediaLibraryInputUploadOptions } from './types';
import { useSupabaseStorage } from './useSupabaseStorage';

type MediaLibraryUploadPanelProps = MediaLibraryInputUploadOptions & {
  onImageSelect: (newRecord: RaRecord) => void;
};

export const MediaLibraryUploadPanel: FC<MediaLibraryUploadPanelProps> = ({
  supabase,
  bucket,
  bucketFolder,
  accept,
  maxSize,
  resource,
  onImageSelect,
}: MediaLibraryUploadPanelProps) => {
  const { upload, isUploading } = useSupabaseStorage(
    supabase,
    bucket,
    bucketFolder,
    accept,
  );

  const [create] = useCreate();

  const onChange = async (file?: File) => {
    if (!file) {
      return;
    }

    const data = await upload(file);

    create(
      resource,
      { data },
      {
        onSuccess: onImageSelect,
      },
    );
  };

  if (isUploading) {
    return <LinearProgress />;
  }

  return (
    <FileInput source="" label=" " maxSize={maxSize} onChange={onChange} />
  );
};
