import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Label } from '@/components/ui/label';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import MenuItemCard from '@/components/MenuItemCard';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, Clock, Utensils, ShoppingCart, ArrowLeft } from 'lucide-react';
import { toast } from "@/components/ui/use-toast";


const placeholderRestaurantDetails = {
  id: '1',
  name: 'The Italian Corner',
  logoUrl: 'https://source.unsplash.com/random/100x100/?restaurant-logo,italian',
  rating: 4.7,
  deliveryTime: '25-35 min',
  cuisine: 'Italian',
  menu: {
    Appetizers: [
      { id: 'm1', name: 'Bruschetta Classica', description: 'Toasted bread with fresh tomatoes, garlic, basil, and olive oil.', price: 8.50, imageUrl: 'https://source.unsplash.com/random/300x200/?bruschetta' },
      { id: 'm2', name: 'Caprese Salad', description: 'Fresh mozzarella, tomatoes, basil, and balsamic glaze.', price: 10.00, imageUrl: 'https://source.unsplash.com/random/300x200/?caprese-salad' },
    ],
    Pizzas: [
      { id: 'm3', name: 'Margherita Pizza', description: 'Classic tomato sauce, mozzarella, and basil.', price: 14.00, imageUrl: 'https://source.unsplash.com/random/300x200/?margherita-pizza' },
      { id: 'm4', name: 'Pepperoni Pizza', description: 'Tomato sauce, mozzarella, and spicy pepperoni.', price: 16.50, imageUrl: 'https://source.unsplash.com/random/300x200/?pepperoni-pizza' },
    ],
    Pastas: [
        { id: 'm5', name: 'Spaghetti Carbonara', description: 'Creamy pasta with pancetta, egg, and Parmesan.', price: 15.50, imageUrl: 'https://source.unsplash.com/random/300x200/?carbonara' },
        { id: 'm6', name: 'Lasagna Bolognese', description: 'Layers of pasta, meat sauce, béchamel, and cheese.', price: 17.00, imageUrl: 'https://source.unsplash.com/random/300x200/?lasagna' },
    ],
    Desserts: [
        { id: 'm7', name: 'Tiramisu', description: 'Classic Italian coffee-flavored dessert.', price: 9.00, imageUrl: 'https://source.unsplash.com/random/300x200/?tiramisu' },
    ],
  }
};
// In a real app, cartItems would come from a global state / context
let cartItemCountGlobal = 0; 

const RestaurantMenuScreen = () => {
  console.log('RestaurantMenuScreen loaded');
  const { id: restaurantId } = useParams(); // Get restaurant ID from URL
  const navigate = useNavigate();
  const [cartItemCount, setCartItemCount] = useState(cartItemCountGlobal); // Local state for demo

  // Fetch restaurant details based on restaurantId, using placeholder for now
  const restaurant = placeholderRestaurantDetails; // In real app: fetchRestaurantById(restaurantId)

  if (!restaurant) {
    return <div><Label>Restaurant not found.</Label></div>;
  }

  const handleAddToCart = (itemId: string) => {
    console.log(`Added item ${itemId} to cart from restaurant ${restaurantId}`);
    cartItemCountGlobal++;
    setCartItemCount(cartItemCountGlobal);
    toast({
      title: "Item Added to Cart!",
      description: `${restaurant.menu.Appetizers.find(i => i.id === itemId)?.name || restaurant.menu.Pizzas.find(i => i.id === itemId)?.name || restaurant.menu.Pastas.find(i => i.id === itemId)?.name || restaurant.menu.Desserts.find(i => i.id === itemId)?.name} added.`,
      duration: 3000,
    });
  };

  const menuCategories = Object.keys(restaurant.menu);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
        <header className="bg-white shadow-sm sticky top-0 z-30">
            <div className="container mx-auto p-4 flex items-center justify-between">
                <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
                    <ArrowLeft className="h-5 w-5" />
                </Button>
                <div className="flex items-center space-x-3">
                    <Avatar className="h-12 w-12">
                        <AvatarImage src={restaurant.logoUrl || 'https://source.unsplash.com/random/100x100/?restaurant-logo'} alt={restaurant.name} />
                        <AvatarFallback>{restaurant.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div>
                        <h1 className="text-xl font-bold text-gray-800">{restaurant.name}</h1>
                        <div className="flex items-center text-xs text-gray-500 space-x-2">
                            <span className="flex items-center"><Star className="h-3 w-3 text-yellow-500 mr-1" /> {restaurant.rating}</span>
                            <span className="flex items-center"><Clock className="h-3 w-3 mr-1" /> {restaurant.deliveryTime}</span>
                            <span className="flex items-center"><Utensils className="h-3 w-3 mr-1" /> {restaurant.cuisine}</span>
                        </div>
                    </div>
                </div>
                <Button variant="outline" onClick={() => navigate('/cart')} className="relative">
                    <ShoppingCart className="h-5 w-5 mr-2" />
                    Cart
                    {cartItemCount > 0 && (
                    <Badge variant="destructive" className="absolute -top-2 -right-2 px-1.5 py-0.5 text-xs">
                        {cartItemCount}
                    </Badge>
                    )}
                </Button>
            </div>
        </header>

      <ScrollArea className="flex-grow">
        <main className="container mx-auto p-4">
          <Tabs defaultValue={menuCategories[0] || 'Appetizers'} className="w-full">
            <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 mb-4">
              {menuCategories.map(category => (
                <TabsTrigger key={category} value={category}>{category}</TabsTrigger>
              ))}
            </TabsList>
            
            {menuCategories.map(category => (
              <TabsContent key={category} value={category}>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {(restaurant.menu as any)[category].map((item: any) => (
                    <MenuItemCard
                      key={item.id}
                      id={item.id}
                      name={item.name}
                      description={item.description}
                      price={item.price}
                      imageUrl={item.imageUrl}
                      onAddToCart={() => handleAddToCart(item.id)}
                    />
                  ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </main>
      </ScrollArea>
    </div>
  );
};

export default RestaurantMenuScreen;