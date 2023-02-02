import { FC } from 'react';
import { useRecordContext } from 'react-admin';
import { MediaLibraryCroppedImage } from './MediaLibraryCroppedImage';
import { isVideo } from './utils';
import { MediaLibraryVideo } from './MediaLibraryVideo';

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
      {isVideo(src) ? (
        <MediaLibraryVideo src={src} />
      ) : (
        <MediaLibraryCroppedImage
          src={src}
          title={title}
          width={width}
          height={height}
          crop={crop}
          containerWidth={containerWidth}
        />
      )}
    </div>
  );
};
