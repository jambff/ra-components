import { FC } from 'react';
import { ImageField, RaRecord, useInput } from 'react-admin';
import { MediaLibraryCroppedImage } from './MediaLibraryCroppedImage';
import { MediaLibraryImage } from './image';

type MediaLibraryImageFieldProps = {
  record?: RaRecord;
  source: string;
  width?: number;
};

const isMediaLibraryImage = (obj: any): obj is MediaLibraryImage =>
  typeof obj?.src === 'string' &&
  typeof obj?.width === 'number' &&
  typeof obj?.height === 'number';

export const MediaLibraryImageField: FC<MediaLibraryImageFieldProps> = ({
  record,
  source,
  width: containerWidth = 150,
}: MediaLibraryImageFieldProps) => {
  const { field } = useInput({ source });
  const data = record ?? field;

  if (!isMediaLibraryImage(data)) {
    return <ImageField source={source} />;
  }

  const { src, title, width, height, crop } = data;

  return (
    <div style={{ width: containerWidth }}>
      <MediaLibraryCroppedImage
        src={src}
        title={title}
        width={width}
        height={height}
        crop={crop}
      />
    </div>
  );
};
