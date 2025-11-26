import { formatDate } from "@/utils";
import React, { useState } from "react";
import { Button } from ".";

const DataTable = ({
  heading,
  tableHeader,
  tableData,
  buttons = [],
  dynamicButtons,
}) => {
  const rowsPerPage = 5;
  const [page, setPage] = useState(1);

  // pagination logic
  const totalPages = Math.ceil(tableData.length / rowsPerPage);
  const startIdx = (page - 1) * rowsPerPage;
  const currentRows = tableData.slice(startIdx, startIdx + rowsPerPage);

  return (
    <div className="bg-white shadow-lg rounded-lg p-4 w-full overflow-x-auto">
      {heading && (
        <h2 className="text-xl font-bold text-green-700 mb-4">{heading}</h2>
      )}

      <table className="w-full border-collapse border border-gray-200 text-sm text-left">
        <thead className="bg-green-50 text-green-700 font-semibold">
          <tr>
            {tableHeader.map((col, i) => (
              <th
                key={i}
                className="px-4 py-3 border border-gray-200 whitespace-nowrap"
              >
                {col.label}
              </th>
            ))}
            {(buttons.length > 0 || dynamicButtons) && (
              <th className="px-4 py-3 border border-gray-200 text-center whitespace-nowrap">
                Action
              </th>
            )}
          </tr>
        </thead>

        <tbody>
          {currentRows.length > 0 ? (
            currentRows.map((row, idx) => {
              const rowButtons = dynamicButtons ? dynamicButtons(row) : buttons;

              return (
                <tr
                  key={row._id || idx}
                  className="border-b hover:bg-green-50 transition-colors"
                >
                  {tableHeader.map((col, i) => {
                    const getValue = (obj, path) =>
                      path.split(".").reduce((acc, key) => acc?.[key], obj);

                    const value = getValue(row, col.key);

                    if (col.key === "status") {
                      const isActive = value === "active" || value === true;
                      return (
                        <td
                          key={i}
                          className="px-4 py-3 border border-gray-200 whitespace-nowrap"
                        >
                          <span
                            className={`px-2 py-1 text-xs font-semibold rounded-full ${
                              isActive
                                ? "bg-green-100 text-green-700"
                                : "bg-gray-100 text-gray-700"
                            }`}
                          >
                            {isActive ? "Active" : "Inactive"}
                          </span>
                        </td>
                      );
                    }

                    if (
                      typeof value === "string" &&
                      /^\d{4}-\d{2}-\d{2}T/.test(value)
                    ) {
                      return (
                        <td
                          key={i}
                          className="px-4 py-3 border border-gray-200 whitespace-nowrap"
                        >
                          {formatDate(value)}
                        </td>
                      );
                    }

                    return (
                      <td
                        key={i}
                        className="px-4 py-3 border border-gray-200 whitespace-nowrap"
                      >
                        {value ?? "-"}
                      </td>
                    );
                  })}

                  {(rowButtons.length > 0 || dynamicButtons) && (
                    <td className="px-4 py-3 border border-gray-200 text-center">
                      <div className="flex justify-center gap-2 flex-wrap">
                        {rowButtons.map((btn, idx) => (
                          <Button
                            key={idx}
                            onClick={() => btn.onClick(row)}
                            className={btn.className}
                          >
                            {btn.icon && <span>{btn.icon}</span>}
                            {btn.text && <span>{btn.text}</span>}
                          </Button>
                        ))}
                      </div>
                    </td>
                  )}
                </tr>
              );
            })
          ) : (
            <tr>
              <td
                colSpan={tableHeader.length + 1}
                className="p-6 text-center text-gray-500"
              >
                No data available
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* PAGINATION */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-4 px-2">
          {/* Prev */}
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className={`px-4 py-2 rounded-lg border ${
              page === 1
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-white text-gray-700 hover:bg-gray-50"
            }`}
          >
            Prev
          </button>

          {/* Page numbers */}
          <div className="flex gap-2">
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => setPage(i + 1)}
                className={`px-3 py-1 rounded-lg border ${
                  page === i + 1
                    ? "bg-green-600 text-white"
                    : "bg-white hover:bg-gray-50"
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>

          {/* Next */}
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className={`px-4 py-2 rounded-lg border ${
              page === totalPages
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-white text-gray-700 hover:bg-gray-50"
            }`}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default DataTable;
