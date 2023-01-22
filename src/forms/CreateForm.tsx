import { FC, ReactNode } from 'react';
import { singular } from 'pluralize';
import { capitalCase } from 'change-case';
import {
  Create,
  CreateProps,
  RaRecord,
  SimpleForm,
  useNotify,
  useRedirect,
} from 'react-admin';

type CreateFormProps = Omit<CreateProps, 'resource'> & {
  children: ReactNode;
  warnWhenUnsavedChanges?: boolean;
};

export const CreateForm: FC<CreateFormProps> = ({
  children,
  warnWhenUnsavedChanges,
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
      <SimpleForm warnWhenUnsavedChanges={warnWhenUnsavedChanges}>
        {children}
      </SimpleForm>
    </Create>
  );
};
