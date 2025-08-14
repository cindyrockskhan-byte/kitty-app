import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://tlordkbgeuxdyaqdvheg.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRsb3Jka2JnZXV4ZHlhcWR2aGVnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTEzMjM2NzEsImV4cCI6MjA2Njg5OTY3MX0.5g0_mhBbbk772kjgycE8vjOhR8L0zs52BPcA3yUjeu8';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);