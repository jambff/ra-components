import { FC, useState } from 'react';
import { RaRecord, useInput, useGetOne } from 'react-admin';
import { useTheme } from '@mui/material';
import BrokenImage from '@mui/icons-material/BrokenImage';
import { MediaLibraryModal } from './MediaLibraryModal';
import { MediaLibraryImageButton } from './MediaLibraryImageButton';
import type { MediaLibraryInputUploadOptions } from './types';

type MediaLibraryInputContentsProps = {
  source: string;
  reference: string;
  aspectRatio?: string;
  uploadOptions?: MediaLibraryInputUploadOptions;
};

export const MediaLibraryInputContents: FC<MediaLibraryInputContentsProps> = ({
  source,
  reference,
  aspectRatio,
  uploadOptions,
}: MediaLibraryInputContentsProps) => {
  const { field } = useInput({ source });
  const theme = useTheme();
  const [hasError, setHasError] = useState<boolean>(false);
  const [modalOpen, setModalOpen] = useState<boolean>(false);

  const onClose = () => {
    setModalOpen(false);
  };

  const onImageSelect = (selectedRecord: RaRecord) => {
    field.onChange(selectedRecord.id);
    setModalOpen(false);
  };

  const onImageError = () => {
    setHasError(true);
  };

  const onImageClick = () => {
    setModalOpen(true);
  };

  const { data } = useGetOne(reference, {
    id: field.value,
  });

  const { src, title } = data ?? {};

  if (hasError) {
    return (
      <BrokenImage fontSize="large" sx={{ color: theme.palette.grey[500] }} />
    );
  }

  return (
    <>
      <MediaLibraryModal
        open={modalOpen}
        close={onClose}
        source={source}
        reference={reference}
        aspectRatio={aspectRatio}
        onImageSelect={onImageSelect}
        uploadOptions={uploadOptions}
      />
      <MediaLibraryImageButton
        src={src}
        title={title}
        onImageError={onImageError}
        onClick={onImageClick}
      />
    </>
  );
};
