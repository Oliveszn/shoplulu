const ShopSkeleton = () => {
  return (
    <div className="grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-10">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="w-full max-w-sm mx-auto bg-transparent shadow">
          <div className="relative h-[320px] bg-gray-200 animate-pulse rounded-lg"></div>
          <div className="p-3 flex items-center flex-col">
            <div className="h-4 bg-gray-200 rounded w-2/3 mb-2 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-1/3 animate-pulse"></div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ShopSkeleton;
