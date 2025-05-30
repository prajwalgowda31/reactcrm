import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { getNsdlKits, addNsdlKits } from "../api/apiNSDL";

const NSDLInstakitsForm = () => {
  const [kitId, setKitId] = useState("");
  const [remarks, setRemarks] = useState("");
  const [stockInHand, setStockInHand] = useState(0);
  const [receivedFromNsdl, setReceivedFromNsdl] = useState("");
  const [transactionId, setTransactionId] = useState("");
  const [amount, setAmount] = useState("");
  const [paymentMode, setPaymentMode] = useState("");
  const [paymentDate, setPaymentDate] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchKits = async () => {
      try {
        const response = await getNsdlKits();
        if (response?.data?.length) {
          setStockInHand(response.data[0].kits_available);
        }
      } catch (error) {
        toast.error("Failed to fetch kit stock-in-hand.");
        console.error(error);
      }
    };

    fetchKits();
  }, []);

  const validate = () => {
    let tempErrors = {};
    if (!kitId.trim()) tempErrors.kitId = "Kit ID is required.";
    if (!paymentDate) tempErrors.paymentDate = "Payment Date is required.";
    if (!paymentMode) tempErrors.paymentMode = "Payment Mode is required.";
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    setLoading(true);

    const payload = {
      kit_id: kitId,
      remarks,
      stock_in_hand: stockInHand,
      received_from_nsdl: receivedFromNsdl,
      transaction_id: transactionId,
      amount,
      payment_mode: paymentMode,
      payment_date: paymentDate,
    };

    try {
      const response = await addNsdlKits(payload);

      if (response?.success || response?.status === 200) {
        toast.success(
          `Kit ${kitId} submitted successfully with remarks: ${remarks}`
        );
        setKitId("");
        setRemarks("");
        setReceivedFromNsdl("");
        setTransactionId("");
        setAmount("");
        setPaymentMode("");
        setPaymentDate("");
        setErrors({});
      } else {
        toast.error("Submission failed. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting kit:", error);
      toast.error("An error occurred while submitting the form.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setKitId("");
    setRemarks("");
    setReceivedFromNsdl("");
    setTransactionId("");
    setAmount("");
    setPaymentMode("");
    setPaymentDate("");
    setErrors({});
  };

  return (
    <div className="p-6">
      <h2 className="text-lg font-bold mb-4 text-center text-black bg-gray-100 py-2 rounded">
        NSDL Instakit Form
      </h2>

      <div className="grid grid-cols-4 items-center mb-3 text-black gap-2">
        <label className="text-center font-medium">
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

        <label className="text-center font-medium">
          Instakit Received from NSDL:
        </label>
        <div className="col-span-1">
          <input
            type="number"
            value={receivedFromNsdl}
            onChange={(e) => setReceivedFromNsdl(e.target.value)}
            className="border bg-white px-3 py-2 rounded w-full"
            placeholder="Enter number"
            disabled={loading}
          />
        </div>
      </div>

      <div className="grid grid-cols-4 items-center mb-3 text-black gap-2">
        <label className="text-center font-medium">
          Payment Date: <span className="text-red-500">*</span>
        </label>
        <div className="col-span-1">
          <input
            type="date"
            value={paymentDate}
            onChange={(e) => setPaymentDate(e.target.value)}
            max={new Date().toISOString().split("T")[0]}
            className={`border px-3 py-2 rounded w-full bg-white ${
              errors.paymentDate ? "border-red-500" : ""
            }`}
            disabled={loading}
          />
          {errors.paymentDate && (
            <p className="text-red-500 text-xs">{errors.paymentDate}</p>
          )}
        </div>

        <label className="text-center font-medium">
          Transaction ID: <span className="text-red-500">*</span>
        </label>
        <div className="col-span-1">
          <input
            type="text"
            value={kitId}
            onChange={(e) => setKitId(e.target.value)}
            className={`border px-3 py-2 rounded w-full bg-white ${
              errors.kitId ? "border-red-500" : ""
            }`}
            placeholder="Enter transaction ID"
            disabled={loading}
          />
          {errors.kitId && (
            <p className="text-red-500 text-xs">{errors.kitId}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-4 items-center mb-3 text-black gap-2">
        <label className="text-center font-medium">Amount:</label>
        <div className="col-span-1">
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value.replace(/\D/g, ""))}
            className="border bg-white px-3 py-2 rounded w-full"
            placeholder="Enter amount"
            disabled={loading}
          />
        </div>

        <label className="text-center font-medium">
          Payment Mode: <span className="text-red-500">*</span>
        </label>
        <div className="col-span-1">
          <select
            value={paymentMode}
            onChange={(e) => setPaymentMode(e.target.value)}
            className={`border px-3 py-2 rounded w-full bg-white ${
              errors.paymentMode ? "border-red-500" : ""
            }`}
            disabled={loading}
          >
            <option value="">Select Payment Mode</option>
            <option value="Cheque">Cheque</option>
            <option value="NEFT">NEFT</option>
            <option value="RTGS">RTGS</option>
            <option value="UPI">UPI</option>
          </select>
          {errors.paymentMode && (
            <p className="text-red-500 text-xs">{errors.paymentMode}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-4 items-center mb-3 text-black gap-2">
        <label className="text-center font-medium">Remarks:</label>
        <div className="col-span-1">
          <input
            type="text"
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
            className="border bg-white px-3 py-2 rounded w-full"
            placeholder="Enter remarks"
            disabled={loading}
          />
        </div>

        {/* Empty label and div to keep layout consistent */}
        <label className="col-span-1"></label>
        <div className="col-span-1"></div>
      </div>

      <div className="flex justify-center gap-10 mt-6">
        <button
          onClick={handleReset}
          className="bg-indigo-400 text-white px-6 py-2 rounded font-semibold"
          disabled={loading}
        >
          Reset
        </button>
        <button
          onClick={handleSubmit}
          className="bg-indigo-400 text-white px-6 py-2 rounded font-semibold flex items-center justify-center"
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
    </div>
  );
};

export default NSDLInstakitsForm;
