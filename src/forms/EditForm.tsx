import { FC, ReactNode, useCallback } from 'react';
import { singular } from 'pluralize';
import { capitalCase } from 'change-case';
import {
  CreateParams,
  Edit,
  EditProps,
  RaRecord,
  SimpleForm,
  SimpleFormProps,
  useNotify,
  useRedirect,
  useResourceContext,
  useUpdate,
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
  const [update] = useUpdate();
  const resource = useResourceContext();

  const onSubmit = useCallback(
    async (values: Partial<CreateParams<RaRecord>>) => {
      try {
        await update(
          resource,
          { data: values },
          {
            returnPromise: true,
            onSuccess: (data: RaRecord) => {
              if (!resource) {
                throw new Error('No resource found');
              }

              notify(`${capitalCase(singular(resource))} created`);
              redirect('list', resource, data.id, data);
            },
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
    [update, notify, redirect, resource, onError],
  );

  return (
    <Edit mutationMode="pessimistic" {...restProps}>
      <SimpleForm warnWhenUnsavedChanges onSubmit={onSubmit} {...form}>
        {children}
      </SimpleForm>
    </Edit>
  );
};
