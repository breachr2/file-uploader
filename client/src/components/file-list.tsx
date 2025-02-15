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
                className={`flex items-center hover:bg-gray-200 h-10 text-base ${
                  searchParams.get("name") && "bg-gray-200"
                }`}
                onClick={() => toggleSort("name")}
                size="sm"
              >
                Name <ArrowUpDown size={16} />
              </Button>
            </th>
            <th className=" sm:px-6 py-2 text-xs font-medium text-gray-500 uppercase tracking-wider">
              <Button
                variant="ghost"
                className={`flex items-center hover:bg-gray-200 h-10 text-base ${
                  searchParams.get("size") && "bg-gray-200"
                }`}
                onClick={() => toggleSort("size")}
                size="sm"
              >
                Size <ArrowUpDown size={16} />
              </Button>
            </th>
            <th className=" sm:px-6 py-2 text-xs font-medium text-gray-500 uppercase tracking-wider">
              <Button
                variant="ghost"
                className={`flex items-center hover:bg-gray-200 h-10 text-base ${
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
                    <span className="bg-blue-100 rounded-full p-[10px]">
                      <FileText size={24} className="text-blue-500" />
                    </span>
                    <span className="text-sm font-medium text-gray-900 overflow-hidden text-ellipsis max-w-[75px] sm:max-w-[150px] md:max-w-[125px] lg:max-w-[350px] xl:max-w-none sm:text-base">
                      {file.originalName}
                    </span>
                  </div>
                </td>
                <td className="px-2 sm:px-8 py-4 text-sm whitespace-nowrap text-gray-500 w-1/4 sm:text-base">
                  {formatFileSize(file.size)}
                </td>
                <td className="px-2 sm:px-8 py-4 text-sm whitespace-nowrap text-gray-500 w-1/4 sm:text-base">
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
