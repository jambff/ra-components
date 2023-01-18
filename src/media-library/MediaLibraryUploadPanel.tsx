import { FC } from 'react';
import { FileInput, RaRecord, useCreate, useNotify } from 'react-admin';
import { LinearProgress } from '@mui/material';
import { useSupabaseStorage } from './useSupabaseStorage';
import { useMediaLibraryContext } from './MediaLibraryProvider';

type MediaLibraryUploadPanelProps = {
  onImageSelect: (newRecord: RaRecord) => void;
};

export const MediaLibraryUploadPanel: FC<MediaLibraryUploadPanelProps> = ({
  onImageSelect,
}: MediaLibraryUploadPanelProps) => {
  const { maxSize, resource } = useMediaLibraryContext();
  const { upload, isUploading } = useSupabaseStorage();
  const [create] = useCreate();
  const notify = useNotify();

  const onChange = async (file?: File) => {
    if (!file) {
      return;
    }

    let data;

    try {
      data = await upload(file);
    } catch (err) {
      notify(err.message, { type: 'error' });

      return;
    }

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
    <FileInput
      source=""
      label=" "
      maxSize={maxSize}
      onChange={onChange}
      sx={{
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    />
  );
};
