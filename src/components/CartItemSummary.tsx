import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input"; // For quantity, or just display
import { Trash2, Plus, Minus } from 'lucide-react';
import { AspectRatio } from '@/components/ui/aspect-ratio';

interface CartItemSummaryProps {
  id: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl?: string;
  onQuantityChange: (id: string, newQuantity: number) => void;
  onRemove: (id: string) => void;
}

const CartItemSummary: React.FC<CartItemSummaryProps> = ({
  id,
  name,
  price,
  quantity,
  imageUrl,
  onQuantityChange,
  onRemove,
}) => {
  console.log("Rendering CartItemSummary:", name, "Quantity:", quantity);

  const handleIncreaseQuantity = () => {
    onQuantityChange(id, quantity + 1);
  };

  const handleDecreaseQuantity = () => {
    if (quantity > 1) {
      onQuantityChange(id, quantity - 1);
    } else {
      // Optionally, could call onRemove(id) if quantity becomes 0, or disable button
      // For now, just prevent going below 1 via button
    }
  };

  const handleQuantityInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuantity = parseInt(e.target.value, 10);
    if (!isNaN(newQuantity) && newQuantity >= 1) {
      onQuantityChange(id, newQuantity);
    } else if (e.target.value === '' || newQuantity === 0) {
        // Allow clearing or setting to 0 to potentially remove or handle by parent
        onQuantityChange(id, 0); // Parent can decide to remove if 0
    }
  };


  return (
    <div className="flex items-center space-x-4 p-4 border-b border-gray-200">
      {imageUrl && (
        <div className="w-16 h-16 sm:w-20 sm:h-20 flex-shrink-0">
          <AspectRatio ratio={1} className="rounded overflow-hidden">
            <img
              src={imageUrl || '/placeholder.svg'}
              alt={name}
              className="object-cover w-full h-full"
              onError={(e) => (e.currentTarget.src = '/placeholder.svg')}
            />
          </AspectRatio>
        </div>
      )}
      <div className="flex-grow space-y-1">
        <h3 className="text-sm sm:text-base font-medium">{name}</h3>
        <p className="text-xs sm:text-sm text-gray-500">Price: ${price.toFixed(2)}</p>
      </div>
      <div className="flex items-center space-x-2">
        <Button variant="outline" size="icon" onClick={handleDecreaseQuantity} disabled={quantity <= 1} aria-label="Decrease quantity">
          <Minus className="h-4 w-4" />
        </Button>
        <Input
            type="number"
            value={quantity.toString()} // Controlled component
            onChange={handleQuantityInputChange}
            className="w-12 h-9 text-center appearance-none" // appearance-none to hide spinners on number input
            min="1"
            aria-label="Item quantity"
        />
        <Button variant="outline" size="icon" onClick={handleIncreaseQuantity} aria-label="Increase quantity">
          <Plus className="h-4 w-4" />
        </Button>
      </div>
      <div className="text-sm sm:text-base font-semibold w-20 text-right">
        ${(price * quantity).toFixed(2)}
      </div>
      <Button variant="ghost" size="icon" onClick={() => onRemove(id)} aria-label="Remove item">
        <Trash2 className="h-5 w-5 text-red-500 hover:text-red-700" />
      </Button>
    </div>
  );
};

export default CartItemSummary;