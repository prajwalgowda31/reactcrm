import React, { useEffect, useState } from "react";
import { getkitallocation } from "../api/apiNSDL";

const AllocationTable = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 7;

  useEffect(() => {
    const fetchRecords = async () => {
      setLoading(true);
      try {
        const data = await getkitallocation();
        if (data && data.data) {
          setRecords(data.data);
        }
      } catch (error) {
        console.error("Failed to fetch records", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecords();
  }, []);

  const headers = ["created_at", "kit_ref_id", "kit_card_no", "external_agent_id", "dost_name", "kit_status"];

  const filteredRecords = records.filter((record) =>
    headers.some((header) => {
      const value = record[header];
      return value && value.toString().toLowerCase().includes(searchTerm.toLowerCase());
    })
  );

  const totalPages = Math.ceil(filteredRecords.length / recordsPerPage);
  const startIndex = (currentPage - 1) * recordsPerPage;
  const currentRecords = filteredRecords.slice(startIndex, startIndex + recordsPerPage);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  // Function to download filtered or full data
  const downloadCSV = () => {
    const dataToDownload = searchTerm ? filteredRecords : records; // Download filtered records if search is applied
    const csvHeaders = headers.join(","); // Convert headers to CSV format
    const csvRows = dataToDownload.map(record =>
      headers.map(header => `"${record[header] || ''}"`).join(",") // Convert each row to CSV format
    );

    const csvContent = [csvHeaders, ...csvRows].join("\n"); // Join headers and rows
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = searchTerm ? "filtered_kit_allocation_data.csv" : "kit_allocation_data.csv"; // Change filename based on filter
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-6 rounded-lg">
      <div className="flex items-center space-x-3 mb-4">
        <div className="relative w-1/3">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
          <input
            type="text"
            placeholder="Search records..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="pl-10 pr-3 py-2 w-full border border-black rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button
          onClick={() => {
            setSearchTerm("");
            setCurrentPage(1);
          }}
          className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded font-semibold w-32"
        >
          Reset
        </button>
        {/* Download CSV Button */}
        <button
          onClick={downloadCSV}
          className="px-4 py-2 bg-green-600 hover:bg-green-500 text-white rounded font-semibold  w-32"
        >
          Download
        </button>
      </div>

      {loading ? (
        <p className="text-gray-600 text-center">Loading...</p>
      ) : records.length > 0 ? (
        <>
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-300 bg-white shadow-md">
              <thead>
                <tr className="bg-blue-500 text-white text-center">
                  {headers.map((header) => (
                    <th key={header} className="p-3 border border-gray-300 capitalize">
                      {header.replace(/_/g, " ").toUpperCase()}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {currentRecords.map((record, idx) => (
                  <tr key={idx} className="hover:bg-gray-200 text-center">
                    {headers.map((header) => (
                      <td key={header} className="p-3 border border-gray-300">
                        {record[header] || "N/A"}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          <div className="flex justify-center items-center space-x-2 mt-4">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={`px-3 py-1 rounded border ${
                currentPage === 1 ? "bg-gray-200 text-gray-500 cursor-not-allowed" : "bg-white hover:bg-gray-100"
              }`}
            >
              Prev
            </button>
            <span className="text-sm font-medium">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`px-3 py-1 rounded border ${
                currentPage === totalPages ? "bg-gray-200 text-gray-500 cursor-not-allowed" : "bg-white hover:bg-gray-100"
              }`}
            >
              Next
            </button>
          </div>
        </>
      ) : (
        <p className="text-gray-600 text-center">No records found.</p>
      )}
    </div>
  );
};

export default AllocationTable;
