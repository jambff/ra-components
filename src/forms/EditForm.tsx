import { FC, ReactNode } from 'react';
import { singular } from 'pluralize';
import { capitalCase } from 'change-case';
import {
  Edit,
  EditProps,
  RaRecord,
  SimpleForm,
  SimpleFormProps,
  useNotify,
  useRecordContext,
  useRedirect,
  useResourceContext,
} from 'react-admin';

type EditFormProps = Omit<EditProps, 'resource'> & {
  children: ReactNode;
  form?: Omit<SimpleFormProps, 'children'>;
  titleSource?: string;
};

const getResourceLabel = (resource: string) => capitalCase(singular(resource));

const Title = ({ source }: { source?: string }) => {
  const record = useRecordContext();
  const resource = useResourceContext();

  return (
    <span>
      Edit {getResourceLabel(resource)} -{' '}
      {record && source ? `${record[source]}` : record.id}
    </span>
  );
};

export const EditForm: FC<EditFormProps> = ({
  children,
  form,
  titleSource,
  ...restProps
}: EditFormProps) => {
  const notify = useNotify();
  const redirect = useRedirect();

  const onSuccess = (data: RaRecord, { resource }: { resource?: string }) => {
    if (!resource) {
      throw new Error('No resource found');
    }

    notify(`${getResourceLabel(resource)} updated`);
    redirect('list', resource, data.id, data);
  };

  return (
    <Edit
      title={<Title source={titleSource} />}
      mutationOptions={{ onSuccess }}
      mutationMode="pessimistic"
      {...restProps}>
      <SimpleForm warnWhenUnsavedChanges {...form}>
        {children}
      </SimpleForm>
    </Edit>
  );
};
