import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/Navbar";
import { ProductCard } from "@/components/ProductCard";
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

export default function Index() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching products:", error);
      } else {
        setProducts(data);
      }
      setIsLoading(false);
    };

    fetchProducts();
  }, []);

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-muted/50 to-background py-20">
          <div className="container">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-5xl md:text-6xl font-bold mb-6">
                Discover Amazing Products
              </h1>
              <p className="text-xl text-muted-foreground mb-8">
                Shop the latest collection of premium products at unbeatable prices
              </p>
            </div>
          </div>
        </section>

        {/* Products Grid */}
        <section className="container py-12">
          <h2 className="text-3xl font-bold mb-8">Featured Products</h2>
          
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="space-y-4">
                  <Skeleton className="aspect-square w-full" />
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  id={product.id}
                  name={product.name}
                  description={product.description}
                  price={product.price}
                  image={imageMap[product.name] || product.image_url}
                  category={product.category}
                />
              ))}
            </div>
          )}
        </section>
      </main>
    </>
  );
}
