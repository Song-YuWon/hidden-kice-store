const PLACEHOLDER_COUNT = 12;

export function ProductsSkeleton({ count = PLACEHOLDER_COUNT }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 gap-x-6 gap-y-9 sm:grid-cols-3 lg:grid-cols-4 lg:gap-x-[93px]">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="flex animate-pulse flex-col gap-2">
          <div className="h-[320px] w-full rounded-md bg-gray-50" />
          <div className="h-4 w-16 rounded bg-gray-50" />
          <div className="h-5 w-full rounded bg-gray-50" />
          <div className="h-5 w-24 rounded bg-gray-50" />
        </div>
      ))}
    </div>
  );
}
