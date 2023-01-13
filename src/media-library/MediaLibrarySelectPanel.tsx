import { FC } from 'react';
import { List, RaRecord, SortPayload } from 'react-admin';
import { MediaLibraryModalList } from './MediaLibraryModalList';

type MediaLibrarySelectPanelProps = {
  source: string;
  reference: string;
  onImageSelect: (newRecord: RaRecord) => void;
  aspectRatio?: string;
  sort?: SortPayload;
};

export const MediaLibrarySelectPanel: FC<MediaLibrarySelectPanelProps> = ({
  source,
  reference,
  onImageSelect,
  aspectRatio,
  sort,
}: MediaLibrarySelectPanelProps) => (
  <List
    resource={reference}
    actions={false}
    perPage={40}
    storeKey={`media-library-${reference}-${source}`}
    sort={sort}
    sx={{
      flex: 1,
      '.MuiPaper-root': { borderRadius: 0, flex: 1 },
    }}>
    <MediaLibraryModalList
      onImageSelect={onImageSelect}
      aspectRatio={aspectRatio}
    />
  </List>
);
