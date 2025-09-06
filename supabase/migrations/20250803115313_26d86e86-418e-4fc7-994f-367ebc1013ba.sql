-- Create blog tables for different contexts
CREATE TABLE public.blog_biblepeacefinder (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE public.blog_forgetcheck (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE public.blog_digitalproduct (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all blog tables
ALTER TABLE public.blog_biblepeacefinder ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_forgetcheck ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_digitalproduct ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Allow public read access to blog_biblepeacefinder" 
ON public.blog_biblepeacefinder 
FOR SELECT 
USING (true);

CREATE POLICY "Allow public read access to blog_forgetcheck" 
ON public.blog_forgetcheck 
FOR SELECT 
USING (true);

CREATE POLICY "Allow public read access to blog_digitalproduct" 
ON public.blog_digitalproduct 
FOR SELECT 
USING (true);

-- Create policies for insert access (you can modify these based on your auth requirements)
CREATE POLICY "Allow insert to blog_biblepeacefinder" 
ON public.blog_biblepeacefinder 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Allow insert to blog_forgetcheck" 
ON public.blog_forgetcheck 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Allow insert to blog_digitalproduct" 
ON public.blog_digitalproduct 
FOR INSERT 
WITH CHECK (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_blog_biblepeacefinder_updated_at
  BEFORE UPDATE ON public.blog_biblepeacefinder
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_blog_forgetcheck_updated_at
  BEFORE UPDATE ON public.blog_forgetcheck
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_blog_digitalproduct_updated_at
  BEFORE UPDATE ON public.blog_digitalproduct
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();