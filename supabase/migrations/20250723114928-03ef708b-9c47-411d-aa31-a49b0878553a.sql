-- Add INSERT policy for BlogData table to allow anonymous users to insert data
CREATE POLICY "Allow INSERT on BlogData" 
ON public."BlogData" 
FOR INSERT 
WITH CHECK (true);