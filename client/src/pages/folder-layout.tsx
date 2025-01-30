import { Outlet } from "react-router-dom";
import { Separator } from "@/components/ui/separator";
import { useSearchParams } from "react-router-dom";
import { ArrowUp, ArrowDown } from "lucide-react";

function FolderLayout() {
  const [searchParams, setSearchParams] = useSearchParams();
  console.log("")

  const toggleSort = (key: string) => {
    const currentValue = searchParams.get(key);
    const newValue = currentValue === "asc" ? "desc" : "asc";

    setSearchParams({ [key]: newValue });
  };

  return (
    <div className="h-full flex flex-col gap-2">
      <div className="grid grid-cols-4 text-md">
        <SortableColumn
          className="col-span-2"
          label="Name"
          sortKey="name"
          searchParams={searchParams}
          toggleSort={toggleSort}
        />
        <SortableColumn
          className="col-span-1"
          label="Size"
          sortKey="size"
          searchParams={searchParams}
          toggleSort={toggleSort}
        />
        <SortableColumn
          className="col-span-1"
          label="Created"
          sortKey="createdAt"
          searchParams={searchParams}
          toggleSort={toggleSort}
        />
        <Separator className="bg-neutral-800 col-span-4" decorative={true} />
      </div>

      <Outlet context={{ searchParams: searchParams }} />
    </div>
  );
}

const SortableColumn = ({
  label,
  sortKey,
  searchParams,
  toggleSort,
  className,
}: any) => {
  const currentSort = searchParams.get(sortKey);

  return (
    <p
      className={`flex gap-2 items-center hover:bg-hover rounded-sm px-2 py-1 cursor-pointer ${
        currentSort ? "bg-hover" : ""
      } ${className}`}
      onClick={() => toggleSort(sortKey)}
    >
      {label}
      {currentSort === "asc" ? <ArrowUp size={16} /> : <ArrowDown size={16} />}
    </p>
  );
};

export default FolderLayout;
