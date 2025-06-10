import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CartItemSummary from '@/components/CartItemSummary';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Tag, Trash2 } from 'lucide-react';
import { toast } from "@/components/ui/use-toast";

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl?: string;
}

const initialCartItems: CartItem[] = [
  { id: 'm1', name: 'Bruschetta Classica', price: 8.50, quantity: 2, imageUrl: 'https://source.unsplash.com/random/150x150/?bruschetta' },
  { id: 'm3', name: 'Margherita Pizza', price: 14.00, quantity: 1, imageUrl: 'https://source.unsplash.com/random/150x150/?margherita-pizza' },
  { id: 'm7', name: 'Tiramisu', price: 9.00, quantity: 1, imageUrl: 'https://source.unsplash.com/random/150x150/?tiramisu' },
];

const CartScreen = () => {
  console.log('CartScreen loaded');
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState<CartItem[]>(initialCartItems);
  const [promoCode, setPromoCode] = useState('');
  const [discount, setDiscount] = useState(0);

  const handleQuantityChange = (id: string, newQuantity: number) => {
    if (newQuantity <= 0) { // Remove item if quantity is 0 or less
        handleRemoveItem(id, true); // silent remove
    } else {
        setCartItems(prevItems =>
        prevItems.map(item => (item.id === id ? { ...item, quantity: newQuantity } : item))
        );
    }
  };

  const handleRemoveItem = (id: string, silent: boolean = false) => {
    const itemToRemove = cartItems.find(item => item.id === id);
    setCartItems(prevItems => prevItems.filter(item => item.id !== id));
    if (!silent && itemToRemove) {
         toast({
            title: "Item Removed",
            description: `${itemToRemove.name} has been removed from your cart.`,
            variant: "destructive",
            duration: 3000,
        });
    }
  };
  
  const clearCart = () => {
    setCartItems([]);
    toast({
        title: "Cart Cleared",
        description: "All items have been removed from your cart.",
        variant: "destructive",
        duration: 3000,
    });
  }

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const deliveryFee = subtotal > 0 ? (subtotal > 50 ? 0 : 5.00) : 0; // Free delivery over $50
  const taxes = subtotal * 0.08; // 8% tax
  const total = subtotal + deliveryFee + taxes - discount;

  const handleApplyPromo = () => {
    if (promoCode.toUpperCase() === 'SAVE10') {
      setDiscount(subtotal * 0.1); // 10% discount
      toast({ title: "Promo Applied!", description: "10% discount applied successfully.", duration: 3000 });
    } else if (promoCode.toUpperCase() === 'FREEDEL') {
        // This promo sets discount such that it cancels delivery fee
        setDiscount(deliveryFee > 0 ? deliveryFee : 0);
        toast({ title: "Promo Applied!", description: "Free delivery applied.", duration: 3000 });
    }
    else {
      setDiscount(0);
      toast({ title: "Invalid Promo Code", variant: "destructive", duration: 3000 });
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="container mx-auto p-4 flex items-center justify-between">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-semibold text-gray-800">Your Cart</h1>
          <div> {/* Placeholder for potential right-side action like help */}
            {cartItems.length > 0 && (
                <Button variant="outline" size="sm" onClick={clearCart} className="text-red-500 border-red-500 hover:bg-red-50">
                    <Trash2 className="h-4 w-4 mr-1" /> Clear Cart
                </Button>
            )}
          </div>
        </div>
      </header>

      {cartItems.length === 0 ? (
        <main className="container mx-auto p-4 flex flex-col items-center justify-center text-center h-[calc(100vh-150px)]">
            <img src="https://source.unsplash.com/random/200x200/?empty-cart,sad" alt="Empty Cart" className="w-48 h-48 mb-6 opacity-70" />
            <h2 className="text-2xl font-semibold text-gray-700 mb-2">Your Cart is Empty</h2>
            <p className="text-gray-500 mb-6">Looks like you haven't added anything to your cart yet.</p>
            <Button onClick={() => navigate('/')} className="bg-orange-500 hover:bg-orange-600">Start Shopping</Button>
        </main>
      ) : (
        <main className="container mx-auto p-4 grid grid-cols-1 lg:grid-cols-3 gap-6">
          <ScrollArea className="lg:col-span-2 bg-white rounded-lg shadow">
            <div className="p-1">
                {cartItems.map(item => (
                <CartItemSummary
                    key={item.id}
                    {...item}
                    onQuantityChange={handleQuantityChange}
                    onRemove={() => handleRemoveItem(item.id)}
                />
                ))}
            </div>
          </ScrollArea>

          <div className="lg:col-span-1">
            <Card className="shadow">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <Label>Subtotal</Label>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <Label>Delivery Fee</Label>
                  <span>{deliveryFee > 0 ? `$${deliveryFee.toFixed(2)}` : 'Free'}</span>
                </div>
                <div className="flex justify-between">
                  <Label>Taxes (8%)</Label>
                  <span>${taxes.toFixed(2)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <Label>Discount</Label>
                    <span>-${discount.toFixed(2)}</span>
                  </div>
                )}
                <Separator />
                <div className="flex items-center space-x-2">
                  <Tag className="h-5 w-5 text-gray-500" />
                  <Input
                    type="text"
                    placeholder="Promo Code"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    className="flex-grow"
                  />
                  <Button variant="outline" onClick={handleApplyPromo} size="sm">Apply</Button>
                </div>
                <Separator />
                <div className="flex justify-between text-lg font-semibold">
                  <Label>Total</Label>
                  <span>${total.toFixed(2)}</span>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full bg-orange-500 hover:bg-orange-600" onClick={() => navigate('/checkout')}>
                  Proceed to Checkout
                </Button>
              </CardFooter>
            </Card>
          </div>
        </main>
      )}
    </div>
  );
};

export default CartScreen;