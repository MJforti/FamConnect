
-- Create family_members table to store individual family members
CREATE TABLE public.family_members (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  family_id UUID REFERENCES public.families(id) ON DELETE CASCADE NOT NULL,
  user_id UUID NOT NULL,
  full_name TEXT NOT NULL,
  date_of_birth DATE,
  gender TEXT CHECK (gender IN ('male', 'female', 'other')),
  photo_url TEXT,
  email TEXT,
  phone TEXT,
  address TEXT,
  occupation TEXT,
  notes TEXT,
  is_alive BOOLEAN DEFAULT true,
  date_of_death DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create family_relationships table to define connections between members
CREATE TABLE public.family_relationships (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  family_id UUID REFERENCES public.families(id) ON DELETE CASCADE NOT NULL,
  member_id UUID REFERENCES public.family_members(id) ON DELETE CASCADE NOT NULL,
  related_member_id UUID REFERENCES public.family_members(id) ON DELETE CASCADE NOT NULL,
  relationship_type TEXT NOT NULL CHECK (relationship_type IN (
    'parent', 'child', 'spouse', 'sibling', 'grandparent', 'grandchild',
    'uncle', 'aunt', 'nephew', 'niece', 'cousin', 'in_law'
  )),
  marriage_date DATE,
  divorce_date DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(member_id, related_member_id, relationship_type)
);

-- Add RLS policies for family_members
ALTER TABLE public.family_members ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view family members in their families" 
  ON public.family_members 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.families 
      WHERE families.id = family_members.family_id 
      AND families.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create family members in their families" 
  ON public.family_members 
  FOR INSERT 
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.families 
      WHERE families.id = family_members.family_id 
      AND families.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update family members in their families" 
  ON public.family_members 
  FOR UPDATE 
  USING (
    EXISTS (
      SELECT 1 FROM public.families 
      WHERE families.id = family_members.family_id 
      AND families.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete family members in their families" 
  ON public.family_members 
  FOR DELETE 
  USING (
    EXISTS (
      SELECT 1 FROM public.families 
      WHERE families.id = family_members.family_id 
      AND families.user_id = auth.uid()
    )
  );

-- Add RLS policies for family_relationships
ALTER TABLE public.family_relationships ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view relationships in their families" 
  ON public.family_relationships 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.families 
      WHERE families.id = family_relationships.family_id 
      AND families.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create relationships in their families" 
  ON public.family_relationships 
  FOR INSERT 
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.families 
      WHERE families.id = family_relationships.family_id 
      AND families.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update relationships in their families" 
  ON public.family_relationships 
  FOR UPDATE 
  USING (
    EXISTS (
      SELECT 1 FROM public.families 
      WHERE families.id = family_relationships.family_id 
      AND families.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete relationships in their families" 
  ON public.family_relationships 
  FOR DELETE 
  USING (
    EXISTS (
      SELECT 1 FROM public.families 
      WHERE families.id = family_relationships.family_id 
      AND families.user_id = auth.uid()
    )
  );

-- Create function to automatically create reciprocal relationships
CREATE OR REPLACE FUNCTION create_reciprocal_relationship()
RETURNS TRIGGER AS $$
DECLARE
  reciprocal_type TEXT;
BEGIN
  -- Determine the reciprocal relationship type
  CASE NEW.relationship_type
    WHEN 'parent' THEN reciprocal_type := 'child';
    WHEN 'child' THEN reciprocal_type := 'parent';
    WHEN 'spouse' THEN reciprocal_type := 'spouse';
    WHEN 'sibling' THEN reciprocal_type := 'sibling';
    WHEN 'grandparent' THEN reciprocal_type := 'grandchild';
    WHEN 'grandchild' THEN reciprocal_type := 'grandparent';
    WHEN 'uncle' THEN reciprocal_type := 'nephew';
    WHEN 'aunt' THEN reciprocal_type := 'niece';
    WHEN 'nephew' THEN reciprocal_type := 'uncle';
    WHEN 'niece' THEN reciprocal_type := 'aunt';
    WHEN 'cousin' THEN reciprocal_type := 'cousin';
    ELSE reciprocal_type := 'in_law';
  END CASE;

  -- Insert the reciprocal relationship if it doesn't exist
  INSERT INTO public.family_relationships (
    family_id, member_id, related_member_id, relationship_type, marriage_date, divorce_date
  )
  SELECT NEW.family_id, NEW.related_member_id, NEW.member_id, reciprocal_type, NEW.marriage_date, NEW.divorce_date
  WHERE NOT EXISTS (
    SELECT 1 FROM public.family_relationships 
    WHERE member_id = NEW.related_member_id 
    AND related_member_id = NEW.member_id 
    AND relationship_type = reciprocal_type
  );

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic reciprocal relationships
CREATE TRIGGER trigger_create_reciprocal_relationship
  AFTER INSERT ON public.family_relationships
  FOR EACH ROW
  EXECUTE FUNCTION create_reciprocal_relationship();
