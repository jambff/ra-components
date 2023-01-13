import { FC, useState } from 'react';
import { RaRecord, useInput, useGetOne, SortPayload } from 'react-admin';
import { MediaLibraryModal } from './MediaLibraryModal';
import { MediaLibraryImageButton } from './MediaLibraryImageButton';
import type { MediaLibraryInputUploadOptions } from './types';

type MediaLibraryInputContentsProps = {
  source: string;
  reference: string;
  aspectRatio?: string;
  uploadOptions?: MediaLibraryInputUploadOptions;
  sort?: SortPayload;
};

export const MediaLibraryInputContents: FC<MediaLibraryInputContentsProps> = ({
  source,
  reference,
  aspectRatio,
  uploadOptions,
  sort,
}: MediaLibraryInputContentsProps) => {
  const { field } = useInput({ source });
  const [modalOpen, setModalOpen] = useState<boolean>(false);

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

  const { data } = useGetOne(reference, {
    id: field.value,
  });

  const { src, title } = data ?? {};

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
        sort={sort}
      />
      <MediaLibraryImageButton src={src} title={title} onClick={onImageClick} />
    </>
  );
};
