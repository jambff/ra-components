import { useTheme } from '@mui/material';
import { FC, useEffect, useRef, useState } from 'react';
import BrokenImage from '@mui/icons-material/BrokenImage';
import { useMediaLibraryContext } from './MediaLibraryProvider';
import { MediaLibraryImage } from './image';

type MediaLibraryCroppedImageProps = MediaLibraryImage & {
  containerWidth?: number;
};

export const MediaLibraryCroppedImage: FC<MediaLibraryCroppedImageProps> = ({
  src,
  title,
  width,
  height,
  crop,
  containerWidth,
}: MediaLibraryCroppedImageProps) => {
  const theme = useTheme();
  const [hasError, setHasError] = useState<boolean>(false);
  const [scale, setScale] = useState(1);
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [xPosition, setXPosition] = useState<number>(0);
  const [yPosition, setYPosition] = useState<number>(0);
  const { aspectRatio, croppable, formatImageUrl } = useMediaLibraryContext();
  const ref = useRef<HTMLImageElement>(null);

  const onError = () => {
    setHasError(true);
  };

  useEffect(() => {
    if (
      !!formatImageUrl ||
      !croppable ||
      !isImageLoaded ||
      !ref.current ||
      !crop ||
      crop.length < 4 ||
      !width ||
      !height
    ) {
      return;
    }

    const [x, y, croppedWidth, croppedHeight] = crop ?? [];

    const imgScale = width / croppedWidth;
    const rect = ref.current.getBoundingClientRect();

    const scaledWidth = rect.width * imgScale;
    const scaledHeight = rect.height * imgScale;

    const outOfViewWidth = (scaledWidth - rect.width) / 2;
    const outOfViewHeight = (scaledHeight - rect.height) / 2;

    const offsetX = outOfViewWidth / imgScale;
    const offsetY = outOfViewHeight / imgScale;

    const scaledX = ((rect.width / croppedWidth) * x) / imgScale;
    const scaledY = ((rect.height / croppedHeight) * y) / imgScale;

    setScale(imgScale);
    setXPosition(offsetX - scaledX);
    setYPosition(offsetY - scaledY);
  }, [isImageLoaded, crop, width, height, croppable, formatImageUrl]);

  if (hasError) {
    return (
      <BrokenImage fontSize="large" sx={{ color: theme.palette.grey[500] }} />
    );
  }

  return (
    <div
      ref={ref}
      style={{
        overflow: 'hidden',
        aspectRatio,
      }}>
      <img
        src={formatImageUrl ? formatImageUrl(src, containerWidth) : src}
        title={title}
        onError={onError}
        onLoad={() => {
          setIsImageLoaded(true);
        }}
        style={{
          objectFit: 'cover',
          width: '100%',
          maxHeight: '100%',
          transform: `scale(${scale})`,
          objectPosition: `${xPosition}px ${yPosition}px`,
          display: isImageLoaded ? 'block' : 'none',
          aspectRatio,
        }}
        alt=""
      />
    </div>
  );
};
