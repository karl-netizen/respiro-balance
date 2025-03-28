
import React from "react";
import { Button } from "@/components/ui/button";
import { TimeBlockCategory } from "./TimeBlock";

interface CategorySelectorProps {
  categories: Array<{
    id: TimeBlockCategory;
    label: string;
    color: string;
    icon?: React.ReactNode;
  }>;
  selectedCategory: TimeBlockCategory | null;
  onSelectCategory: (category: TimeBlockCategory) => void;
}

const CategorySelector = ({
  categories,
  selectedCategory,
  onSelectCategory
}: CategorySelectorProps) => {
  return (
    <div className="flex flex-wrap gap-2 p-4 bg-white rounded-md border shadow-sm">
      {categories.map(category => (
        <Button
          key={category.id}
          variant={selectedCategory === category.id ? "default" : "outline"}
          className="flex items-center"
          style={{
            backgroundColor: selectedCategory === category.id ? category.color : "transparent",
            borderColor: category.color,
            color: selectedCategory === category.id ? "white" : "inherit"
          }}
          onClick={() => onSelectCategory(category.id)}
        >
          {category.icon && <span className="mr-2">{category.icon}</span>}
          {category.label}
        </Button>
      ))}
    </div>
  );
};

export default CategorySelector;
