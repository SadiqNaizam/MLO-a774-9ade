import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle, SheetFooter, SheetClose } from '@/components/ui/sheet';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import RestaurantCardItem from '@/components/RestaurantCardItem';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Pagination, PaginationContent, PaginationItem, PaginationPrevious, PaginationLink, PaginationEllipsis, PaginationNext } from '@/components/ui/pagination';
import { Filter, Search, ArrowLeft, X } from 'lucide-react';

const allRestaurants = [
  { id: '1', name: 'The Gourmet Place', imageUrl: 'https://source.unsplash.com/random/400x300/?restaurant,fine-dining', rating: 4.5, deliveryTime: '25-35 min', cuisineTypes: ['Italian', 'Fine Dining'], priceRange: '$$$' as '$$$' },
  { id: '2', name: 'Quick Bites Central', imageUrl: 'https://source.unsplash.com/random/400x300/?fast-food,burgers', rating: 4.2, deliveryTime: '15-25 min', cuisineTypes: ['Burgers', 'Fries'], priceRange: '$' as '$' },
  { id: '3', name: 'Spice Route Express', imageUrl: 'https://source.unsplash.com/random/400x300/?indian,restaurant', rating: 4.7, deliveryTime: '30-40 min', cuisineTypes: ['Indian', 'Curry'], priceRange: '$$' as '$$' },
  { id: '4', name: 'Healthy Hub', imageUrl: 'https://source.unsplash.com/random/400x300/?healthy,food', rating: 4.9, deliveryTime: '20-30 min', cuisineTypes: ['Salads', 'Smoothies', 'Vegan'], priceRange: '$$' as '$$' },
  { id: '5', name: 'Sushi Sensation', imageUrl: 'https://source.unsplash.com/random/400x300/?sushi,bar', rating: 4.6, deliveryTime: '35-45 min', cuisineTypes: ['Japanese', 'Sushi'], priceRange: '$$$' as '$$$' },
  { id: '6', name: 'Pizza Planet', imageUrl: 'https://source.unsplash.com/random/400x300/?pizza,place', rating: 4.3, deliveryTime: '20-30 min', cuisineTypes: ['Pizza', 'Italian'], priceRange: '$' as '$' },
  { id: '7', name: 'Taco Fiesta', imageUrl: 'https://source.unsplash.com/random/400x300/?mexican,food', rating: 4.4, deliveryTime: '25-35 min', cuisineTypes: ['Mexican', 'Tacos'], priceRange: '$$' as '$$' },
  { id: '8', name: 'Morning Brew Cafe', imageUrl: 'https://source.unsplash.com/random/400x300/?cafe,coffee', rating: 4.8, deliveryTime: '10-20 min', cuisineTypes: ['Coffee', 'Breakfast', 'Pastries'], priceRange: '$' as '$' },
];

const ITEMS_PER_PAGE = 6;

const cuisineOptions = ['Italian', 'Burgers', 'Indian', 'Vegan', 'Japanese', 'Mexican', 'Coffee'];
const priceRangeOptions = [
    { value: '$', label: '$ (Affordable)' },
    { value: '$$', label: '$$ (Moderate)' },
    { value: '$$$', label: '$$$ (Pricey)' },
];

