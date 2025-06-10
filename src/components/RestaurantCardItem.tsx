import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, Clock, Truck } from 'lucide-react'; // Icons for rating, delivery time, etc.
import { AspectRatio } from '@/components/ui/aspect-ratio';

interface RestaurantCardItemProps {
  id: string;
  name: string;
  imageUrl: string;
  rating?: number; // e.g., 4.5
  deliveryTime?: string; // e.g., "20-30 min"
  cuisineTypes?: string[]; // e.g., ["Pizza", "Italian"]
  priceRange?: '$' | '$$' | '$$$' | '$$$$'; // Optional price range indicator
  onClick: (id: string) => void;
}

const RestaurantCardItem: React.FC<RestaurantCardItemProps> = ({
  id,
  name,
  imageUrl,
  rating,
  deliveryTime,
  cuisineTypes,
  priceRange,
  onClick,
}) => {
  console.log("Rendering RestaurantCardItem:", name);

  return (
    <Card
      className="w-full max-w-sm overflow-hidden transition-all duration-300 hover:shadow-xl cursor-pointer flex flex-col"
      onClick={() => onClick(id)}
      onKeyDown={(e) => e.key === 'Enter' && onClick(id)}
      tabIndex={0}
      aria-label={`View details for ${name}`}
    >
      <CardHeader className="p-0">
        <AspectRatio ratio={16 / 9}>
          <img
            src={imageUrl || '/placeholder.svg'}
            alt={`Image of ${name}`}
            className="object-cover w-full h-full"
            onError={(e) => (e.currentTarget.src = '/placeholder.svg')}
          />
        </AspectRatio>
      </CardHeader>
      <CardContent className="p-4 space-y-2 flex-grow">
        <CardTitle className="text-lg font-semibold leading-tight truncate">{name}</CardTitle>
        
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          {rating && (
            <div className="flex items-center">
              <Star className="h-4 w-4 text-yellow-500 mr-1" />
              <span>{rating.toFixed(1)}</span>
            </div>
          )}
          {rating && deliveryTime && <span className="text-gray-300">|</span>}
          {deliveryTime && (
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-1" />
              <span>{deliveryTime}</span>
            </div>
          )}
        </div>

        {cuisineTypes && cuisineTypes.length > 0 && (
          <div className="text-xs text-gray-500 truncate">
            {cuisineTypes.join(' • ')} {priceRange && `• ${priceRange}`}
          </div>
        )}
      </CardContent>
      <CardFooter className="p-4 pt-0">
        {/* Could add a "View Menu" button or other call to action here if needed */}
        {/* For now, the whole card is clickable */}
         <Badge variant="outline" className="flex items-center text-green-600 border-green-600">
            <Truck className="h-3 w-3 mr-1" />
            Order Now
        </Badge>
      </CardFooter>
    </Card>
  );
};

export default RestaurantCardItem;