import { FC } from 'react';
import { Labeled, WrapperField } from 'react-admin';
import { useTheme } from '@mui/material';
import { MediaLibraryInputContents } from './MediaLibraryInputContents';
import type { MediaLibraryInputUploadOptions } from './types';

type MediaLibraryInputProps = {
  source: string;
  reference: string;
  label?: string;
  aspectRatio?: string;
  uploadOptions?: MediaLibraryInputUploadOptions;
};

export const MediaLibraryInput: FC<MediaLibraryInputProps> = ({
  source,
  label,
  reference,
  aspectRatio,
  uploadOptions,
}: MediaLibraryInputProps) => {
  const theme = useTheme();

  return (
    <Labeled>
      <WrapperField label={label}>
        <div
          style={{
            border: `1px solid ${theme.palette.grey[300]}`,
            marginBottom: theme.spacing(4),
            width: 300,
            height: 200,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <MediaLibraryInputContents
            source={source}
            reference={reference}
            aspectRatio={aspectRatio}
            uploadOptions={uploadOptions}
          />
        </div>
      </WrapperField>
    </Labeled>
  );
};
