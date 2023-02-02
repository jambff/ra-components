import { FC } from 'react';
import { MediaLibraryCroppedImage } from './MediaLibraryCroppedImage';
import { isVideo } from './utils';

type MediaLibraryButtonContentsProps = {
  src?: string;
  title: string;
  width?: number;
  height?: number;
  crop?: number[];
  isImageLoading?: boolean;
};

export const MediaLibraryButtonContents: FC<
  MediaLibraryButtonContentsProps
> = ({
  src,
  title,
  width,
  height,
  crop,
  isImageLoading,
}: MediaLibraryButtonContentsProps) => {
  if (!src) {
    return <>Click to select an image</>;
  }

  if (isImageLoading) {
    return <>Loading...</>;
  }

  if (isVideo(src)) {
    return (
      // eslint-disable-next-line jsx-a11y/media-has-caption
      <video
        key={src} // Trigger re-render when src changes
        style={{
          width: '100%',
          display: 'block',
        }}>
        <source src={src} type="video/mp4" />
      </video>
    );
  }

  return (
    <MediaLibraryCroppedImage
      src={src}
      title={title}
      width={width}
      height={height}
      crop={crop}
    />
  );
};
