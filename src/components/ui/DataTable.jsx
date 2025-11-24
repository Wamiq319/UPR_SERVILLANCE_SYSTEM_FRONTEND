import { formatDate } from "@/utils";
import React from "react";
import { Button } from ".";

const DataTable = ({
  heading,
  tableHeader,
  tableData,
  buttons = [],
  dynamicButtons,
}) => {
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
          {tableData.length > 0 ? (
            tableData.map((row, idx) => {
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

                    // Status indicator using green theme
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

                    // Date formatting
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
    </div>
  );
};

export default DataTable;
