import { FC } from 'react';
import { SimpleFormIterator, SimpleFormIteratorProps } from 'react-admin';
import { useTheme, Button } from '@mui/material';

type StepFormIteratorProps = SimpleFormIteratorProps & {
  addButtonText?: string;
};

export const StepFormIterator: FC<StepFormIteratorProps> = ({
  addButtonText = 'Add step',
  ...restProps
}: StepFormIteratorProps) => {
  const theme = useTheme();

  return (
    <SimpleFormIterator
      {...restProps}
      disableClear
      sx={{
        flex: 1,
        '.RaSimpleFormIterator-form': { flex: 1 },
        '& .MuiFormControl-root': { width: '100%' },
        border: `1px solid ${theme.palette.grey[300]}`,
        padding: `${theme.spacing(1.5)} ${theme.spacing(2)}`,
        marginTop: theme.spacing(1),
      }}
      addButton={
        <Button size="small" variant="outlined">
          {addButtonText}
        </Button>
      }
    />
  );
};
