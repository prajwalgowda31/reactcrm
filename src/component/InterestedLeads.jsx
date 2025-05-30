import React, { useState, useEffect, useMemo } from "react";
import { fetchGoldLoanLeads } from "../api/apiNSDL";

const InterestedLead = () => {
  const [leads, setLeads] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [paymentDate, setPaymentDate] = useState("");
  const [allocationDate, setAllocationDate] = useState("");
  const [comment, setComment] = useState("");
  const [allocateTo, setAllocateTo] = useState("");
  const [stockInHand, setStockInHand] = useState(0);
  const [filters, setFilters] = useState({ name: "", phone: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetchGoldLoanLeads("interested");
      setLeads(response?.data?.leads || []);
    } catch (err) {
      console.error("Error fetching leads:", err);
    }
  };

  const filteredLeads = leads.filter((lead) => {
    return (
      lead.first_name?.toLowerCase().includes(filters.name.toLowerCase()) &&
      lead.mobile?.toLowerCase().includes(filters.phone.toLowerCase())
    );
  });

  const totalPages = Math.ceil(filteredLeads.length / rowsPerPage);

  const paginatedLeads = filteredLeads.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const resetFilters = () => {
    setFilters({ name: "", phone: "" });
    setCurrentPage(1);
  };

  const allKeys = useMemo(() => {
    const keysSet = new Set();
    leads.forEach((lead) => {
      Object.keys(lead).forEach((key) => keysSet.add(key));
    });
    return Array.from(keysSet);
  }, [leads]);

  const renderCell = (value) => {
    if (value === null || value === undefined) return "-";
    if (typeof value === "object") {
      if (value.first_name || value.email) {
        return `${value.first_name || ""} ${value.last_name || ""} ${
          value.email ? `(${value.email})` : ""
        }`.trim();
      }
      return JSON.stringify(value);
    }
    return value.toString();
  };

  const downloadCSV = () => {
    const headers = allKeys;
    const rows = [
      headers.join(","),
      ...filteredLeads.map((lead) =>
        headers
          .map((key) => {
            const val = lead[key];
            if (val === null || val === undefined) return '"-"';
            if (typeof val === "object") return `"${JSON.stringify(val)}"`;
            return `"${val}"`;
          })
          .join(",")
      ),
    ];
    const blob = new Blob([rows.join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "interested_leads.csv";
    a.click();
  };

  const PaginationControls = () => (
    <div className="flex justify-center items-center gap-2 mt-4">
      <button
        className="px-3 py-1 border rounded disabled:opacity-50"
        onClick={() => setCurrentPage(1)}
        disabled={currentPage === 1}
      >
        {"<<"}
      </button>
      <button
        className="px-3 py-1 border rounded disabled:opacity-50"
        onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
        disabled={currentPage === 1}
      >
        {"<"}
      </button>
      <span className="px-3 py-1">
        Page {currentPage} of {totalPages}
      </span>
      <button
        className="px-3 py-1 border rounded disabled:opacity-50"
        onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
        disabled={currentPage === totalPages || totalPages === 0}
      >
        {">"}
      </button>
      <button
        className="px-3 py-1 border rounded disabled:opacity-50"
        onClick={() => setCurrentPage(totalPages)}
        disabled={currentPage === totalPages || totalPages === 0}
      >
        {">>"}
      </button>
    </div>
  );

  return (
    <div className="p-4">
      {/* Date Range Inputs */}
      <div className="grid grid-cols-4 items-center mb-3 text-black gap-2">
        <label className="text-center font-medium">
          Start Date: <span className="text-red-500">*</span>
        </label>
        <div className="col-span-1">
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="border bg-white px-3 py-2 rounded w-full"
            required
          />
        </div>
        <label className="text-center font-medium">
          End Date: <span className="text-red-500">*</span>
        </label>
        <div className="col-span-1">
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="border bg-white px-3 py-2 rounded w-full"
            required
          />
        </div>
      </div>

      {/* Allocate To and Comment Inputs */}
      <div className="grid grid-cols-4 items-center mb-3 text-black gap-2">
        <label className="text-center font-medium">Allocate to:</label>
        <div className="col-span-1">
          <input
            type="number"
            value={allocateTo}
            onChange={(e) => setAllocateTo(e.target.value.replace(/\D/g, ""))}
            className="border bg-white px-3 py-2 rounded w-full"
            placeholder="Enter value"
            disabled={loading}
          />
        </div>
        <label className="text-center font-medium">Comment:</label>
        <div className="col-span-1">
          <input
            type="number"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="border bg-white px-3 py-2 rounded w-full"
            placeholder="Enter number"
            disabled={loading}
          />
        </div>
      </div>

      {/* Allocation Date Input */}
      <div className="grid grid-cols-4 items-center mb-3 text-black gap-2">
        <label className="text-center font-medium">
          Allocation Date: <span className="text-red-500">*</span>
        </label>
        <div className="col-span-1">
          <input
            type="date"
            value={allocationDate}
            onChange={(e) => setAllocationDate(e.target.value)}
            max={new Date().toISOString().split("T")[0]}
            className={`border px-3 py-2 rounded w-full bg-white ${
              errors.allocationDate ? "border-red-500" : ""
            }`}
            disabled={loading}
          />
          {errors.allocationDate && (
            <p className="text-red-500 text-xs">{errors.allocationDate}</p>
          )}
        </div>
      </div>

      {/* Submit and Reset Buttons */}
      <div className="flex justify-center gap-10 mt-6">
        <button
          onClick={() => {
            setStartDate("");
            setEndDate("");
            setAllocateTo("");
            setComment("");
            setAllocationDate("");
            setErrors({});
          }}
          className="bg-indigo-500 hover:bg-blue-600 text-white px-6 py-2 rounded font-semibold"
          disabled={loading}
        >
          Reset
        </button>

        <button
          onClick={() => {
            // Example logic
            console.log("Submit clicked", {
              startDate,
              endDate,
              allocateTo,
              comment,
              allocationDate,
            });
            // Call your actual submit handler here
            handleSubmit();
          }}
          className="bg-indigo-500 hover:bg-blue-600 text-white px-6 py-2 rounded font-semibold flex items-center justify-center"
          disabled={loading}
        >
          {loading ? (
            <>
              <svg
                className="animate-spin h-5 w-5 mr-2 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                ></path>
              </svg>
              Submitting...
            </>
          ) : (
            "Submit"
          )}
        </button>
      </div>

      {/* Filter and Actions */}
      <div className="flex flex-wrap items-center gap-4 mb-4">
        <input
          type="text"
          placeholder="Filter by mobile no"
          value={filters.phone}
          onChange={(e) =>
            setFilters((prev) => ({ ...prev, phone: e.target.value }))
          }
          className="border border-black p-2 rounded-md"
        />
        <button
          onClick={resetFilters}
          className="px-4 py-2 rounded bg-blue-500 hover:bg-blue-600 text-white font-semibold"
        >
          Reset Filters
        </button>
        <button
          onClick={downloadCSV}
          className="px-4 py-2 rounded bg-green-600 hover:bg-green-700 text-white font-semibold"
        >
          Download
        </button>
      </div>

      {/* Table */}
      <div
        className="overflow-x-auto border border-gray-300 rounded-md shadow-md"
        style={{ maxWidth: "90vw" }}
      >
        <table className="min-w-full table-fixed border-collapse">
          <thead className="bg-blue-600 text-white">
            <tr>
              {allKeys.map((key) => (
                <th
                  key={key}
                  className="p-3 border border-blue-700 uppercase text-xs tracking-wider text-left"
                  style={{ width: "140px", maxWidth: "140px" }}
                  title={key}
                >
                  {key.replace(/_/g, " ")}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white text-gray-700">
            {paginatedLeads.length > 0 ? (
              paginatedLeads.map((lead, index) => (
                <tr
                  key={index}
                  className={`hover:bg-blue-50 ${
                    index % 2 === 0 ? "bg-gray-50" : "bg-white"
                  }`}
                >
                  {allKeys.map((key) => (
                    <td
                      key={key}
                      className="p-2 border border-blue-100 text-sm max-w-[140px] truncate"
                      title={
                        typeof lead[key] === "object"
                          ? JSON.stringify(lead[key])
                          : lead[key]
                      }
                    >
                      {renderCell(lead[key])}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={allKeys.length}
                  className="text-center text-gray-500 p-4"
                >
                  No records found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <PaginationControls />
    </div>
  );
};

export default InterestedLead;
