import { FC } from 'react';
import { Button } from 'react-admin';

type MediaLibraryImageButtonProps = {
  src?: string;
  title: string;
  onImageError?: () => void;
  onClick: () => void;
};

export const MediaLibraryImageButton: FC<MediaLibraryImageButtonProps> = ({
  src,
  title,
  onImageError,
  onClick,
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
      <img
        src={src}
        title={title}
        onError={onImageError}
        style={{
          objectFit: 'contain',
          width: '100%',
          maxHeight: '100%',
        }}
        alt=""
      />
    ) : (
      <>Click to select an image</>
    )}
  </Button>
);
