
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { SupabaseFamily } from '@/types/supabase';

export const useFamilies = () => {
  const [families, setFamilies] = useState<SupabaseFamily[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const fetchFamilies = async () => {
    if (!user) return;

    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase
        .from('families')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setFamilies(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const createFamily = async (familyData: Omit<SupabaseFamily, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('families')
      .insert([{ ...familyData, user_id: user.id }])
      .select()
      .single();

    if (error) throw error;

    setFamilies(prev => [data, ...prev]);
    return data;
  };

  const deleteFamily = async (id: string) => {
    const { error } = await supabase
      .from('families')
      .delete()
      .eq('id', id);

    if (error) throw error;

    setFamilies(prev => prev.filter(family => family.id !== id));
  };

  useEffect(() => {
    fetchFamilies();
  }, [user]);

  return {
    families,
    loading,
    error,
    createFamily,
    deleteFamily,
    refetch: fetchFamilies
  };
};
