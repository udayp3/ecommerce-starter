import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface CartItem {
  id: string;
  product_id: string;
  quantity: number;
  product: {
    id: string;
    name: string;
    price: number;
    image_url: string;
  };
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (productId: string) => Promise<void>;
  removeFromCart: (itemId: string) => Promise<void>;
  updateQuantity: (itemId: string, quantity: number) => Promise<void>;
  cartTotal: number;
  cartCount: number;
  isLoading: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchCartItems = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setCartItems([]);
      setIsLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from("cart_items")
      .select(`
        id,
        product_id,
        quantity,
        product:products (
          id,
          name,
          price,
          image_url
        )
      `)
      .eq("user_id", user.id);

    if (error) {
      console.error("Error fetching cart:", error);
      toast({
        title: "Error",
        description: "Failed to load cart items",
        variant: "destructive",
      });
    } else {
      setCartItems(data as CartItem[]);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchCartItems();
  }, []);

  const addToCart = async (productId: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast({
        title: "Please Sign In",
        description: "Create an account or sign in to add items to your cart",
        variant: "destructive",
      });
      window.location.href = "/auth";
      return;
    }

    // Check if item already in cart
    const existingItem = cartItems.find(item => item.product_id === productId);
    
    if (existingItem) {
      await updateQuantity(existingItem.id, existingItem.quantity + 1);
      return;
    }

    const { error } = await supabase
      .from("cart_items")
      .insert({
        user_id: user.id,
        product_id: productId,
        quantity: 1,
      });

    if (error) {
      console.error("Error adding to cart:", error);
      toast({
        title: "Error",
        description: "Failed to add item to cart",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "Item added to cart",
      });
      fetchCartItems();
    }
  };

  const removeFromCart = async (itemId: string) => {
    const { error } = await supabase
      .from("cart_items")
      .delete()
      .eq("id", itemId);

    if (error) {
      console.error("Error removing from cart:", error);
      toast({
        title: "Error",
        description: "Failed to remove item",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Removed",
        description: "Item removed from cart",
      });
      fetchCartItems();
    }
  };

  const updateQuantity = async (itemId: string, quantity: number) => {
    if (quantity < 1) {
      await removeFromCart(itemId);
      return;
    }

    const { error } = await supabase
      .from("cart_items")
      .update({ quantity })
      .eq("id", itemId);

    if (error) {
      console.error("Error updating quantity:", error);
      toast({
        title: "Error",
        description: "Failed to update quantity",
        variant: "destructive",
      });
    } else {
      fetchCartItems();
    }
  };

  const cartTotal = cartItems.reduce(
    (total, item) => total + (item.product.price * item.quantity),
    0
  );

  const cartCount = cartItems.reduce((count, item) => count + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        cartTotal,
        cartCount,
        isLoading,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
