import { FC } from 'react';
import { Button } from 'react-admin';
import { MediaLibraryCroppedImage } from './MediaLibraryCroppedImage';

type MediaLibraryImageButtonProps = {
  src?: string;
  title: string;
  width?: number;
  height?: number;
  crop?: number[];
  onClick: () => void;
};

export const MediaLibraryImageButton: FC<MediaLibraryImageButtonProps> = ({
  src,
  title,
  onClick,
  width,
  height,
  crop,
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
    {src ? (
      <MediaLibraryCroppedImage
        src={src}
        title={title}
        width={width}
        height={height}
        crop={crop}
      />
    ) : (
      <>Click to select an image</>
    )}
  </Button>
);
