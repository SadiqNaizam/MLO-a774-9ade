import React from 'react';
import { cn } from '@/lib/utils'; // For combining class names

interface FoodCategoryChipProps {
  categoryName: string;
  imageUrl?: string; // Optional image for the category
  isActive?: boolean;
  onClick: () => void;
  className?: string;
}

const FoodCategoryChip: React.FC<FoodCategoryChipProps> = ({
  categoryName,
  imageUrl,
  isActive,
  onClick,
  className,
}) => {
  console.log("Rendering FoodCategoryChip:", categoryName, "Active:", isActive);

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex flex-col items-center justify-center p-2 m-1 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500",
        isActive ? "bg-orange-500 text-white" : "bg-white text-gray-700 hover:bg-gray-50",
        "w-24 h-24 text-center", // Fixed size for consistency
        className
      )}
      aria-pressed={isActive}
    >
      {imageUrl && (
        <img
          src={imageUrl}
          alt={categoryName}
          className="w-10 h-10 object-contain mb-1 rounded"
          onError={(e) => (e.currentTarget.style.display = 'none')} // Hide if image fails to load
        />
      )}
      <span className="text-xs font-medium truncate w-full">{categoryName}</span>
    </button>
  );
};

export default FoodCategoryChip;