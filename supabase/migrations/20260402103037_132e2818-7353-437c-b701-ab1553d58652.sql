
CREATE TABLE public.waitlist (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.waitlist ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can join the waitlist"
ON public.waitlist
FOR INSERT
TO public
WITH CHECK (true);

CREATE POLICY "Waitlist entries are not publicly readable"
ON public.waitlist
FOR SELECT
TO authenticated
USING (false);
