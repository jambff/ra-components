import { FC, useState } from 'react';
import { RaRecord, useInput, useGetOne } from 'react-admin';
import { MediaLibraryModal } from './MediaLibraryModal';
import { MediaLibraryImageButton } from './MediaLibraryImageButton';
import { useMediaLibraryContext } from './MediaLibraryProvider';

type MediaLibraryInputContentsProps = {
  source: string;
};

export const MediaLibraryInputContents: FC<MediaLibraryInputContentsProps> = ({
  source,
}: MediaLibraryInputContentsProps) => {
  const { field } = useInput({ source });
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const { resource } = useMediaLibraryContext();

  const onClose = () => {
    setModalOpen(false);
  };

  const onImageSelect = (selectedRecord: RaRecord) => {
    field.onChange(selectedRecord.id);
    setModalOpen(false);
  };

  const onImageClick = () => {
    setModalOpen(true);
  };

  const { data, isLoading: isImageLoading } = useGetOne(resource, {
    id: field.value,
  });

  const { src, title, width, height, crop } = data ?? {};

  return (
    <>
      <MediaLibraryModal
        open={modalOpen}
        close={onClose}
        source={source}
        onImageSelect={onImageSelect}
      />
      <MediaLibraryImageButton
        src={src}
        title={title}
        onClick={onImageClick}
        width={width}
        height={height}
        crop={crop}
        isImageLoading={isImageLoading}
      />
    </>
  );
};
