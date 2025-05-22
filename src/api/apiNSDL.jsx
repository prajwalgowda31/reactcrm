// src/api/nsdlApi.js

export const addNsdlFloat = async (payload) => {
    try {
        const response = await fetch('https://sparkapi-stage.dvaramoney.com/nsdl/api/v1/addNsdlFloat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'source': 'QnlQYXNzSW50ZXJuYWxSZXE=',
            },
            body: JSON.stringify(payload),
        });

        return await response.json();
    } catch (error) {
        console.error('API Error:', error);
        throw new Error('Network error');
    }
};


export const getkitallocation = async (payload) => {
    try {
        const response = await fetch('https://sparkc360api.dvaramoney.com/c360/api/v1/getkitallocation', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'source': 'QnlQYXNzSW50ZXJuYWxSZXE=',
            },
            body: JSON.stringify(payload),
        });

        return await response.json();
    } catch (error) {
        console.error('API Error:', error);
        throw new Error('Network error');
    }
};

export const getAgentInstaKitDetails = async (dostId) => {
    try {
        const response = await fetch(`https://sparkapi-stage.dvaramoney.com/nsdl/api/v1/getAgentInstaKitDetails?dost_id=${dostId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'source': 'QnlQYXNzSW50ZXJuYWxSZXE=',
            },
        });

        return await response.json();
    } catch (error) {
        console.error('API Error:', error);
        throw new Error('Network error');
    }
};


export const getAgentAllocationSummary = async (agentId) => {
  try {
    const apiUrl = `https://sparkapi.dvaramoney.com/nsdl/api/v1/getAgentInstaKitDetails?dost_id=${agentId}&t=${Date.now()}`;
    const response = await fetch(apiUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "source": "QnlQYXNzSW50ZXJuYWxSZXE=",
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

