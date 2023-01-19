import { FC } from 'react';
import { useRecordContext } from 'react-admin';
import { MediaLibraryCroppedImage } from './MediaLibraryCroppedImage';

type MediaLibraryRecordImageFieldProps = {
  width?: number;
};

export const MediaLibraryRecordImageField: FC<
  MediaLibraryRecordImageFieldProps
> = ({ width: containerWidth = 150 }: MediaLibraryRecordImageFieldProps) => {
  const record = useRecordContext();
  const { src, title, width, height, crop } = record;

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
