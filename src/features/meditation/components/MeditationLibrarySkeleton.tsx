

export const MeditationLibrarySkeleton = () => {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="animate-pulse">
        <div className="h-8 bg-muted rounded-md w-1/3 mb-4"></div>
        <div className="h-4 bg-muted rounded-md w-2/3 mb-8"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-48 bg-muted rounded-lg"></div>
          ))}
        </div>
      </div>
    </div>
  );
};