import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import FoodCategoryChip from '@/components/FoodCategoryChip';
import Carousel from '@/components/Carousel';
import RestaurantCardItem from '@/components/RestaurantCardItem';
import { Search, MapPin } from 'lucide-react';

const placeholderCategories = [
  { name: 'Pizza', imageUrl: 'https://source.unsplash.com/random/100x100/?pizza' },
  { name: 'Burgers', imageUrl: 'https://source.unsplash.com/random/100x100/?burger' },
  { name: 'Sushi', imageUrl: 'https://source.unsplash.com/random/100x100/?sushi' },
  { name: 'Italian', imageUrl: 'https://source.unsplash.com/random/100x100/?pasta' },
  { name: 'Mexican', imageUrl: 'https://source.unsplash.com/random/100x100/?taco' },
  { name: 'Indian', imageUrl: 'https://source.unsplash.com/random/100x100/?curry' },
  { name: 'Desserts', imageUrl: 'https://source.unsplash.com/random/100x100/?cake' },
  { name: 'Vegan', imageUrl: 'https://source.unsplash.com/random/100x100/?salad' },
];

const placeholderCarouselSlides = [
  <div key="slide1" className="text-center">
    <img src="https://source.unsplash.com/random/800x400/?food-banner,offer" alt="Special Offer 1" className="w-full h-48 object-cover rounded-md"/>
    <h3 className="text-xl font-semibold mt-2">Flat 20% Off On Your First Order!</h3>
    <p className="text-sm text-gray-600">Use code: FIRSTBITE</p>
  </div>,
  <div key="slide2" className="text-center">
    <img src="https://source.unsplash.com/random/800x400/?food-delivery,fast" alt="Special Offer 2" className="w-full h-48 object-cover rounded-md"/>
    <h3 className="text-xl font-semibold mt-2">Free Delivery Over $25</h3>
    <p className="text-sm text-gray-600">No code needed!</p>
  </div>,
];

const placeholderRestaurants = [
  { id: '1', name: 'The Gourmet Place', imageUrl: 'https://source.unsplash.com/random/400x300/?restaurant,exterior', rating: 4.5, deliveryTime: '25-35 min', cuisineTypes: ['Italian', 'Fine Dining'], priceRange: '$$$' as '$$$' },
  { id: '2', name: 'Quick Bites Central', imageUrl: 'https://source.unsplash.com/random/400x300/?fastfood,shop', rating: 4.2, deliveryTime: '15-25 min', cuisineTypes: ['Burgers', 'Fries'], priceRange: '$' as '$' },
  { id: '3', name: 'Spice Route Express', imageUrl: 'https://source.unsplash.com/random/400x300/?indian,food', rating: 4.7, deliveryTime: '30-40 min', cuisineTypes: ['Indian', 'Curry'], priceRange: '$$' as '$$' },
  { id: '4', name: 'Healthy Hub', imageUrl: 'https://source.unsplash.com/random/400x300/?salad,cafe', rating: 4.9, deliveryTime: '20-30 min', cuisineTypes: ['Salads', 'Smoothies', 'Vegan'], priceRange: '$$' as '$$' },
];


const HomeScreen = () => {
  console.log('HomeScreen loaded');
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const handleCategoryClick = (categoryName: string) => {
    setActiveCategory(categoryName);
    navigate(`/restaurants?category=${encodeURIComponent(categoryName)}`);
  };

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/restaurants?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleRestaurantClick = (id: string) => {
    navigate(`/restaurant/${id}/menu`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="p-4 bg-white shadow-sm">
        <div className="container mx-auto">
            <div className="flex justify-between items-center mb-4">
                <div>
                    <Label htmlFor="location" className="text-xs text-gray-500">Deliver to:</Label>
                    <div className="flex items-center font-semibold text-orange-600">
                        <MapPin className="h-4 w-4 mr-1" />
                        123 Foodie Lane, Flavor Town
                    </div>
                </div>
                {/* User Profile Icon placeholder */}
                 <img src="https://source.unsplash.com/random/40x40/?profile,avatar" alt="User Profile" className="w-10 h-10 rounded-full" />
            </div>
            <form onSubmit={handleSearch} className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                type="search"
                placeholder="Search restaurants or cuisines..."
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:border-orange-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                />
            </form>
        </div>
      </header>

      <main className="container mx-auto p-4">
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-3 text-gray-800">Categories</h2>
          <ScrollArea className="w-full whitespace-nowrap rounded-md">
            <div className="flex space-x-3 pb-3">
              {placeholderCategories.map((cat) => (
                <FoodCategoryChip
                  key={cat.name}
                  categoryName={cat.name}
                  imageUrl={cat.imageUrl}
                  isActive={activeCategory === cat.name}
                  onClick={() => handleCategoryClick(cat.name)}
                />
              ))}
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </section>

        <section className="mb-8">
           {/* Carousel is already responsive and uses Card internally */}
           <Carousel slides={placeholderCarouselSlides} options={{loop: true}} autoplayOptions={{delay: 5000}}/>
        </section>

        <section>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold text-gray-800">Featured Restaurants</h2>
            <Button variant="link" className="text-orange-600" onClick={() => navigate('/restaurants')}>View All</Button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {placeholderRestaurants.slice(0,4).map((resto) => (
              <RestaurantCardItem
                key={resto.id}
                {...resto}
                onClick={() => handleRestaurantClick(resto.id)}
              />
            ))}
          </div>
        </section>
      </main>
      {/* Footer Placeholder or Navigation */}
      <footer className="p-4 mt-8 text-center text-gray-500 text-sm border-t">
        © 2024 FoodFleet Inc. All rights reserved.
      </footer>
    </div>
  );
};

export default HomeScreen;