import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { PlusCircle } from 'lucide-react';

interface MenuItemCardProps {
  id: string;
  name: string;
  description?: string;
  price: number;
  imageUrl?: string;
  onAddToCart: (id: string) => void; // Toast notification handled by parent/hook
}

const MenuItemCard: React.FC<MenuItemCardProps> = ({
  id,
  name,
  description,
  price,
  imageUrl,
  onAddToCart,
}) => {
  console.log("Rendering MenuItemCard:", name);

  const handleAddToCartClick = () => {
    console.log("Add to cart clicked for MenuItem:", name, id);
    onAddToCart(id);
  };

  return (
    <Card className="w-full flex flex-col overflow-hidden transition-shadow duration-300 hover:shadow-md">
      {imageUrl && (
        <CardHeader className="p-0">
          <AspectRatio ratio={16 / 9}>
            <img
              src={imageUrl || '/placeholder.svg'}
              alt={name}
              className="object-cover w-full h-full"
              onError={(e) => (e.currentTarget.src = '/placeholder.svg')}
            />
          </AspectRatio>
        </CardHeader>
      )}
      <CardContent className={`p-4 space-y-1 flex-grow ${!imageUrl && 'pt-4'}`}>
        <CardTitle className="text-md font-semibold">{name}</CardTitle>
        {description && (
          <p className="text-xs text-gray-600 line-clamp-2 h-8">
            {description}
          </p>
        )}
      </CardContent>
      <CardFooter className="p-4 pt-2 flex justify-between items-center">
        <span className="text-lg font-bold text-orange-600">${price.toFixed(2)}</span>
        <Button size="sm" onClick={handleAddToCartClick} aria-label={`Add ${name} to cart`}>
          <PlusCircle className="mr-2 h-4 w-4" /> Add
        </Button>
      </CardFooter>
    </Card>
  );
};

export default MenuItemCard;