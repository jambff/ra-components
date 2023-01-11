import { FC } from 'react';
import { ArrayInput, ArrayInputProps, TextInput } from 'react-admin';
import { useTheme } from '@mui/material';
import { StepFormIterator } from './StepFormIterator';

type TextArrayInputProps = Omit<ArrayInputProps, 'children'> & {
  addButtonText?: string;
};

export const TextArrayInput: FC<TextArrayInputProps> = ({
  addButtonText,
  ...restProps
}: TextArrayInputProps) => {
  const theme = useTheme();

  return (
    <ArrayInput {...restProps} sx={{ marginBottom: theme.spacing(4) }}>
      <StepFormIterator addButtonText={addButtonText}>
        <TextInput source="" />
      </StepFormIterator>
    </ArrayInput>
  );
};
