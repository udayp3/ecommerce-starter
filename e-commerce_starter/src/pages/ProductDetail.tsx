import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/Navbar";
import { ShoppingCart, ArrowLeft, Package } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { Skeleton } from "@/components/ui/skeleton";
import sneakersImg from "@/assets/sneakers.jpg";
import headphonesImg from "@/assets/headphones.jpg";
import tshirtImg from "@/assets/tshirt.jpg";
import bottleImg from "@/assets/bottle.jpg";
import yogamatImg from "@/assets/yogamat.jpg";
import backpackImg from "@/assets/backpack.jpg";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url: string;
  category: string;
  stock: number;
}

const imageMap: { [key: string]: string } = {
  "Classic Leather Sneakers": sneakersImg,
  "Wireless Headphones": headphonesImg,
  "Cotton T-Shirt": tshirtImg,
  "Stainless Steel Water Bottle": bottleImg,
  "Yoga Mat": yogamatImg,
  "Laptop Backpack": backpackImg,
};

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProduct = async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        console.error("Error fetching product:", error);
      } else {
        setProduct(data);
      }
      setIsLoading(false);
    };

    fetchProduct();
  }, [id]);

  if (isLoading) {
    return (
      <>
        <Navbar />
        <div className="container py-8">
          <Skeleton className="h-8 w-24 mb-8" />
          <div className="grid md:grid-cols-2 gap-8">
            <Skeleton className="aspect-square w-full" />
            <div className="space-y-4">
              <Skeleton className="h-10 w-3/4" />
              <Skeleton className="h-6 w-1/4" />
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          </div>
        </div>
      </>
    );
  }

  if (!product) {
    return (
      <>
        <Navbar />
        <div className="container py-8 text-center">
          <h1 className="text-2xl font-bold mb-4">Product not found</h1>
          <Link to="/">
            <Button>Back to Shop</Button>
          </Link>
        </div>
      </>
    );
  }

  const productImage = imageMap[product.name] || product.image_url;

  return (
    <>
      <Navbar />
      <main className="container py-8">
        <Link to="/" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-8 transition-colors">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Shop
        </Link>

        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
          <div className="aspect-square overflow-hidden rounded-lg bg-muted">
            <img
              src={productImage}
              alt={product.name}
              className="h-full w-full object-cover"
            />
          </div>

          <div className="flex flex-col">
            <div className="mb-4">
              <p className="text-sm text-muted-foreground uppercase mb-2">{product.category}</p>
              <h1 className="text-4xl font-bold mb-4">{product.name}</h1>
              <p className="text-3xl font-bold text-primary mb-6">${product.price.toFixed(2)}</p>
            </div>

            <p className="text-muted-foreground mb-6 leading-relaxed">{product.description}</p>

            <div className="flex items-center gap-2 mb-8 text-sm text-muted-foreground">
              <Package className="h-4 w-4" />
              <span>{product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}</span>
            </div>

            <Button 
              size="lg" 
              className="w-full md:w-auto"
              onClick={() => addToCart(product.id)}
              disabled={product.stock === 0}
            >
              <ShoppingCart className="mr-2 h-5 w-5" />
              {product.stock > 0 ? "Add to Cart" : "Out of Stock"}
            </Button>
          </div>
        </div>
      </main>
    </>
  );
}
