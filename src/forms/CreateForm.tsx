import { FC, ReactNode } from 'react';
import { singular } from 'pluralize';
import { capitalCase } from 'change-case';
import {
  Create,
  EditProps,
  RaRecord,
  SimpleForm,
  useNotify,
  useRedirect,
} from 'react-admin';

type CreateFormProps = Omit<EditProps, 'resource'> & {
  children: ReactNode;
};

export const CreateForm: FC<CreateFormProps> = ({
  children,
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
      <SimpleForm>{children}</SimpleForm>
    </Create>
  );
};
