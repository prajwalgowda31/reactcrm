// import axios from "axios";

export const addNsdlFloat = async (payload) => {
  try {
    const response = await fetch(
      "https://sparkapi-stage.dvaramoney.com/nsdl/api/v1/addNsdlFloat",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          source: "QnlQYXNzSW50ZXJuYWxSZXE=",
        },
        body: JSON.stringify(payload),
      }
    );

    return await response.json();
  } catch (error) {
    console.error("API Error:", error);
    throw new Error("Network error");
  }
};
export const getkitallocation = async (payload) => {
  try {
    const response = await fetch(
      "https://sparkc360api.dvaramoney.com/c360/api/v1/getkitallocation",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          source: "QnlQYXNzSW50ZXJuYWxSZXE=",
        },
        body: JSON.stringify(payload),
      }
    );

    return await response.json();
  } catch (error) {
    console.error("API Error:", error);
    throw new Error("Network error");
  }
};

export const getAgentAllocationSummary = async (agentId) => {
  try {
    const apiUrl = `https://sparkapi.dvaramoney.com/nsdl/api/v1/getAgentInstaKitDetails?dost_id=${agentId}&t=${Date.now()}`;
    const response = await fetch(apiUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        source: "QnlQYXNzSW50ZXJuYWxSZXE=",
        "Cache-Control": "no-cache",
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to fetch data");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Network Error:", error);
    throw new Error("Network error. Please check your connection.");
  }
};

export const getStatementDetails = async (
  fromDate,
  toDate,
  limit = 20,
  offset = 0
) => {
  const query = new URLSearchParams({
    from_date: fromDate,
    to_date: toDate,
    limit: limit.toString(),
    offset: offset.toString(),
  });

  const url = `https://sparkc360api.dvaramoney.com/c360/api/v1/getStatementDetails?${query}`;
  console.log("url ==>", url);

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        source: "QnlQYXNzSW50ZXJuYWxSZXE=",
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.message || "Failed to fetch statement details."
      );
    }

    const data = await response.json();
    console.log("date ---->", data);

    return data;
  } catch (error) {
    console.error("API Error:", error);
    throw new Error("Network error");
  }
};

export const updateKitInventory = async (payload) => {
  console.log("Payload=====>", payload);

  const url = `https://sparkapi-stage.dvaramoney.com/nsdl/api/v1/updateKitInventory`;

  try {
    const response = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        source: "QnlQYXNzSW50ZXJuYWxSZXE=", // Match Postman exactly
      },
      body: JSON.stringify(payload),
    });
    console.log("response =====>", response);

    console.log("Response status:", response.status);
    console.log("Response URL:", response.url);
    console.log("Response Headers:", response.headers);

    if (!response.ok) {
      const errorData = await response.json();
      console.error("API Error Response:", errorData);
      throw new Error(errorData.message || "Failed to update kit inventory.");
    }

    const data = await response.json();
    console.log("API Response:", data);
    return data;
  } catch (error) {
    console.error("API Error:", error);
    throw new Error("Network error or invalid response format.");
  }
};

export const getNsdlKits = async () => {
  const url = "https://sparkapi-stage.dvaramoney.com/c360/api/v1/getNsdlKits";

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        source: "QnlQYXNzSW50ZXJuYWxSZXE=",
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to fetch NSDL Kits.");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("API Error:", error);
    throw new Error("Network error or invalid response format.");
  }
};

export const addNsdlKits = async (payload) => {
  const url = "https://sparkapi-stage.dvaramoney.com/c360/api/v1/addNsdlKits";

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        source: "QnlQYXNzSW50ZXJuYWxSZXE=",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to add NSDL Kits.");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("API Error:", error);
    throw new Error("Network error or invalid response format.");
  }
};

//Gold loan

export const getGoldLoanLeads = async (
  fromDate = "",
  toDate = "",
  limit = 100,
  offset = 0
) => {
  const queryParams = new URLSearchParams({
    from_date: fromDate,
    to_date: toDate,
    limit: limit.toString(),
    offset: offset.toString(),
  });

  [
    "not_interested",
    "re_schedule",
    "allocated",
    "attended",
    "assigned",
    "interested",
  ].forEach((status) => queryParams.append("lead_status", status));

  const url = `https://api-preprod.dvaramoney.com/main/api/v1/listGoldLoanLeads?${queryParams.toString()}`;
  console.log("url ==>", url);

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        source: "QnlQYXNzSW50ZXJuYWxSZXE=",
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to fetch Gold Loan Leads.");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("API Error:", error);
    throw new Error("Network error or invalid response format.");
  }
};
export const fetchGoldLoanLeads = async (leadStatus = "interested") => {
  if (!leadStatus) {
    console.warn("No lead status provided. Using default: 'interested'");
    leadStatus = "interested";
  }

  const url = `https://api-preprod.dvaramoney.com/main/api/v1/listGoldLoanLeads?lead_status=${(leadStatus)}`;
  console.log("Fetching Gold Loan Leads from URL:", url);

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        source: "QnlQYXNzSW50ZXJuYWxSZXE=", 
      },
    });

    const data = await response.json();
    console.log("data ===>",data);
    

    if (!response.ok || !data?.status) {
      console.error("API responded with an error:", data?.message);
      throw new Error(data?.message || "Failed to fetch gold loan leads");
    }

    return data;
  } catch (error) {
    console.error("Error fetching gold loan leads:", error.message);
    throw error;
  }
};
