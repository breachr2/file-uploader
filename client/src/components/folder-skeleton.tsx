import { Skeleton } from "./ui/skeleton";

function FolderSkeleton({ length = 8 }: { length?: number }) {
  return (
    <>
      {Array.from({ length: length }).map((_, index) => (
        <Skeleton key={index} className="rounded-sm h-8" />
      ))}
    </>
  );
}

export default FolderSkeleton;
