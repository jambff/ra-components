import { FC } from 'react';
import { Button, List, RaRecord, SortButton } from 'react-admin';
import { useTheme, Typography, Modal, Box } from '@mui/material';
import Close from '@mui/icons-material/Close';
import { MediaLibraryModalList } from './MediaLibraryModalList';

type MediaLibraryModalProps = {
  open: boolean;
  source: string;
  reference: string;
  close: () => void;
  onMediaLibrarySelect: (newRecord: RaRecord) => void;
};

export const MediaLibraryModal: FC<MediaLibraryModalProps> = ({
  open,
  source,
  reference,
  close,
  onMediaLibrarySelect,
}: MediaLibraryModalProps) => {
  const theme = useTheme();
  const titleId = `medial-library-${reference}-${source}`;

  return (
    <Modal open={open} aria-labelledby={titleId}>
      <Box
        sx={{
          bgcolor: 'background.paper',
          border: '2px solid #000',
          boxShadow: 24,
          position: 'fixed',
          zIndex: '1300',
          right: 30,
          bottom: 30,
          top: 30,
          left: 30,
          outline: 0,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'auto',
        }}>
        <List
          resource={reference}
          actions={false}
          perPage={40}
          storeKey={`media-modal-${reference}-${source}`}
          sx={{
            flex: 1,
            '.MuiPaper-root': { borderRadius: 0, flex: 1 },
          }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              padding: `${theme.spacing(2)} ${theme.spacing(3)}`,
            }}>
            <Typography id={titleId} variant="h6" component="h2">
              Select image
            </Typography>
            <div>
              <SortButton fields={['createdAt']} />
              <Button
                onClick={close}
                label="Close"
                endIcon={<Close />}
                sx={{
                  marginLeft: theme.spacing(2),
                }}
              />
            </div>
          </div>

          <MediaLibraryModalList onMediaLibrarySelect={onMediaLibrarySelect} />
        </List>
      </Box>
    </Modal>
  );
};
