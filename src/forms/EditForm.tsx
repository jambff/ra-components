import { FC, ReactNode, useCallback } from 'react';
import { singular } from 'pluralize';
import { capitalCase } from 'change-case';
import {
  Edit,
  EditProps,
  RaRecord,
  SimpleForm,
  SimpleFormProps,
  useNotify,
  useRedirect,
  useResourceContext,
} from 'react-admin';
import { useFormContext } from './FormProvider';

type EditFormProps = Omit<EditProps, 'resource'> & {
  children: ReactNode;
  form?: Omit<SimpleFormProps, 'children'>;
};

export const EditForm: FC<EditFormProps> = ({
  children,
  form,
  ...restProps
}: EditFormProps) => {
  const notify = useNotify();
  const redirect = useRedirect();
  const { onError } = useFormContext();
  const resource = useResourceContext();

  const onSuccess = useCallback(
    (data: RaRecord) => {
      if (!resource) {
        throw new Error('No resource found');
      }

      notify(`${capitalCase(singular(resource))} updated`);
      redirect('list', resource, data.id, data);
    },
    [resource, redirect, notify],
  );

  return (
    <Edit
      mutationMode="pessimistic"
      mutationOptions={{ onSuccess, onError }}
      {...restProps}>
      <SimpleForm warnWhenUnsavedChanges {...form}>
        {children}
      </SimpleForm>
    </Edit>
  );
};
