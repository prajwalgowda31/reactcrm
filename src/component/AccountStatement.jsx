import React, { useState } from "react";
import { getStatementDetails } from "../api/apiNSDL";

const AccountStatement = () => {
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [statementData, setStatementData] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Changed filter keys to custName and dso_name matching API response
  const [filters, setFilters] = useState({ custName: "", dso_name: "" });
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5;

  const fetchStatementData = async (e) => {
    e.preventDefault();
    if (loading) return;
    setError("");
    if (!fromDate || !toDate) {
      setError("Both start and end dates are required.");
      return;
    }

    setLoading(true);
    try {
      const response = await getStatementDetails(fromDate, toDate);
      console.log("response ===>", response);

      if (
        response?.statuscode === 200 &&
        response.data?.statements?.length > 0
      ) {
        setStatementData(response.data.statements);
        setError("");
        setCurrentPage(1);
      } else {
        setError(response?.message || "No records found for selected dates.");
        setStatementData([]);
      }
    } catch (err) {
      setError("Network error. Please try again.");
      setStatementData([]);
      console.error("API Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFromDate("");
    setToDate("");
    setStatementData([]);
    setError("");
    setLoading(false);
    setCurrentPage(1);
  };

  const resetTableFilters = () => {
    setFilters({ custName: "", dso_name: "" });
  };

  // Updated to filter by custName and dso_name
  const filteredData = statementData.filter((item) => {
    const userMatch = item.custName
      ?.toLowerCase()
      .includes(filters.custName.toLowerCase());
    const agentMatch = item.dso_name
      ?.toLowerCase()
      .includes(filters.dso_name.toLowerCase());
    return userMatch && agentMatch;
  });

  const totalPages = Math.ceil(filteredData.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const currentRows = filteredData.slice(startIndex, startIndex + rowsPerPage);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const downloadCSV = (data) => {
    const headers = [
      "Description",
      "Credit Amount",
      "Debit Amount",
      "GST",
      "Date",
      "Account No",
      "Reference ID",
      "Agent Name",
      "User Name",
      "Collection Mode",
      "Transaction Mode",
    ];
    const csvRows = [
      headers.join(","),
      ...data.map((row) =>
        [
          row.desc,
          row.credit_amount,
          row.debit_amount,
          row.gst,
          row.date ? new Date(row.date).toLocaleString() : "",
          row.account_no,
          row.ref_id,
          row.dso_name,     // changed to dso_name
          row.custName,     // changed to custName
          row.collection_mode,
          row.transaction_mode,
        ]
          .map((field) => `"${field || "-"}"`)
          .join(",")
      ),
    ];
    const blob = new Blob([csvRows.join("\n")], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "account_statement.csv";
    a.click();
  };

  return (
    <div className="p-4">
      <div className="max-w-lg mx-auto bg-gray-100 p-5 rounded-lg mb-6 border border-black">
        <h2 className="text-2xl font-semibold mb-3 text-center">
          Account Statement
        </h2>
        <hr className="border-t border-gray-500 mb-6" />
        <form onSubmit={fetchStatementData}>
          <div className="mb-4 flex items-center">
            <label
              htmlFor="fromDate"
              className="font-medium text-gray-00 w-1/3 text-right mr-6"
            >
              From Date: <span className="text-red-500">*</span>
            </label>
            <input
              id="fromDate"
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className="p-2 w-2/3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div className="mb-4 flex items-center">
            <label
              htmlFor="toDate"
              className="font-medium text-gray-700 w-1/3 text-right mr-6"
            >
              To Date: <span className="text-red-500">*</span>
            </label>
            <input
              id="toDate"
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              className="p-2 w-2/3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          {error && (
            <p className="text-red-500 text-center text-sm mb-4">{error}</p>
          )}
          <div className="flex justify-center space-x-8">
            <button
              type="button"
              onClick={resetForm}
              className="px-4 py-2 rounded font-semibold w-32 bg-indigo-500 hover:bg-blue-600 text-white"
            >
              Reset
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`px-4 py-2 rounded font-semibold w-32 bg-indigo-500 hover:bg-blue-600 text-white ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-500 hover:bg-blue-600 text-white"
              }`}
            >
              {loading ? "Loading..." : "Submit"}
            </button>
          </div>
        </form>
      </div>

      {statementData.length > 0 && (
        <div className="max-w-6xl mx-auto bg-white overflow-x-auto rounded-lg shadow-md">
          {/* Filters and Download */}
          <div className="flex flex-wrap items-center justify-between p-4">
            <div className="flex flex-wrap items-center gap-4">
              {/* Agent Name filter */}
              <input
                type="text"
                placeholder="Filter by Agent Name"
                value={filters.dso_name}
                onChange={(e) =>
                  setFilters((prev) => ({
                    ...prev,
                    dso_name: e.target.value,
                  }))
                }
                className="border border-black p-2 rounded-md"
              />
              {/* User Name filter */}
              <input
                type="text"
                placeholder="Filter by User Name"
                value={filters.custName}
                onChange={(e) =>
                  setFilters((prev) => ({
                    ...prev,
                    custName: e.target.value,
                  }))
                }
                className="border border-black p-2 rounded-md"
              />
              <button
                onClick={resetTableFilters}
                className="w-32 px-4 py-2 rounded bg-blue-500 hover:bg-blue-600 text-white font-semibold text-center"
              >
                Reset
              </button>
              <button
                onClick={() => downloadCSV(filteredData)}
                className="w-32 px-4 py-2 rounded bg-green-600 hover:bg-green-700 font-semibold text-white text-center"
              >
                Download
              </button>
            </div>
          </div>

          {/* Table */}
          <table className="min-w-full border border-gray-300 bg-white text-md">
            <thead>
              <tr className="bg-blue-500 text-white">
                <th className="p-3 border">Description</th>
                <th className="p-3 border">Credit Amount</th>
                <th className="p-3 border">Debit Amount</th>
                <th className="p-3 border">GST</th>
                <th className="p-3 border">Date</th>
                <th className="p-3 border">Account No</th>
                <th className="p-3 border">Reference ID</th>
                <th className="p-3 border">Agent Name</th>
                <th className="p-3 border">User Name</th>
                <th className="p-3 border">Collection Mode</th>
                <th className="p-3 border">Transaction Mode</th>
              </tr>
            </thead>
            <tbody>
              {currentRows.map((item, index) => (
                <tr key={index} className="bg-white text-gray-700">
                  <td className="p-3 border">{item.desc || "-"}</td>
                  <td className="p-3 border">{item.credit_amount || "-"}</td>
                  <td className="p-3 border">{item.debit_amount || "-"}</td>
                  <td className="p-3 border">{item.gst || "-"}</td>
                  <td className="p-3 border">
                    {item.date ? new Date(item.date).toLocaleString() : "-"}
                  </td>
                  <td className="p-3 border">{item.account_no || "-"}</td>
                  <td className="p-3 border">{item.ref_id || "-"}</td>
                  {/* Changed to dso_name */}
                  <td className="p-3 border">{item.dso_name || "-"}</td>
                  {/* Changed to custName */}
                  <td className="p-3 border">{item.custName || "-"}</td>
                  <td className="p-3 border">{item.collection_mode || "-"}</td>
                  <td className="p-3 border">{item.transaction_mode || "-"}</td>
                </tr>
              ))}
              {currentRows.length === 0 && (
                <tr>
                  <td
                    colSpan={11}
                    className="text-center p-4 border text-gray-600"
                  >
                    No data available.
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {/* Pagination */}
          <div className="mt-4 flex justify-center items-center gap-3">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-1 rounded bg-indigo-500 hover:bg-indigo-600 text-white disabled:bg-gray-400"
            >
              Previous
            </button>
            <span>
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages || totalPages === 0}
              className="px-3 py-1 rounded bg-indigo-500 hover:bg-indigo-600 text-white disabled:bg-gray-400"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AccountStatement;
