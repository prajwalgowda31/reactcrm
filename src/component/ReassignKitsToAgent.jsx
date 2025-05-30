import React, { useState, useEffect } from "react";
import { getkitallocation, updateKitInventory } from "../api/apiNSDL";
import { agentsData } from "../config/agentConfig";

const ReassignKitsToAgent = () => {
  const [kitData, setKitData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const kitsPerPage = 6;
  const [showModal, setShowModal] = useState(false);
  const [selectedKit, setSelectedKit] = useState(null);
  const [formData, setFormData] = useState({ kitRefId: "", agentId: "" });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getkitallocation();
        setKitData(response?.data || []);
      } catch (err) {
        setError("Failed to fetch kit allocation data.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const totalPages = Math.ceil(kitData.length / kitsPerPage);
  const startIndex = (currentPage - 1) * kitsPerPage;
  const currentKits = kitData.slice(startIndex, startIndex + kitsPerPage);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handleUpdateClick = (kit) => {
    setSelectedKit(kit);
    setFormData({ kitRefId: kit.kit_ref_id, agentId: kit.external_agent_id });
    setShowModal(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Update the table dynamically to reflect the new agent selection
    setKitData((prevData) =>
      prevData.map((kit) =>
        kit.kit_id === selectedKit.kit_id ? { ...kit, external_agent_id: value } : kit
      )
    );
  };

const handleSubmit = async (e) => {
  e.preventDefault();

  if (!selectedKit || !formData.agentId) {
    console.error("Missing required data.");
    return;
  }

  const payload = {
    kit_id: selectedKit.kit_id,
    kit_ref_id: selectedKit.kit_ref_id,
    external_agent_id: formData.agentId,
  };

console.log("payload inside ===>",payload);


  try {
    const response = await updateKitInventory(payload);
    console.log("response insdie component:", response);

    if (!response.status) {
      console.error("API failed:", response.message);
    } else {
      console.log("Update successful:", response);
      setShowModal(false);
    }
  } catch (error) {
    console.error("Update failed:", error);
  }
};


  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div className="p-4">
      <div className="overflow-x-auto bg-white rounded-lg shadow-md">
        <h3 className="text-lg font-bold mb-4 text-center text-black bg-gray-100 py-2 rounded">Re-assign Kits to agent</h3>
        <table className="min-w-full border border-gray-300 bg-white text-md">
          <thead>
            <tr className="bg-blue-500 text-white">
              <th className="p-3 border">Created At</th>
              <th className="p-3 border">Kit ID</th>
              <th className="p-3 border">Kit Ref ID</th>
              <th className="p-3 border">Kit Status</th>
              <th className="p-3 border">Kit Card Number</th>
              <th className="p-3 border">Kit Expiry Date</th>
              <th className="p-3 border">External Agent ID</th>
              <th className="p-3 border">Agent Name</th>
              <th className="p-3 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentKits.length > 0 ? (
              currentKits.map((kit, index) => (
                <tr key={index} className="bg-white text-gray-700">
                  <td className="p-3 border">{kit.created_at || "-"}</td>
                  <td className="p-3 border">{kit.kit_id || "-"}</td>
                  <td className="p-3 border">{kit.kit_ref_id || "-"}</td>
                  <td className="p-3 border">{kit.kit_status || "-"}</td>
                  <td className="p-3 border">{kit.kit_card_no || "-"}</td>
                  <td className="p-3 border">
                    {kit.kit_expiry_date
                      ? new Date(kit.kit_expiry_date).toLocaleDateString()
                      : "-"}
                  </td>
                  <td className="p-3 border">{kit.external_agent_id || "-"}</td>
                  <td className="p-3 border">{kit.dost_name || "-"}</td>
                  <td className="p-3 border">
                    <button
                      onClick={() => handleUpdateClick(kit)}
                      className="px-4 py-2 rounded bg-green-600 hover:bg-green-500 text-white"
                    >
                      Update
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="9" className="text-center py-4 text-gray-500">
                  No data available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-center items-center space-x-2 mt-4 mb-6">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-3 py-1 rounded border bg-white hover:bg-gray-100"
        >
          Prev
        </button>
        <span className="text-sm font-medium">Page {currentPage} of {totalPages}</span>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-3 py-1 rounded border bg-white hover:bg-gray-100"
        >
          Next
        </button>
      </div>

      {/* Update Form Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-semibold mb-4">Re-assign Kit to Agent</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700">Kit Ref ID:</label>
                <input type="text" name="kitRefId" value={formData.kitRefId} className="w-full p-2 border border-gray-300 rounded" disabled />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700">External Agent ID:</label>
                <select name="agentId" value={formData.agentId} onChange={handleInputChange} className="w-full p-2 border border-gray-300 rounded-lg bg-white shadow-sm">
                  <option value="">Select an Agent</option>
                  {agentsData.map((agent) => (
                    <option key={agent.agent_id} value={agent.agent_id}>{agent.agent_name}</option>
                  ))}
                </select>
              </div>

              <div className="flex justify-between">
                <button type="button" onClick={() => setShowModal(false)} className="px-6 py-2 bg-red-500 text-white rounded">Close</button>
                <button type="submit" className="px-4 py-2 bg-indigo-500 text-white rounded">Submit</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReassignKitsToAgent;
