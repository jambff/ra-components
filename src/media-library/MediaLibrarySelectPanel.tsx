import { FC } from 'react';
import { List, RaRecord } from 'react-admin';
import { MediaLibraryModalList } from './MediaLibraryModalList';
import { useMediaLibraryContext } from './MediaLibraryProvider';

type MediaLibrarySelectPanelProps = {
  source: string;
  onImageSelect: (newRecord: RaRecord) => void;
};

export const MediaLibrarySelectPanel: FC<MediaLibrarySelectPanelProps> = ({
  source,
  onImageSelect,
}: MediaLibrarySelectPanelProps) => {
  const { resource, sort } = useMediaLibraryContext();

  return (
    <List
      resource={resource}
      actions={false}
      perPage={40}
      storeKey={`media-library-${resource}-${source}`}
      sort={sort}
      sx={{
        flex: 1,
        height: '100%',
        '.MuiPaper-root': { borderRadius: 0, flex: 1 },
        '.RaList-main': { height: '100%' },
      }}>
      <MediaLibraryModalList onImageSelect={onImageSelect} />
    </List>
  );
};
