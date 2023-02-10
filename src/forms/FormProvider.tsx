import { createContext, FC, ReactNode, useContext, useMemo } from 'react';

type FormOptions = {
  onError?: (err: unknown) => Record<string, string>;
};

export const FormContext = createContext<FormOptions>({
  onError: () => ({}),
});

type FormProviderProps = FormOptions & {
  children: ReactNode;
};

export const FormProvider: FC<FormProviderProps> = ({ children, onError }) => {
  const value = useMemo(
    (): FormOptions => ({
      onError,
    }),
    [onError],
  );

  return <FormContext.Provider value={value}>{children}</FormContext.Provider>;
};

export const useFormContext = (): FormOptions => {
  const context = useContext(FormContext);

  if (!context) {
    throw new Error('useFormContext must be called from within a FormProvider');
  }

  return context;
};
