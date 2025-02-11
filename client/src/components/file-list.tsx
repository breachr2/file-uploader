import { ArrowUpDown } from "lucide-react";
import { Button } from "./ui/button";
import { formatDate, formatFileSize } from "@/lib/utils";
import { FileText } from "lucide-react";
import { File } from "@/lib/types";
import { useSearchParams } from "react-router-dom";
import FileItem from "./file-item";

function FileList({ files }: { files: File[] }) {
  const [searchParams, setSearchParams] = useSearchParams();

  const toggleSort = (key: string) => {
    const currentValue = searchParams.get(key);
    const newValue = currentValue === "asc" ? "desc" : "asc";

    setSearchParams({ [key]: newValue });
  };
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <table className="w-full">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-2 sm:px-6 py-2 text-xs font-medium text-gray-500 uppercase tracking-wider">
              <Button
                variant="ghost"
                className={`flex items-center hover:bg-gray-200 ${
                  searchParams.get("name") && "bg-gray-200"
                }`}
                size="sm"
                onClick={() => toggleSort("name")}
              >
                Name <ArrowUpDown size={16} />
              </Button>
            </th>
            <th className=" sm:px-6 py-2 text-xs font-medium text-gray-500 uppercase tracking-wider">
              <Button
                variant="ghost"
                className={`flex items-center hover:bg-gray-200 ${
                  searchParams.get("size") && "bg-gray-200"
                }`}
                size="sm"
                onClick={() => toggleSort("size")}
              >
                Size <ArrowUpDown size={16} />
              </Button>
            </th>
            <th className=" sm:px-6 py-2 text-xs font-medium text-gray-500 uppercase tracking-wider">
              <Button
                variant="ghost"
                className={`flex items-center hover:bg-gray-200 ${
                  searchParams.get("createdAt") && "bg-gray-200"
                }`}
                size="sm"
                onClick={() => toggleSort("createdAt")}
              >
                Created At <ArrowUpDown className="ml-1" size={16} />
              </Button>
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {files.map((file) => (
            <FileItem file={file} key={file.id}>
              <tr className="hover:bg-gray-100 cursor-pointer transition-all duration-200 ease-in-out transform hover:scale-[1.01]">
                <td className="px-2 sm:px-6 whitespace-nowrap w-1/2 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="bg-blue-100 rounded-full p-2">
                      <FileText size={18} className="text-blue-500" />
                    </span>
                    <span className="text-xs font-medium text-gray-900 overflow-hidden text-ellipsis max-w-[75px] sm:max-w-[150px] md:max-w-[125px] lg:max-w-[350px] xl:max-w-none sm:text-sm">
                      {file.originalName}
                    </span>
                  </div>
                </td>
                <td className="px-2 sm:px-8 py-4 text-xs whitespace-nowrap text-gray-500 w-1/4 sm:text-sm">
                  {formatFileSize(file.size)}
                </td>
                <td className="px-2 sm:px-8 py-4 text-xs whitespace-nowrap text-gray-500 w-1/4 sm:text-sm">
                  {formatDate(file.createdAt)}
                </td>
              </tr>
            </FileItem>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default FileList;
