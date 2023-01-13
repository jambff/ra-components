import { FC } from 'react';
import { Button } from 'react-admin';
import { MediaLibraryImageButtonContents } from './MediaLibraryImageButtonContents';

type MediaLibraryImageButtonProps = {
  src?: string;
  title: string;
  onClick: () => void;
};

export const MediaLibraryImageButton: FC<MediaLibraryImageButtonProps> = ({
  src,
  title,
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
    <MediaLibraryImageButtonContents src={src} title={title} />
  </Button>
);
