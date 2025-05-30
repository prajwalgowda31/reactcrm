import React, { useState, useEffect } from 'react';
import { getNsdlKits } from "../api/apiNSDL";
import { toast } from "react-toastify";

const AssignKitsToAgent = () => {
  const [stockInHand, setStockInHand] = useState(0); // newly added: state for kits available
  const [selectedFile, setSelectedFile] = useState(null); // newly added: state for uploaded file

  useEffect(() => {
    const fetchKits = async () => {
      try {
        const response = await getNsdlKits();
        if (response?.data?.length) {
          setStockInHand(response.data[0].kits_available); // newly added
        }
      } catch (error) {
        toast.error("Failed to fetch kit stock-in-hand."); // newly added
        console.error(error);
      }
    };

    fetchKits();
  }, []);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file); // newly added
      console.log("Selected file:", file.name);
    }
  };

  const handleReset = () => {
    setSelectedFile(null); // newly added
    document.getElementById("excel-upload").value = ""; // newly added
  };

  const handleSubmit = () => {
    if (!selectedFile) {
      toast.error("Please upload a file first."); // newly added
      return;
    }

    console.log("Submitting file:", selectedFile.name); // newly added
    // Add file upload or processing logic here
  };

  return (
    <div className="p-6 bg-white rounded shadow">
      <h2 className="text-lg font-bold mb-6 text-center text-black bg-gray-100 py-2 rounded">
        NSDL Instakit Form
      </h2>

      <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
        {/* Instakit stock display */}
        <div className="grid grid-cols-4 items-center text-black gap-2">
          <label className="text-right font-medium col-span-1">
            Instakit Stock-in-hand:
          </label>
          <div className="col-span-1">
            <input
              type="number"
              value={stockInHand}
              disabled
              className="border bg-gray-100 px-3 py-2 rounded w-full cursor-not-allowed"
            />
          </div>
        </div>

        {/* Excel file input */}
        <div className="grid grid-cols-4 items-center text-black gap-2">
          <label className="text-right font-medium col-span-1">
            Upload Excel File:
          </label>
          <div className="col-span-2">
            <input
              type="file"
              accept=".xlsx, .xls" // newly added: restrict to Excel files
              onChange={handleFileUpload} // newly added
              id="excel-upload"
              className="block w-full text-md text-gray-700
                file:mr-4 file:py-2 file:px-4
                file:rounded file:border-0
                file:text-sm file:font-semibold
                file:bg-blue-500 file:text-white
                hover:file:bg-blue-600"
            />
          </div>
        </div>

        {/* Reset and Submit Buttons */}
        <div className="grid grid-cols-4 items-center text-black gap-2">
          <div className="col-start-2 col-span-2 flex gap-4">
            <button
              type="button"
              onClick={handleReset}
              className="bg-indigo-400 hover:bg-blue-600 text-white px-4 py-2 rounded"
            >
              Reset
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              className="bg-green-700 text-white px-4 py-2 rounded hover:bg-green-600 transition"
            >
              Submit
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AssignKitsToAgent;
