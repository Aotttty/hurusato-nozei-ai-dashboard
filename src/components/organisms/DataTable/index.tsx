import Pagination from "@/components/molecules/Pagination";
import { Pencil, Eye, ChevronUp, ChevronDown, ArrowUpDown } from "lucide-react";
import { cn } from "@/libraries/css";
import Link from "next/link";
import DataTextItem from "@/components/molecules/DataTextItem";
import DataLinkItem from "@/components/molecules/DataLinkItem";
import DataDateTimeItem from "@/components/molecules/DataDateTimeItem";
import SearchForm from "@/components/molecules/SearchForm";

type DataRecord = {
  id: string;
  [key: string]: unknown;
};

type ColumnStructure = {
  name: string;
  key: string;
  type: string | undefined;
  options: Record<string, unknown> | undefined;
  isSortable?: boolean;
};

type Props = {
  count: number;
  offset: number;
  limit: number;
  order?: string;
  direction?: string;
  query?: string;
  data: DataRecord[];
  structure: ColumnStructure[];
  basePath: string;
  showEyeIcon?: boolean;
  showPencilSquareIcon?: boolean;
};

export default function CRUDTable({
  showEyeIcon = true,
  showPencilSquareIcon = true,
  order,
  direction,
  query = "",
  ...props
}: Props) {
  const getSortLink = (key: string) => {
    const newDirection = order === key && direction === "asc" ? "desc" : "asc";
    const params = new URLSearchParams({
      order: key,
      direction: newDirection,
    });
    if (query) {
      params.set("query", query);
    }
    return `${props.basePath}?${params.toString()}`;
  };

  return (
    <>
      <div className="mt-4 flex items-center justify-between">
        <SearchForm defaultValue={query} />
        <Pagination
          count={props.count}
          offset={props.offset}
          limit={props.limit}
          basePath={props.basePath}
        />
      </div>
      <div className="mt-8 flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <div className="overflow-hidden border border-gray-300 shadow ring-1 ring-black ring-opacity-5">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr className="divide-x divide-gray-200">
                    {props.structure.map((column, index) => {
                      const isSortable = column.isSortable ?? false;
                      const isSorted = order === column.key;
                      const className = cn(
                        "py-3.5 px-3 text-left text-sm font-semibold text-gray-900",
                        index === 0 ? "pl-4 sm:pl-6" : "",
                        isSortable ? "cursor-pointer hover:bg-gray-100" : ""
                      );
                      return (
                        <th
                          scope="col"
                          className={className}
                          key={"head-" + column.key}
                        >
                          {isSortable ? (
                            <Link
                              href={getSortLink(column.key)}
                              className="flex items-center group"
                            >
                              {column.name}
                              <span className="ml-2">
                                {isSorted ? (
                                  direction === "asc" ? (
                                    <ChevronUp className="h-4 w-4" />
                                  ) : (
                                    <ChevronDown className="h-4 w-4" />
                                  )
                                ) : (
                                  <ArrowUpDown className="h-4 w-4 text-gray-400 group-hover:text-gray-500" />
                                )}
                              </span>
                            </Link>
                          ) : (
                            column.name
                          )}
                        </th>
                      );
                    })}
                    <th
                      scope="col"
                      className="relative py-3.5 pl-3 pr-4 sm:pr-6 w-20"
                    >
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {props &&
                    props.data &&
                    props.data.map((record, index) => (
                      <tr
                        key={"row-" + index}
                        className="divide-x divide-gray-200"
                      >
                        {props.structure.map((column, colIndex) => {
                          const className = cn(
                            "whitespace-nowrap py-5 text-sm text-gray-500",
                            colIndex === 0 ? "pl-4 pr-3 sm:pl-6" : "px-3"
                          );
                          if (column.type == "link") {
                            return (
                              <td
                                className={className}
                                key={"column-" + column.key}
                              >
                                <DataLinkItem
                                  className={className}
                                  record={record}
                                  name={column.name}
                                  columnKey={column.key}
                                  options={column.options}
                                  key={column.key}
                                />
                              </td>
                            );
                          } else if (column.type == "datetime") {
                            return (
                              <td
                                className={className}
                                key={"column-" + column.key}
                              >
                                <DataDateTimeItem
                                  className={className}
                                  record={record}
                                  name={column.name}
                                  columnKey={column.key}
                                  options={column.options}
                                  key={column.key}
                                />
                              </td>
                            );
                          } else if (column.type == "boolean") {
                            return (
                              <td
                                className={className}
                                key={"column-" + column.key}
                              >
                                <div
                                  className={`text-${
                                    record[column.key] ? "green" : "red"
                                  }-600 font-medium`}
                                >
                                  {record[column.key] ? "✔" : "✘"}
                                </div>
                              </td>
                            );
                          } else {
                            return (
                              <td
                                className={className}
                                key={"column-" + column.key}
                              >
                                <DataTextItem
                                  className={className}
                                  record={record}
                                  name={column.name}
                                  columnKey={column.key}
                                  options={column.options}
                                  key={column.key}
                                />
                              </td>
                            );
                          }
                        })}
                        <td className="relative whitespace-nowrap py-5 pl-3 pr-4 sm:pr-6 text-sm font-medium text-center">
                          <div className="flex justify-center space-x-2">
                            {showEyeIcon && (
                              <a href={props.basePath + "/" + record.id}>
                                <Eye
                                  aria-hidden="true"
                                  className="text-indigo-900 group-hover:text-white h-6 w-6 shrink-0"
                                />
                                <span className="sr-only">View, {index}</span>
                              </a>
                            )}
                            {showPencilSquareIcon && (
                              <a
                                href={
                                  props.basePath + "/" + record.id + "/edit"
                                }
                              >
                                <Pencil
                                  aria-hidden="true"
                                  className="text-indigo-900 hover:text-indigo-900 h-6 w-6 shrink-0"
                                />
                                <span className="sr-only">Edit, {index}</span>
                              </a>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-4">
        <Pagination
          count={props.count}
          offset={props.offset}
          limit={props.limit}
          basePath={props.basePath}
        />
      </div>
    </>
  );
}
