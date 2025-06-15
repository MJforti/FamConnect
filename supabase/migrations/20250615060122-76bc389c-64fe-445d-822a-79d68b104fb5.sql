
-- First, let's enable RLS on the families table (if not already enabled)
ALTER TABLE public.families ENABLE ROW LEVEL SECURITY;

-- Create only the policies that don't exist yet
-- We'll use IF NOT EXISTS or handle the error gracefully

-- Allow users to create their own families
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE schemaname = 'public' 
        AND tablename = 'families' 
        AND policyname = 'Users can create their own families'
    ) THEN
        CREATE POLICY "Users can create their own families" 
          ON public.families 
          FOR INSERT 
          WITH CHECK (auth.uid() = user_id);
    END IF;
END $$;

-- Allow users to update their own families
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE schemaname = 'public' 
        AND tablename = 'families' 
        AND policyname = 'Users can update their own families'
    ) THEN
        CREATE POLICY "Users can update their own families" 
          ON public.families 
          FOR UPDATE 
          USING (auth.uid() = user_id);
    END IF;
END $$;

-- Allow users to delete their own families
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE schemaname = 'public' 
        AND tablename = 'families' 
        AND policyname = 'Users can delete their own families'
    ) THEN
        CREATE POLICY "Users can delete their own families" 
          ON public.families 
          FOR DELETE 
          USING (auth.uid() = user_id);
    END IF;
END $$;
