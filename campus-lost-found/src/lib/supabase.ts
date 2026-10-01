import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://gwhlsqmefxpcayglwewd.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd3aGxzcW1lZnhwY2F5Z2x3ZXdkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTA4NjcwNTIsImV4cCI6MjEwNjQ0MzA1Mn0.-4jP7_kZsftZ-oSe5A_rW1f3o_C9zTC4NBPnC9qBMqM'
export const supabase = createClient(supabaseUrl, supabaseKey)