import { FC, useCallback, useState } from 'react';
import { Button, RaRecord, useCreate, useNotify } from 'react-admin';
import {
  Box,
  LinearProgress,
  Slider,
  Typography,
  useTheme,
} from '@mui/material';
import { paramCase } from 'param-case';
import Save from '@mui/icons-material/Save';
import Cropper, { Area } from 'react-easy-crop';
import imageCompression from 'browser-image-compression';
import { isMatch } from 'matcher';
import { MediaLibraryDropZone } from './MediaLibraryDropZone';
import { useSupabaseStorage } from './useSupabaseStorage';
import { useMediaLibraryContext } from './MediaLibraryProvider';

type MediaLibraryUploadPanelProps = {
  onImageSelect: (newRecord: RaRecord) => void;
};

type ImageData = {
  publicUrl: string;
  file: File;
};

const createImageFromFile = async (file: File): Promise<HTMLImageElement> =>
  new Promise((resolve) => {
    const img = new Image();
    const fileReader = new FileReader();

    img.onload = () => {
      resolve(img);
    };

    fileReader.onload = ({ target }) => {
      if (!target?.result) {
        throw new Error('Failed to read file');
      }

      const { result } = target;

      img.src =
        typeof result === 'string' ? result : Buffer.from(result).toString();
    };

    fileReader.readAsDataURL(file);
  });

const getConvertedFileName = (file: File) => {
  const fileParts = file.name.split('.');
  const ext = fileParts.pop();

  return `${paramCase(fileParts.join('.'))}.${ext}`;
};

export const MediaLibraryUploadPanel: FC<MediaLibraryUploadPanelProps> = ({
  onImageSelect,
}: MediaLibraryUploadPanelProps) => {
  const [imageData, setImageData] = useState<ImageData>();

  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area>();
  const {
    resource,
    aspectRatio,
    croppable,
    parseImageUrl = (url: string) => url,
    resizeOptions,
    convertFileName,
  } = useMediaLibraryContext();

  const { upload, isUploading } = useSupabaseStorage();
  const [create] = useCreate();
  const notify = useNotify();
  const theme = useTheme();

  const save = useCallback(
    async (data?: ImageData) => {
      const finalImageData = data ?? imageData;

      if (!finalImageData) {
        throw new Error('Failed to crop as image data is not available yet');
      }

      const { publicUrl, file } = finalImageData;
      const img = await createImageFromFile(file);

      create(
        resource,
        {
          data: {
            src: parseImageUrl(publicUrl),
            title: file.name.replace(/\.[^.]*$/, ''),
            width: img.width,
            height: img.height,
            crop: croppedAreaPixels
              ? [
                  croppedAreaPixels.x,
                  croppedAreaPixels.y,
                  croppedAreaPixels.width,
                  croppedAreaPixels.height,
                ]
              : undefined,
          },
        },
        {
          onSuccess: onImageSelect,
        },
      );
    },
    [
      create,
      resource,
      imageData,
      onImageSelect,
      croppedAreaPixels,
      parseImageUrl,
    ],
  );

  const onSaveClick = useCallback(() => {
    save();
  }, [save]);

  const compressFile = useCallback(
    (file: File) => {
      if (!isMatch(file.type, 'image/*')) {
        return file;
      }

      return imageCompression(file, {
        ...resizeOptions,
        useWebWorker: true,
      });
    },
    [resizeOptions],
  );

  const onChange = useCallback(
    async (file?: File) => {
      if (!file) {
        throw new Error('The file could not be uploaded');
      }

      const compressedFile = resizeOptions ? await compressFile(file) : file;

      let data;

      const fileName = convertFileName ? getConvertedFileName(file) : file.name;

      try {
        data = await upload(compressedFile, fileName);
      } catch (err) {
        notify(err.message, { type: 'error' });

        return;
      }

      if (!croppable) {
        save(data);

        return;
      }

      setImageData(data);
    },
    [
      notify,
      upload,
      croppable,
      save,
      resizeOptions,
      compressFile,
      convertFileName,
    ],
  );

  const onCropComplete = useCallback((_croppedArea: Area, pixels: Area) => {
    setCroppedAreaPixels(pixels);
  }, []);

  const onZoomSliderChange = (_event: Event, value: number) => {
    setZoom(value);
  };

  const onResetClick = () => {
    setImageData(undefined);
  };

  if (isUploading) {
    return (
      <Box
        sx={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
        }}>
        <LinearProgress />
        <Box
          sx={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            userSelect: 'none',
          }}>
          <Typography>Uploading...</Typography>
        </Box>
      </Box>
    );
  }

  const parsedAspectRatio = aspectRatio
    ?.split('/')
    .map((part) => Number(part.trim()));

  if (imageData && croppable) {
    return (
      <Box
        sx={{
          position: 'relative',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
        }}>
        <Box sx={{ flex: 1, position: 'relative' }}>
          <Cropper
            image={imageData.publicUrl}
            crop={crop}
            zoom={zoom}
            aspect={
              parsedAspectRatio
                ? parsedAspectRatio[0] / parsedAspectRatio[1]
                : undefined
            }
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={onCropComplete}
          />
        </Box>
        <Box
          sx={{
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexDirection: 'row',
            padding: '20px',
          }}>
          <Slider
            aria-label="Volume"
            value={zoom}
            onChange={onZoomSliderChange}
            min={1}
            max={5}
            step={0.1}
            sx={{ width: '30%', left: '50%', transform: 'translateX(-50%)' }}
          />
          <Box>
            <Button
              onClick={onResetClick}
              variant="outlined"
              size="large"
              label="Clear"
              sx={{ marginRight: theme.spacing(2) }}
            />
            <Button
              onClick={onSaveClick}
              variant="contained"
              size="large"
              startIcon={<Save />}
              label="Save"
            />
          </Box>
        </Box>
      </Box>
    );
  }

  return <MediaLibraryDropZone onChange={onChange} />;
};
