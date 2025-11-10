-- Create products table
CREATE TABLE public.products (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  description text NOT NULL,
  price decimal(10,2) NOT NULL,
  image_url text NOT NULL,
  category text,
  stock integer NOT NULL DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Allow everyone to read products (public catalog)
CREATE POLICY "Products are viewable by everyone"
ON public.products
FOR SELECT
USING (true);

-- Only admins can insert/update/delete products (we'll add admin functionality later)
CREATE POLICY "Only authenticated users can manage products"
ON public.products
FOR ALL
USING (auth.uid() IS NOT NULL);

-- Create cart_items table
CREATE TABLE public.cart_items (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  product_id uuid NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  quantity integer NOT NULL DEFAULT 1,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(user_id, product_id)
);

-- Enable RLS on cart_items
ALTER TABLE public.cart_items ENABLE ROW LEVEL SECURITY;

-- Users can only see their own cart items
CREATE POLICY "Users can view their own cart items"
ON public.cart_items
FOR SELECT
USING (auth.uid() = user_id);

-- Users can add items to their cart
CREATE POLICY "Users can add items to their cart"
ON public.cart_items
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Users can update their cart items
CREATE POLICY "Users can update their cart items"
ON public.cart_items
FOR UPDATE
USING (auth.uid() = user_id);

-- Users can delete their cart items
CREATE POLICY "Users can delete their cart items"
ON public.cart_items
FOR DELETE
USING (auth.uid() = user_id);

-- Function to update cart_items timestamp
CREATE OR REPLACE FUNCTION public.update_cart_items_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for automatic timestamp updates
CREATE TRIGGER update_cart_items_timestamp
BEFORE UPDATE ON public.cart_items
FOR EACH ROW
EXECUTE FUNCTION public.update_cart_items_updated_at();

-- Insert sample products
INSERT INTO public.products (name, description, price, image_url, category, stock) VALUES
('Classic Leather Sneakers', 'Premium leather sneakers with cushioned sole for all-day comfort', 89.99, '/placeholder.svg', 'Footwear', 50),
('Wireless Headphones', 'High-quality wireless headphones with noise cancellation', 149.99, '/placeholder.svg', 'Electronics', 30),
('Cotton T-Shirt', 'Soft organic cotton t-shirt in multiple colors', 29.99, '/placeholder.svg', 'Clothing', 100),
('Stainless Steel Water Bottle', 'Insulated water bottle keeps drinks cold for 24 hours', 34.99, '/placeholder.svg', 'Accessories', 75),
('Yoga Mat', 'Non-slip yoga mat with carrying strap', 44.99, '/placeholder.svg', 'Fitness', 40),
('Laptop Backpack', 'Durable backpack with laptop compartment and USB port', 59.99, '/placeholder.svg', 'Bags', 60);