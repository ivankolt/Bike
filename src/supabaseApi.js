import { supabase } from './supabaseClient';

export async function insertWorkout(workout) {
  const { data, error } = await supabase
    .from('workouts')
    .insert([workout])
    .select();
  if (error) throw error;
  return data[0];
}
