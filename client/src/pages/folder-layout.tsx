import { Outlet } from "react-router-dom";
import { Separator } from "@/components/ui/separator";
import { useSearchParams } from "react-router-dom";

function FolderLayout() {
  const [searchParams, setSearchParams] = useSearchParams();
  console.log(searchParams)
  return (
    <div className="h-full flex flex-col gap-2">
      <div className="grid grid-cols-4 text-md ">
        <p className="col-span-2 hover:bg-hover rounded-sm px-2 py-1 cursor-pointer">
          Name
        </p>
        <p className="col-span-1 hover:bg-hover rounded-sm px-2 py-1 cursor-pointer">
          Size
        </p>
        <p className="col-span-1 hover:bg-hover rounded-sm px-2 py-1 cursor-pointer">
          Created
        </p>
        <Separator className="bg-neutral-800 col-span-4" decorative={true} />
      </div>

      <Outlet />
    </div>
  );
}

export default FolderLayout;
