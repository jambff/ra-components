import { createContext, FC, ReactNode, useContext, useMemo } from 'react';
import { MediaLibraryOptions } from './options';

export const MediaLibraryContext = createContext<MediaLibraryOptions | null>(
  null,
);

type MediaLibraryProviderProps = MediaLibraryOptions & {
  children: ReactNode;
};

const DEFAULT_ASPECT_RATIO = '3 / 2';

export const MediaLibraryProvider: FC<MediaLibraryProviderProps> = ({
  children,
  supabase,
  resource,
  bucket,
  bucketFolder,
  accept,
  maxSize,
  aspectRatio = DEFAULT_ASPECT_RATIO,
  sort,
}) => {
  const value = useMemo(
    (): MediaLibraryOptions => ({
      supabase,
      resource,
      bucket,
      bucketFolder,
      accept,
      maxSize,
      aspectRatio,
      sort,
    }),
    [
      supabase,
      resource,
      bucket,
      bucketFolder,
      accept,
      maxSize,
      aspectRatio,
      sort,
    ],
  );

  return (
    <MediaLibraryContext.Provider value={value}>
      {children}
    </MediaLibraryContext.Provider>
  );
};

export const useMediaLibraryContext = (): MediaLibraryOptions => {
  const context = useContext(MediaLibraryContext);

  if (!context) {
    throw new Error(
      'useMediaLibraryContext must be called from within a MediaLibraryProvider',
    );
  }

  return context;
};