const RestaurantListingScreen = () => {
  console.log('RestaurantListingScreen loaded');
  const navigate = useNavigate();
  const location = useLocation();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCuisines, setSelectedCuisines] = useState<string[]>([]);
  const [selectedPriceRange, setSelectedPriceRange] = useState<string | undefined>(undefined);
  const [minRating, setMinRating] = useState<number>(0);
  const [sortBy, setSortBy] = useState<string>('rating_desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredRestaurants, setFilteredRestaurants] = useState(allRestaurants);
  const [appliedFiltersCount, setAppliedFiltersCount] = useState(0);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const category = params.get('category');
    const search = params.get('search');
    
    if (category) {
      setSelectedCuisines([category]);
      setSearchQuery(''); // Clear search if category is present
    } else if (search) {
      setSearchQuery(search);
    }
  }, [location.search]);

  useEffect(() => {
    let result = allRestaurants;

    // Filter by search query (name or cuisine)
    if (searchQuery.trim()) {
      result = result.filter(r =>
        r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.cuisineTypes.some(c => c.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }
    
    // Filter by selected cuisines
    if (selectedCuisines.length > 0) {
      result = result.filter(r => r.cuisineTypes.some(c => selectedCuisines.includes(c)));
    }

    // Filter by price range
    if (selectedPriceRange) {
      result = result.filter(r => r.priceRange === selectedPriceRange);
    }

    // Filter by minimum rating
    if (minRating > 0) {
      result = result.filter(r => r.rating && r.rating >= minRating);
    }
    
    // Sorting
    result.sort((a, b) => {
        const aRating = a.rating || 0;
        const bRating = b.rating || 0;
        switch (sortBy) {
            case 'rating_desc': return bRating - aRating;
            case 'rating_asc': return aRating - bRating;
            case 'delivery_time_asc':
                const timeA = parseInt(a.deliveryTime?.split('-')[0] || '999');
                const timeB = parseInt(b.deliveryTime?.split('-')[0] || '999');
                return timeA - timeB;
            default: return 0;
        }
    });

    setFilteredRestaurants(result);
    setCurrentPage(1); // Reset to first page on filter change

    // Update applied filters count
    let count = 0;
    if (selectedCuisines.length > 0) count++;
    if (selectedPriceRange) count++;
    if (minRating > 0) count++;
    setAppliedFiltersCount(count);

  }, [searchQuery, selectedCuisines, selectedPriceRange, minRating, sortBy]);

  const handleRestaurantClick = (id: string) => {
    navigate(`/restaurant/${id}/menu`);
  };

  const handleCuisineChange = (cuisine: string) => {
    setSelectedCuisines(prev => 
      prev.includes(cuisine) ? prev.filter(c => c !== cuisine) : [...prev, cuisine]
    );
  };
  
  const clearFilters = () => {
    setSelectedCuisines([]);
    setSelectedPriceRange(undefined);
    setMinRating(0);
    // setSearchQuery(''); // Optionally clear search query
  };

  const totalPages = Math.ceil(filteredRestaurants.length / ITEMS_PER_PAGE);
  const paginatedRestaurants = filteredRestaurants.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="container mx-auto p-4 flex items-center space-x-2 sm:space-x-4">
            <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="sm:mr-2">
                <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="relative flex-grow">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                type="search"
                placeholder="Search restaurants..."
                className="w-full pl-10 pr-4 py-2 border rounded-lg"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>
            <Sheet>
                <SheetTrigger asChild>
                    <Button variant="outline" className="relative">
                        <Filter className="h-4 w-4 mr-2" />
                        Filters
                        {appliedFiltersCount > 0 && (
                            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-orange-500 text-xs text-white">
                                {appliedFiltersCount}
                            </span>
                        )}
                    </Button>
                </SheetTrigger>
                <SheetContent className="w-[300px] sm:w-[400px] flex flex-col">
                    <SheetHeader>
                        <SheetTitle>Filter & Sort</SheetTitle>
                    </SheetHeader>
                    <ScrollArea className="flex-grow p-1 -mx-1">
                        <div className="space-y-6 p-4">
                            <div>
                                <Label className="text-base font-semibold mb-2 block">Cuisine</Label>
                                <div className="space-y-2">
                                {cuisineOptions.map(cuisine => (
                                    <div key={cuisine} className="flex items-center space-x-2">
                                    <Checkbox
                                        id={`cuisine-${cuisine}`}
                                        checked={selectedCuisines.includes(cuisine)}
                                        onCheckedChange={() => handleCuisineChange(cuisine)}
                                    />
                                    <Label htmlFor={`cuisine-${cuisine}`} className="font-normal">{cuisine}</Label>
                                    </div>
                                ))}
                                </div>
                            </div>
                            <div>
                                <Label className="text-base font-semibold mb-2 block">Price Range</Label>
                                <RadioGroup value={selectedPriceRange} onValueChange={setSelectedPriceRange}>
                                {priceRangeOptions.map(opt => (
                                    <div key={opt.value} className="flex items-center space-x-2">
                                    <RadioGroupItem value={opt.value} id={`price-${opt.value}`} />
                                    <Label htmlFor={`price-${opt.value}`} className="font-normal">{opt.label}</Label>
                                    </div>
                                ))}
                                </RadioGroup>
                            </div>
                            <div>
                                <Label htmlFor="rating-slider" className="text-base font-semibold mb-2 block">Min. Rating: {minRating.toFixed(1)} ★</Label>
                                <Slider
                                id="rating-slider"
                                defaultValue={[minRating]}
                                max={5}
                                step={0.1}
                                onValueChange={(value) => setMinRating(value[0])}
                                className="mt-4"
                                />
                            </div>
                        </div>
                    </ScrollArea>
                    <SheetFooter className="mt-auto p-4 border-t flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                        <Button variant="outline" onClick={clearFilters} className="w-full sm:w-auto">Clear Filters</Button>
                        <SheetClose asChild>
                            <Button type="submit" className="w-full sm:w-auto bg-orange-500 hover:bg-orange-600">Apply</Button>
                        </SheetClose>
                    </SheetFooter>
                </SheetContent>
            </Sheet>
        </div>
        <div className="container mx-auto px-4 py-2 flex justify-between items-center border-t border-gray-200">
            <p className="text-sm text-gray-600">{filteredRestaurants.length} restaurants found</p>
            <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="rating_desc">Rating (High to Low)</SelectItem>
                    <SelectItem value="rating_asc">Rating (Low to High)</SelectItem>
                    <SelectItem value="delivery_time_asc">Delivery Time (Fastest)</SelectItem>
                </SelectContent>
            </Select>
        </div>
      </header>

      <ScrollArea className="flex-grow">
        <main className="container mx-auto p-4">
          {paginatedRestaurants.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {paginatedRestaurants.map((resto) => (
                <RestaurantCardItem
                  key={resto.id}
                  {...resto}
                  onClick={() => handleRestaurantClick(resto.id)}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-10">
              <X className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-xl font-semibold text-gray-700">No Restaurants Found</h3>
              <p className="text-gray-500">Try adjusting your search or filters.</p>
            </div>
          )}
        </main>
      </ScrollArea>

      {totalPages > 1 && (
        <footer className="bg-white p-4 border-t mt-auto">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious href="#" onClick={(e) => { e.preventDefault(); setCurrentPage(p => Math.max(1, p-1)); }} isActive={currentPage > 1} />
              </PaginationItem>
              {[...Array(totalPages)].map((_, i) => (
                 // Basic pagination, could be more complex for many pages
                 (i < 2 || i > totalPages - 3 || Math.abs(i - (currentPage-1)) < 2) ? (
                    <PaginationItem key={i}>
                        <PaginationLink href="#" onClick={(e) => { e.preventDefault(); setCurrentPage(i + 1); }} isActive={currentPage === i + 1}>
                        {i + 1}
                        </PaginationLink>
                    </PaginationItem>
                 ) : ( (Math.abs(i - (currentPage-1)) === 2) && <PaginationEllipsis key={`ellipsis-${i}`} />)
              ))}
              <PaginationItem>
                <PaginationNext href="#" onClick={(e) => { e.preventDefault(); setCurrentPage(p => Math.min(totalPages, p+1)); }} isActive={currentPage < totalPages}/>
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </footer>
      )}
    </div>
  );
};

export default RestaurantListingScreen;