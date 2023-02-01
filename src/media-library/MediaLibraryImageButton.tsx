import { FC } from 'react';
import { Button } from 'react-admin';
import { MediaLibraryCroppedImage } from './MediaLibraryCroppedImage';
import { isVideo } from './utils';

type MediaLibraryImageButtonProps = {
  src?: string;
  title: string;
  width?: number;
  height?: number;
  crop?: number[];
  onClick: () => void;
  isImageLoading?: boolean;
};

export const MediaLibraryImageButton: FC<MediaLibraryImageButtonProps> = ({
  src,
  title,
  onClick,
  width,
  height,
  crop,
  isImageLoading,
}: MediaLibraryImageButtonProps) => (
  <Button
    onClick={onClick}
    variant="text"
    size="small"
    sx={{
      padding: 0,
      width: '100%',
      height: '100%',
      '.MuiButton-startIcon': { margin: 0 },
    }}>
    {(() => {
      if (!src) {
        // eslint-disable-next-line react/jsx-no-useless-fragment
        return <>{isImageLoading ? '' : 'Click to select an image'}</>;
      }

      if (isVideo(src)) {
        return (
          // eslint-disable-next-line jsx-a11y/media-has-caption
          <video
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
    })()}
  </Button>
);
