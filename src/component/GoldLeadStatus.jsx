import React, { useEffect, useState } from "react";
import { getGoldLoanLeads } from "../api/apiNSDL";

const GoldLeadStatus = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 7;

  const fetchRecords = async () => {
    setLoading(true);
    try {
      const data = await getGoldLoanLeads();
      if (data && data.data && Array.isArray(data.data.leads)) {
        setRecords(data.data.leads);
      }
    } catch (error) {
      console.error("Failed to fetch records", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  const headers = [
    "lead_id", "first_name", "mobile", "loan_type", "loan_purpose",
    "company_name", "requested_amount", "lead_status", "loan_status",
    "city", "state", "pincode", "existing_loan_provider", "existing_loan_amount",
    "requested_date"
  ];

  const filteredRecords = records.filter((record) => {
    const recordDate = new Date(record.requested_date);
    const start = startDate ? new Date(startDate) : null;
    const end = endDate ? new Date(endDate) : null;

    const matchesSearch = headers.some((header) => {
      const value = record[header];
      return value && value.toString().toLowerCase().includes(searchTerm.toLowerCase());
    });

    const matchesDate =
      (!start || recordDate >= start) &&
      (!end || recordDate <= end);

    return matchesSearch && matchesDate;
  });

  const totalPages = Math.ceil(filteredRecords.length / recordsPerPage);
  const startIndex = (currentPage - 1) * recordsPerPage;
  const currentRecords = filteredRecords.slice(startIndex, startIndex + recordsPerPage);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const downloadCSV = () => {
    const dataToDownload = searchTerm || startDate || endDate ? filteredRecords : records;
    const csvHeaders = headers.join(",");
    const csvRows = dataToDownload.map(record =>
      headers.map(header => `"${record[header] || ''}"`).join(",")
    );
    const csvContent = [csvHeaders, ...csvRows].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "gold_leads_data.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-6 rounded-lg">
      {/* Filter Section with Reset */}
      <div className="mb-4">
        <div className="grid grid-cols-5 items-center gap-2 text-black mb-3">
          <label className="text-right font-medium">
            Start Date: <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="border bg-white px-3 py-2 rounded w-full"
          />
          <label className="text-right font-medium">
            End Date: <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="border bg-white px-3 py-2 rounded w-full"
          />
          <button
            onClick={() => {
              setSearchTerm("");
              setStartDate("");
              setEndDate("");
              setCurrentPage(1);
            }}
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded font-semibold"
          >
            Reset
          </button>
        </div>

        <div className="flex items-center space-x-3">
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
            onClick={downloadCSV}
            className="px-4 py-2 bg-green-600 hover:bg-green-500 text-white rounded font-semibold w-32"
          >
            Download
          </button>
        </div>
      </div>

      {/* Table Section */}
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
                        {header === "requested_date" && record[header]
                          ? new Date(record[header]).toLocaleDateString()
                          : record[header] || "N/A"}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
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

export default GoldLeadStatus;
