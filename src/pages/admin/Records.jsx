import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchResources, updateResource } from "@/redux/slices/resourcesSLice";
import { DataTable, Button } from "@/components";

const RecordPage = () => {
  const dispatch = useDispatch();
  const { data, status, error } = useSelector((state) => state.resources);

  const [session, setSession] = useState("");
  const [className, setClassName] = useState("");

  const resourcePath = `chroma/records/${session}/${className}`;
  const records = data[resourcePath] || [];

  // Modal states
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [rootFolder, setRootFolder] = useState("");

  const handleFetch = () => {
    if (!session || !className) return;
    dispatch(fetchResources({ resource: resourcePath }));
  };

  // --- Update ---
  const openUpdateModal = (row) => {
    setSelectedRow(row);
    setRootFolder(row.root_folder || "");
    setShowUpdateModal(true);
  };

  const handleUpdateSubmit = async () => {
    if (!selectedRow) return;
    const updatedData = {
      student_id: selectedRow.student_id,
      session: selectedRow.session,
      class_name: selectedRow.class_name,
      root_folder: rootFolder,
    };
    try {
      await dispatch(
        updateResource({
          resource: "chroma/update-student",
          id: selectedRow.student_id,
          body: updatedData,
        })
      ).unwrap();
      alert(`Student ${selectedRow.student_id} updated successfully`);
      setShowUpdateModal(false);
      handleFetch();
    } catch (err) {
      alert(`Update failed: ${err}`);
    }
  };

  // --- Delete ---
  const openDeleteModal = (row) => {
    setSelectedRow(row);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedRow) return;

    const deleteData = {
      student_id: selectedRow.student_id,
      session: selectedRow.session,
      class_name: selectedRow.class_name,
    };

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/chroma/delete-student`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          credentials: "include",
          body: JSON.stringify(deleteData),
        }
      );

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.detail?.[0]?.msg || "Delete failed");
      }

      alert(`Student ${selectedRow.student_id} deleted successfully`);
      setShowDeleteModal(false);
      handleFetch();
    } catch (err) {
      alert(`Delete failed: ${err.message}`);
    }
  };

  // Flatten metadata for table
  const flattenedRecords = records.map((r) => ({
    student_id: r.student_id,
    class_name: r.metadata?.class_name || "",
    session: r.metadata?.session || "",
    semester: r.metadata?.semester || "",
    roll_no: r.metadata?.roll_no || "",
    embedding_length: r.embedding_length,
    root_folder: r.root_folder || "",
  }));

  const tableHeader = [
    { label: "Student ID", key: "student_id" },
    { label: "Class", key: "class_name" },
    { label: "Session", key: "session" },
    { label: "Semester", key: "semester" },
    { label: "Roll No", key: "roll_no" },
    { label: "Embedding Length", key: "embedding_length" },
  ];

  const dynamicButtons = (row) => [
    {
      text: "Update",
      className: "px-3 py-1 border rounded",
      onClick: () => openUpdateModal(row),
    },
    {
      text: "Delete",
      className: "px-3 py-1 border rounded",
      onClick: () => openDeleteModal(row),
    },
  ];

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-green-700 mb-6">Chroma Records</h1>

      {/* Inputs */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <input
          type="text"
          placeholder="Session (e.g., 2021-2025)"
          value={session}
          onChange={(e) => setSession(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
        />
        <input
          type="text"
          placeholder="Class Name (e.g., SE101)"
          value={className}
          onChange={(e) => setClassName(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
        />
        <Button
          onClick={handleFetch}
          className="px-6 py-2 self-start border rounded"
        >
          {status === "loading" ? "Loading..." : "Fetch Records"}
        </Button>
      </div>

      {/* Table */}
      {flattenedRecords.length > 0 ? (
        <DataTable
          heading={`Records for ${className} (${session})`}
          tableHeader={tableHeader}
          tableData={flattenedRecords}
          dynamicButtons={dynamicButtons}
        />
      ) : (
        status !== "loading" && (
          <div className="text-center py-12 rounded-lg border border-gray-300 text-gray-500">
            No records found.
          </div>
        )
      )}

      {error && <p className="text-red-500 mt-4">{error}</p>}

      {/* --- Update Modal --- */}
      {showUpdateModal && selectedRow && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="p-6 rounded-lg border w-96">
            <h2 className="text-xl font-bold mb-4">Update Student</h2>
            <div className="flex flex-col gap-2 mb-4">
              <input
                type="text"
                value={selectedRow.student_id}
                readOnly
                className="px-3 py-2 border rounded"
                placeholder="Student ID"
              />
              <input
                type="text"
                value={selectedRow.class_name}
                readOnly
                className="px-3 py-2 border rounded"
                placeholder="Class Name"
              />
              <input
                type="text"
                value={selectedRow.session}
                readOnly
                className="px-3 py-2 border rounded"
                placeholder="Session"
              />
              <input
                type="text"
                value={selectedRow.roll_no}
                readOnly
                className="px-3 py-2 border rounded"
                placeholder="Roll No"
              />
              <input
                type="text"
                value={rootFolder}
                onChange={(e) => setRootFolder(e.target.value)}
                className="px-3 py-2 border rounded"
                placeholder="Root Folder"
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button
                className="px-3 py-1 border rounded"
                onClick={() => setShowUpdateModal(false)}
              >
                Cancel
              </Button>
              <Button
                className="px-3 py-1 border rounded"
                onClick={handleUpdateSubmit}
              >
                Update
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* --- Delete Modal --- */}
      {showDeleteModal && selectedRow && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="p-6 rounded-lg border w-80">
            <h2 className="text-xl font-bold mb-4">Confirm Delete</h2>
            <p className="mb-4">
              Are you sure you want to delete <b>{selectedRow.student_id}</b>?
            </p>
            <div className="flex justify-end gap-2">
              <Button
                className="px-3 py-1 border rounded"
                onClick={() => setShowDeleteModal(false)}
              >
                No
              </Button>
              <Button
                className="px-3 py-1 border rounded"
                onClick={handleDeleteConfirm}
              >
                Yes
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecordPage;
