
import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import ProgressTracker from "./ProgressTracker";
import CategorySelector from "./CategorySelector";
import { TimeBlockCategory } from "./TimeBlock";

interface CategoryData {
  id: TimeBlockCategory;
  label: string;
  color: string;
  icon?: React.ReactNode;
}

interface ProgressData {
  totalHours: number;
  goalHours: number;
  weeklyAverage: number;
  streak: number;
}

interface ProgressAndCategoriesSectionProps {
  categories: CategoryData[];
  selectedCategory: TimeBlockCategory | null;
  onSelectCategory: (category: TimeBlockCategory) => void;
  progressData: Record<string, ProgressData>;
}

const ProgressAndCategoriesSection = ({
  categories,
  selectedCategory,
  onSelectCategory,
  progressData
}: ProgressAndCategoriesSectionProps) => {
  return (
    <div className="grid md:grid-cols-2 gap-4 md:gap-6">
      <Card>
        <CardHeader className="pb-2 md:pb-3">
          <CardTitle className="text-lg md:text-xl">1000-Hour Method</CardTitle>
          <CardDescription className="text-xs md:text-sm">
            Track your progress toward mastery in key areas
          </CardDescription>
        </CardHeader>
        <CardContent>
          {selectedCategory && progressData[selectedCategory] ? (
            <ProgressTracker 
              {...progressData[selectedCategory]}
              category={categories.find(c => c.id === selectedCategory)?.label || ""}
            />
          ) : (
            <div className="text-center py-2 md:py-4 text-xs md:text-sm text-muted-foreground">
              Select a category to view progress
            </div>
          )}
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2 md:pb-3">
          <CardTitle className="text-lg md:text-xl">Categories</CardTitle>
          <CardDescription className="text-xs md:text-sm">
            Select to view progress toward 1000 hours
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-2 pb-3 md:py-4">
          <CategorySelector
            categories={categories}
            selectedCategory={selectedCategory}
            onSelectCategory={onSelectCategory}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default ProgressAndCategoriesSection;
