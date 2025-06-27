import { createClient } from '@supabase/supabase-js';

// Вставьте свои значения из настроек проекта Supabase:
const supabaseUrl = 'https://yoekklrenozceogwogwi.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlvZWtrbHJlbm96Y2VvZ3dvZ3dpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTEwMjc5ODEsImV4cCI6MjA2NjYwMzk4MX0.3tDsZiFWrIQae-3TXWXwHR3x0jdYkZozOYqSsixjvmI';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
