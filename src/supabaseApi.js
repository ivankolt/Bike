import { supabase } from './supabaseClient';

export async function insertWorkout(workout) {
  const { data, error } = await supabase
    .from('workouts')
    .insert([workout])
    .select();
  if (error) throw error;
  return data[0];
}

export async function upsertUserProfile(profile) {
  const { data, error } = await supabase
    .from('users')
    .upsert([profile], { onConflict: ['telegram_id'] })
    .select();
  if (error) throw error;
  return data[0];
}

