import { Link } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useCart } from "@/contexts/CartContext";
import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import sneakersImg from "@/assets/sneakers.jpg";
import headphonesImg from "@/assets/headphones.jpg";
import tshirtImg from "@/assets/tshirt.jpg";
import bottleImg from "@/assets/bottle.jpg";
import yogamatImg from "@/assets/yogamat.jpg";
import backpackImg from "@/assets/backpack.jpg";

const imageMap: { [key: string]: string } = {
  "Classic Leather Sneakers": sneakersImg,
  "Wireless Headphones": headphonesImg,
  "Cotton T-Shirt": tshirtImg,
  "Stainless Steel Water Bottle": bottleImg,
  "Yoga Mat": yogamatImg,
  "Laptop Backpack": backpackImg,
};

export default function Cart() {
  const { cartItems, removeFromCart, updateQuantity, cartTotal, isLoading } = useCart();

  if (isLoading) {
    return (
      <>
        <Navbar />
        <div className="container py-8">
          <Skeleton className="h-10 w-48 mb-8" />
          <div className="space-y-4">
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-32 w-full" />
          </div>
        </div>
      </>
    );
  }

  if (cartItems.length === 0) {
    return (
      <>
        <Navbar />
        <main className="container py-16">
          <div className="text-center max-w-md mx-auto">
            <ShoppingBag className="h-24 w-24 text-muted-foreground mx-auto mb-4" />
            <h1 className="text-3xl font-bold mb-4">Your cart is empty</h1>
            <p className="text-muted-foreground mb-8">
              Looks like you haven't added anything to your cart yet.
            </p>
            <Link to="/">
              <Button size="lg">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Start Shopping
              </Button>
            </Link>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="container py-8">
        <h1 className="text-4xl font-bold mb-8">Shopping Cart</h1>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => {
              const productImage = imageMap[item.product.name] || item.product.image_url;
              
              return (
                <Card key={item.id} className="p-4">
                  <div className="flex gap-4">
                    <div className="w-24 h-24 flex-shrink-0 overflow-hidden rounded-md bg-muted">
                      <img
                        src={productImage}
                        alt={item.product.name}
                        className="h-full w-full object-cover"
                      />
                    </div>

                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <h3 className="font-semibold text-lg">{item.product.name}</h3>
                        <p className="text-primary font-semibold">
                          ${item.product.price.toFixed(2)}
                        </p>
                      </div>

                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center gap-2">
                          <Button
                            size="icon"
                            variant="outline"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <span className="w-12 text-center font-semibold">{item.quantity}</span>
                          <Button
                            size="icon"
                            variant="outline"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>

                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => removeFromCart(item.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>

          <div className="lg:col-span-1">
            <Card className="p-6 sticky top-24">
              <h2 className="text-2xl font-bold mb-4">Order Summary</h2>
              
              <div className="space-y-2 mb-6">
                <div className="flex justify-between text-muted-foreground">
                  <span>Subtotal</span>
                  <span>${cartTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Shipping</span>
                  <span>Free</span>
                </div>
                <div className="border-t pt-2 mt-2">
                  <div className="flex justify-between text-xl font-bold">
                    <span>Total</span>
                    <span className="text-primary">${cartTotal.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <Button size="lg" className="w-full mb-3">
                Proceed to Checkout
              </Button>
              
              <Link to="/">
                <Button variant="outline" size="lg" className="w-full">
                  Continue Shopping
                </Button>
              </Link>
            </Card>
          </div>
        </div>
      </main>
    </>
  );
}
