import { createClient } from '@supabase/supabase-js';

// Вставьте свои значения из настроек проекта Supabase:
const supabaseUrl = 'https://zefpwtarplbolwlbdlwx.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InplZnB3dGFycGxib2x3bGJkbHd4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA2ODM5NTAsImV4cCI6MjA2NjI1OTk1MH0.sqSCs6OZmGWwLV1FxBifwFPTPE0w3GjGkvJZgoO1yek';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
