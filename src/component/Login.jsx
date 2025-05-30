import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import loginimage from "../assets/login_bg.jpg";

function Login() {
  const navigate = useNavigate();
  const [mobile, setMobile] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  const handleLogin = async () => {
    setMessage("");
    try {
      const response = await fetch(
        "https://sparkapi-stage.dvaramoney.com/c360/api/v1/CRMUserLogin",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ crm_user_mobile: mobile }),
        }
      );

      const data = await response.json();
      console.log("Status", data);

      if (data.statuscode == 204) {
        console.log("Login successful:", data);
        // localStorage.setItem("crm_user_mobile", data.crm_user_mobile || mobile);
        // localStorage.setItem("crm_user_name", data.crm_user_name || "User");
        // localStorage.setItem("crm_user_id", data.crm_user_id || "");

        localStorage.setItem("crm_user_mobile", mobile);
        navigate("/otp"); // Navigate on success
      } else if (data.statuscode == 203) {
        // Show warning or message, stay on page
        setMessage(data.message || "Partial success or warning.");
        setMessageType("error");
      } else {
        console.error("Login failed:", data.message || "Unknown error");
        // alert(data.message || 'Login failed. Please try again.');
        setMessage(data.message || "Login failed. Please try again.");
        setMessageType("error");
      }
    } catch (error) {
      console.error("API error:", error);
      setMessage("Something went wrong. Please try again.");
      setMessageType("error");
    }
  };

  return (
    <div
      className="bg-gray-100 h-screen w-screen flex items-center justify-center"
      style={{ backgroundImage: `url(${loginimage})` }}
    >
      <div class="flex flex-col items-center md:max-w-[423px] w-[380px] bg-white rounded-2xl shadow-lg p-6 sm:p-10">
        <p class="text-2xl font-semibold text-gray-900 mb-8">Enter Mobile No</p>
        {/* Message Box */}
        {message && (
          <div
            className={`w-full mb-4 text-center px-4 py-2 rounded-md text-sm ${
              messageType === "error"
                ? "bg-red-100 text-red-700"
                : "bg-green-100 text-green-700"
            }`}
          >
            {message}
          </div>
        )}
        <input
          class="w-full h-10 bg-indigo-100 text-black text-xl rounded-md outline-none text-center"
          type="text"
          value={mobile}
          onChange={(e) => setMobile(e.target.value)}
          placeholder="Enter Mobile Number"
          required
        ></input>
        <button
          onClick={handleLogin}
          type="button"
          class="mt-8 w-full max-w-80 h-11 rounded-full text-white text-sm bg-indigo-500 hover:opacity-90 transition-opacity"
        >
          Get Otp
        </button>
      </div>
    </div>
  );
}

export default Login;
