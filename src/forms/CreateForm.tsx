import { FC, ReactNode, useCallback } from 'react';
import { singular } from 'pluralize';
import { capitalCase } from 'change-case';
import {
  Create,
  CreateParams,
  CreateProps,
  RaRecord,
  SimpleForm,
  SimpleFormProps,
  useCreate,
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
  const [create] = useCreate();
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

  const onSubmit = useCallback(
    async (values: Partial<CreateParams<RaRecord>>) => {
      try {
        await create(
          resource,
          { data: values },
          {
            returnPromise: true,
            onSuccess,
          },
        );
      } catch (error: any) {
        if (onError) {
          return onError(error);
        }

        throw error;
      }

      return null;
    },
    [create, onSuccess, resource, onError],
  );

  return (
    <Create mutationOptions={{ onSuccess }} {...restProps}>
      <SimpleForm warnWhenUnsavedChanges onSubmit={onSubmit} {...form}>
        {children}
      </SimpleForm>
    </Create>
  );
};
