import { ArrowUpDown } from "lucide-react";
import { File as FileIcon } from "lucide-react";
import { formatDate, formatFileSize } from "@/lib/utils";
import { File } from "@/lib/types";
import FileItem from "./file-item";
import { useSearchParams } from "react-router-dom";

function FileList({ files }: { files: File[] }) {
  const [searchParams, setSearchParams] = useSearchParams();

  const toggleSort = (key: string) => {
    const currentValue = searchParams.get(key);
    const newValue = currentValue === "asc" ? "desc" : "asc";

    setSearchParams({ [key]: newValue });
  };
  return (
    <div className="bg-white rounded-lg shadow-md overflow-x-auto">
      <table className="table-auto w-full">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ">
              <button
                className="flex items-center"
                onClick={() => toggleSort("name")}
              >
                Name <ArrowUpDown className="ml-1" size={16} />
              </button>
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              <button
                className="flex items-center"
                onClick={() => toggleSort("size")}
              >
                Size <ArrowUpDown className="ml-1" size={16} />
              </button>
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              <button
                className="flex items-center"
                onClick={() => toggleSort("createdAt")}
              >
                Created At <ArrowUpDown className="ml-1" size={16} />
              </button>
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {files.map((file) => (
            <FileItem file={file} key={file.id}>
              <tr className="hover:bg-gray-100 cursor-pointer">
                <td className="px-6 py-4 whitespace-nowrap w-1/2 min-w-0">
                  <div className="flex items-center gap-2 ">
                    <FileIcon size={20} className="text-gray-500 shrink-0" />
                    <span className="text-xs font-medium text-gray-900 overflow-hidden whitespace-nowrap text-ellipsis max-w-[75px] sm:max-w-[150px] md:max-w-[125px] lg:max-w-[350px] xl:max-w-none sm:text-sm">
                      {file.originalName}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-500 w-1/4 sm:text-sm">
                  {formatFileSize(file.size)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-500 w-1/4 sm:text-sm">
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
