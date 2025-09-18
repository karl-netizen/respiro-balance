import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CategoryTab } from '../types/meditation.types';

interface CategoryTabsProps {
  categories: CategoryTab[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  children: React.ReactNode;
}

export const CategoryTabs: React.FC<CategoryTabsProps> = ({
  categories,
  selectedCategory,
  onCategoryChange,
  children
}) => {
  return (
    <Tabs value={selectedCategory} onValueChange={onCategoryChange} className="w-full">
      <TabsList className="grid w-full grid-cols-5">
        {categories.map((tab) => (
          <TabsTrigger key={tab.value} value={tab.value} className="text-sm">
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>
      
      <TabsContent value={selectedCategory} className="mt-6">
        {children}
      </TabsContent>
    </Tabs>
  );
};