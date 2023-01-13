import { FC, useState } from 'react';
import { RaRecord, useInput, useGetOne } from 'react-admin';
import { useTheme } from '@mui/material';
import BrokenImage from '@mui/icons-material/BrokenImage';
import { MediaLibraryModal } from './MediaLibraryModal';
import { MediaLibraryImageButton } from './MediaLibraryImageButton';

type MediaLibraryInputContentsProps = {
  source: string;
  reference: string;
};

export const MediaLibraryInputContents: FC<MediaLibraryInputContentsProps> = ({
  source,
  reference,
}: MediaLibraryInputContentsProps) => {
  const { field } = useInput({ source });
  const theme = useTheme();
  const [hasError, setHasError] = useState<boolean>(false);
  const [modalOpen, setModalOpen] = useState<boolean>(false);

  const { data } = useGetOne(reference, {
    id: field.value,
  });

  const { src, title } = data ?? {};

  if (hasError) {
    return (
      <BrokenImage fontSize="large" sx={{ color: theme.palette.grey[500] }} />
    );
  }

  if (!src) {
    return null;
  }

  return (
    <>
      <MediaLibraryModal
        open={modalOpen}
        close={() => {
          setModalOpen(false);
        }}
        source={source}
        reference={reference}
        onMediaLibrarySelect={(selectedRecord: RaRecord) => {
          field.onChange(selectedRecord.id);
          setModalOpen(false);
        }}
      />
      <MediaLibraryImageButton
        src={src}
        title={title}
        onImageError={() => {
          setHasError(true);
        }}
        onClick={() => {
          setModalOpen(true);
        }}
      />
    </>
  );
};
