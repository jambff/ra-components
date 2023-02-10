import { FC, ReactNode, useCallback } from 'react';
import { singular } from 'pluralize';
import { capitalCase } from 'change-case';
import {
  Create,
  CreateProps,
  RaRecord,
  SimpleForm,
  SimpleFormProps,
  useNotify,
  useRedirect,
  useResourceContext,
} from 'react-admin';
import { useFormContext } from './FormProvider';

type CreateFormProps = Omit<CreateProps, 'resource'> & {
  children: ReactNode;
  form?: Omit<SimpleFormProps, 'children'>;
};

export const CreateForm: FC<CreateFormProps> = ({
  children,
  form,
  ...restProps
}: CreateFormProps) => {
  const notify = useNotify();
  const redirect = useRedirect();
  const { onError } = useFormContext();
  const resource = useResourceContext();

  const onSuccess = useCallback(
    (data: RaRecord) => {
      if (!resource) {
        throw new Error('No resource found');
      }

      notify(`${capitalCase(singular(resource))} created`);
      redirect('list', resource, data.id, data);
    },
    [resource, redirect, notify],
  );

  return (
    <Create mutationOptions={{ onSuccess, onError }} {...restProps}>
      <SimpleForm warnWhenUnsavedChanges {...form}>
        {children}
      </SimpleForm>
    </Create>
  );
};
