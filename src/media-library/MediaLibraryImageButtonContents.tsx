import { useTheme } from '@mui/material';
import { FC, useState } from 'react';
import BrokenImage from '@mui/icons-material/BrokenImage';

type MediaLibraryImageButtonContentProps = {
  src?: string;
  title: string;
};

export const MediaLibraryImageButtonContents: FC<
  MediaLibraryImageButtonContentProps
> = ({ src, title }: MediaLibraryImageButtonContentProps) => {
  const theme = useTheme();
  const [hasError, setHasError] = useState<boolean>(false);

  const onError = () => {
    setHasError(true);
  };

  if (src) {
    return (
      <img
        src={src}
        title={title}
        onError={onError}
        style={{
          objectFit: 'contain',
          width: '100%',
          maxHeight: '100%',
        }}
        alt=""
      />
    );
  }

  if (hasError) {
    return (
      <BrokenImage fontSize="large" sx={{ color: theme.palette.grey[500] }} />
    );
  }

  return <>Click to select an image</>;
};
