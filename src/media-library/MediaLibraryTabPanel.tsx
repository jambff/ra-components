import { FC, ReactNode } from 'react';
import { Typography, Box } from '@mui/material';
import { getTabIds } from './utils';

interface MediaLibraryTabPanelProps {
  children?: ReactNode;
  index: number;
  value: number;
}

export const MediaLibraryTabPanel: FC<MediaLibraryTabPanelProps> = ({
  children,
  value,
  index,
  ...restProps
}: MediaLibraryTabPanelProps) => {
  const { tabId, tabPanelId } = getTabIds(index);

  return (
    <div
      role="tabpanel"
      id={tabPanelId}
      aria-labelledby={tabId}
      hidden={value !== index}
      style={{ overflow: 'auto' }}
      {...restProps}>
      {value === index && (
        <Box>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
};
