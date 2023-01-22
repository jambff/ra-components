import { FC, ReactNode } from 'react';
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
} from 'react-admin';

type CreateFormProps = Omit<CreateProps, 'resource'> & {
  children: ReactNode;
  form?: SimpleFormProps;
};

export const CreateForm: FC<CreateFormProps> = ({
  children,
  form,
  ...restProps
}: CreateFormProps) => {
  const notify = useNotify();
  const redirect = useRedirect();

  const onSuccess = (data: RaRecord, { resource }: { resource?: string }) => {
    if (!resource) {
      throw new Error('No resource found');
    }

    notify(`${capitalCase(singular(resource))} created`);
    redirect('list', resource, data.id, data);
  };

  return (
    <Create mutationOptions={{ onSuccess }} {...restProps}>
      <SimpleForm warnWhenUnsavedChanges {...form}>
        {children}
      </SimpleForm>
    </Create>
  );
};
