import type { SupabaseClient } from '@supabase/supabase-js';

export type MediaLibraryInputUploadOptions = {
  supabase: SupabaseClient;
  resource: string;
  bucket: string;
  bucketFolder?: string;
  accept?: string;
  maxSize?: number;
};
