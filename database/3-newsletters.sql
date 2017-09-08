ALTER TABLE public.tags RENAME TO newsletters;
ALTER TABLE public.feeds RENAME COLUMN tag_id TO newsletter_id;

ALTER TABLE public.newsletters ADD mc_list_id VARCHAR NULL;
ALTER TABLE public.newsletters ADD mc_interest_category_id VARCHAR NULL;
ALTER TABLE public.newsletters ADD mc_interest_id VARCHAR NULL;
