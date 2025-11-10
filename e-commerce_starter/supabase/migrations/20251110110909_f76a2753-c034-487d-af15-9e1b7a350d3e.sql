-- Fix function search path security issue - drop trigger first
DROP TRIGGER IF EXISTS update_cart_items_timestamp ON public.cart_items;
DROP FUNCTION IF EXISTS public.update_cart_items_updated_at();

CREATE OR REPLACE FUNCTION public.update_cart_items_updated_at()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Recreate the trigger
CREATE TRIGGER update_cart_items_timestamp
BEFORE UPDATE ON public.cart_items
FOR EACH ROW
EXECUTE FUNCTION public.update_cart_items_updated_at();