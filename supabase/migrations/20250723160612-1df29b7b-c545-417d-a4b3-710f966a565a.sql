-- Add website_context column to BlogData table
ALTER TABLE public."BlogData" 
ADD COLUMN website_context text;