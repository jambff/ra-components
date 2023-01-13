import { FC } from 'react';
import { Button } from 'react-admin';

type MediaLibraryImageButtonProps = {
  src: string;
  onImageError?: () => void;
  onClick: () => void;
};

export const MediaLibraryImageButton: FC<MediaLibraryImageButtonProps> = ({
  src,
  onImageError,
  onClick,
}: MediaLibraryImageButtonProps) => (
  <Button
    onClick={onClick}
    sx={{
      padding: 0,
      width: '100%',
      height: '100%',
      '.MuiButton-startIcon': { margin: 0 },
    }}>
    <img
      src={src}
      onError={onImageError}
      style={{
        objectFit: 'contain',
        width: '100%',
        maxHeight: '100%',
      }}
      alt=""
    />
  </Button>
);
