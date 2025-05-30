import React, { useState } from "react";
import { getAgentAllocationSummary } from "../api/apiNSDL";

const AllocationSummary = () => {
  const [agentId, setAgentId] = useState("");
  const [kitDetails, setKitDetails] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchKitDetails = async (e) => {
    e.preventDefault();

    if (loading) return;

    setError("");

    if (!agentId.trim()) {
      setError("Agent ID is required.");
      return;
    }

    setLoading(true);

    try {
      const response = await getAgentAllocationSummary(agentId);

      if (
        response?.status &&
        response.data &&
        Object.keys(response.data).length > 0
      ) {
        setKitDetails(response.data);
        setError("");
      } else {
        setError(response?.message || "Error fetching kit details");
        setKitDetails(null);
      }
    } catch (err) {
      setError("Network error. Please try again.");
      setKitDetails(null);
      console.error("API Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setAgentId("");
    setKitDetails(null);
    setError("");
    setLoading(false);
  };

  return (
    <div className="p-4">
      {/* Form container - narrow and centered */}
      <div className="max-w-lg mx-auto bg-gray-100 p-5 rounded-lg mb-6 border border-black">
        <h2 className="text-2xl font-semibold mb-3 text-center">
          Allocation Summary
        </h2>
        <hr className="border-t border-gray-500 mb-6" />
        <form onSubmit={fetchKitDetails}>
          <div className="mb-4 flex items-center">
            <label
              htmlFor="agentId"
              className="font-medium text-gray-700 w-1/3 text-right mr-6"
            >
              Agent ID: <span className="text-red-500">*</span>
            </label>
            <input
              id="agentId"
              type="text"
              placeholder="Enter Agent ID"
              value={agentId}
              onChange={(e) => setAgentId(e.target.value)}
              className="p-2 w-2/3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              autoFocus
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
              className={`px-4 py-2 rounded bg-indigo-500 font-semibold w-32 ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-500 hover:bg-blue-600 text-white"
              }`}
            >
              Submit
            </button>
          </div>
        </form>
      </div>

      {/* Table container - wider and centered */}
      {kitDetails && (
        <div className="max-w-4xl mx-auto bg-white overflow-x-auto rounded-lg shadow-md">
          <table className="min-w-full border border-gray-300 bg-white text-md">
            <thead>
              <tr className="bg-blue-500 text-white">
                <th className="p-3 border border-gray-300">Agent Name</th>
                <th className="p-3 border border-gray-300">Cards Allocated</th>
                <th className="p-3 border border-gray-300">Issued Cards</th>
                <th className="p-3 border border-gray-300">Card Balance</th>
              </tr>
            </thead>
            <tbody>
              <tr className="bg-white text-gray-700">
                <td className="p-3 border border-gray-300">
                  {kitDetails.agent_name}
                </td>
                <td className="p-3 border border-gray-300">
                  {kitDetails.cards_allocated}
                </td>
                <td className="p-3 border border-gray-300">
                  {kitDetails.issued_cards}
                </td>
                <td className="p-3 border border-gray-300">
                  {kitDetails.card_balance}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AllocationSummary;
