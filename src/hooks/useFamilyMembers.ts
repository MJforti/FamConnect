
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { SupabaseFamilyMember, SupabaseFamilyRelationship } from '@/types/supabase';

export const useFamilyMembers = (familyId: string | null) => {
  const [members, setMembers] = useState<SupabaseFamilyMember[]>([]);
  const [relationships, setRelationships] = useState<SupabaseFamilyRelationship[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const fetchMembers = async () => {
    if (!familyId || !user) return;

    setLoading(true);
    setError(null);

    try {
      const { data: membersData, error: membersError } = await supabase
        .from('family_members')
        .select('*')
        .eq('family_id', familyId);

      if (membersError) throw membersError;

      const { data: relationshipsData, error: relationshipsError } = await supabase
        .from('family_relationships')
        .select('*')
        .eq('family_id', familyId);

      if (relationshipsError) throw relationshipsError;

      setMembers((membersData || []) as SupabaseFamilyMember[]);
      setRelationships((relationshipsData || []) as SupabaseFamilyRelationship[]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const addMember = async (memberData: Omit<SupabaseFamilyMember, 'id' | 'created_at' | 'updated_at'>) => {
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('family_members')
      .insert([{ ...memberData, user_id: user.id }])
      .select()
      .single();

    if (error) throw error;

    setMembers(prev => [...prev, data as SupabaseFamilyMember]);
    return data as SupabaseFamilyMember;
  };

  const updateMember = async (id: string, updates: Partial<SupabaseFamilyMember>) => {
    const { data, error } = await supabase
      .from('family_members')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    setMembers(prev => prev.map(member => member.id === id ? data as SupabaseFamilyMember : member));
    return data as SupabaseFamilyMember;
  };

  const deleteMember = async (id: string) => {
    const { error } = await supabase
      .from('family_members')
      .delete()
      .eq('id', id);

    if (error) throw error;

    setMembers(prev => prev.filter(member => member.id !== id));
  };

  const addRelationship = async (relationshipData: Omit<SupabaseFamilyRelationship, 'id' | 'created_at'>) => {
    const { data, error } = await supabase
      .from('family_relationships')
      .insert([relationshipData])
      .select()
      .single();

    if (error) throw error;

    setRelationships(prev => [...prev, data as SupabaseFamilyRelationship]);
    return data as SupabaseFamilyRelationship;
  };

  useEffect(() => {
    fetchMembers();
  }, [familyId, user]);

  return {
    members,
    relationships,
    loading,
    error,
    addMember,
    updateMember,
    deleteMember,
    addRelationship,
    refetch: fetchMembers
  };
};
