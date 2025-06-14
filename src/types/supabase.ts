
export interface SupabaseFamilyMember {
  id: string;
  family_id: string;
  user_id: string;
  full_name: string;
  date_of_birth: string | null;
  gender: 'male' | 'female' | 'other' | null;
  photo_url: string | null;
  email: string | null;
  phone: string | null;
  address: string | null;
  occupation: string | null;
  notes: string | null;
  is_alive: boolean;
  date_of_death: string | null;
  created_at: string;
  updated_at: string;
}

export interface SupabaseFamilyRelationship {
  id: string;
  family_id: string;
  member_id: string;
  related_member_id: string;
  relationship_type: 'parent' | 'child' | 'spouse' | 'sibling' | 'grandparent' | 'grandchild' | 'uncle' | 'aunt' | 'nephew' | 'niece' | 'cousin' | 'in_law';
  marriage_date: string | null;
  divorce_date: string | null;
  created_at: string;
}

export interface SupabaseFamily {
  id: string;
  user_id: string;
  name: string;
  description: string | null;
  created_at: string;
  updated_at: string;
}
