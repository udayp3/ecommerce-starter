import { Link } from "react-router-dom";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import { useCart } from "@/contexts/CartContext";

interface ProductCardProps {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category?: string;
}

export function ProductCard({ id, name, description, price, image, category }: ProductCardProps) {
  const { addToCart } = useCart();

  return (
    <Card className="group overflow-hidden transition-all hover:shadow-lg">
      <Link to={`/product/${id}`}>
        <div className="aspect-square overflow-hidden bg-muted">
          <img
            src={image}
            alt={name}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>
      </Link>
      
      <CardContent className="p-4">
        <Link to={`/product/${id}`}>
          {category && (
            <p className="text-xs text-muted-foreground uppercase mb-1">{category}</p>
          )}
          <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors">
            {name}
          </h3>
          <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
            {description}
          </p>
        </Link>
        <p className="text-2xl font-bold text-primary">${price.toFixed(2)}</p>
      </CardContent>

      <CardFooter className="p-4 pt-0">
        <Button 
          onClick={() => addToCart(id)}
          className="w-full"
          size="lg"
        >
          <ShoppingCart className="mr-2 h-4 w-4" />
          Add to Cart
        </Button>
      </CardFooter>
    </Card>
  );
}
