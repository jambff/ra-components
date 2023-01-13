import { FC } from 'react';
import { RaRecord, useListContext } from 'react-admin';
import { Box, useTheme } from '@mui/material';
import { MediaLibraryImageButton } from './MediaLibraryImageButton';

type MediaLibraryModalListProps = {
  aspectRatio?: string;
  onImageSelect: (record: RaRecord) => void;
};

export const MediaLibraryModalList: FC<MediaLibraryModalListProps> = ({
  aspectRatio = '3 / 2',
  onImageSelect,
}: MediaLibraryModalListProps) => {
  const { data } = useListContext();
  const theme = useTheme();

  if (!data) {
    return null;
  }

  return (
    <Box
      component="ul"
      sx={{
        padding: 0,
        display: 'grid',
        gridTemplateColumns: {
          xs: 'repeat(2, 1fr)',
          md: 'repeat(4, 1fr)',
          lg: 'repeat(5, 1fr)',
          xl: 'repeat(8, 1fr)',
        },
        gridGap: theme.spacing(2),
        px: theme.spacing(2),
      }}>
      {data?.map((record) => (
        <Box
          key={record.src}
          component="li"
          sx={{
            width: '100%',
            height: 'auto',
            listStyle: 'none',
            userSelect: 'none',
            display: 'flex',
            alignItems: 'center',
            border: `1px solid ${theme.palette.grey[300]}`,
            aspectRatio,
          }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <MediaLibraryImageButton
              src={record.src}
              title={record.title}
              onClick={() => {
                onImageSelect(record);
              }}
            />
          </div>
        </Box>
      ))}
    </Box>
  );
};
