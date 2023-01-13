import { FC } from 'react';
import { RaRecord, useListContext } from 'react-admin';
import { useTheme } from '@mui/material';
import { MediaLibraryImageButton } from './MediaLibraryImageButton';

type MediaLibraryModalListProps = {
  onMediaLibrarySelect: (record: RaRecord) => void;
};

const IMAGE_DIMENSIONS = 130;

export const MediaLibraryModalList: FC<MediaLibraryModalListProps> = ({
  onMediaLibrarySelect,
}: MediaLibraryModalListProps) => {
  const { data } = useListContext();
  const theme = useTheme();

  if (!data) {
    return null;
  }

  return (
    <div
      style={{
        padding: `0 ${theme.spacing(4)}`,
        display: 'flex',
        flexWrap: 'wrap',
        gap: 15,
        flex: 1,
      }}>
      {data?.map((record) => (
        <div
          key={record.src}
          style={{
            width: IMAGE_DIMENSIONS,
            height: IMAGE_DIMENSIONS,
            border: `1px solid ${theme.palette.grey[300]}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <MediaLibraryImageButton
            src={record.src}
            onClick={() => {
              onMediaLibrarySelect(record);
            }}
          />
        </div>
      ))}
    </div>
  );
};
