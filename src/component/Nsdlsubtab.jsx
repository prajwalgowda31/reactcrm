import React from "react";

const NSDLSubTabs = ({ activeNsdlSubTab, setActiveNsdlSubTab }) => {
  const tabs = [
    { id: "moneyAdded", label: "Money Added" },
    { id: "instakits", label: "NSDL Instakits" },
    { id: "allocation", label: "Allocation Table" },
    { id: "assignKitToAgents", label: "Assign Kits to Agents" },
    { id: "assignPB", label: "Re-Assign PB Instakits" },
    { id: "account", label: "Account Statement" },
    { id: "invoice", label: "Generate Invoice" },
    { id: "summary", label: "Allocation Summary" },
  ];

  return (
    <div className="flex flex-wrap gap-1 px-1 py-0.5 border-b bg-white">
      {tabs.map(({ id, label }) => (
        <button
          key={id}
          onClick={() => setActiveNsdlSubTab(id)}
          className={`inline-block px-4 py-4 text-[13px] font-semibold rounded min-w-max ${
            activeNsdlSubTab === id
              ? "bg-indigo-400 text-white font-semibold"
              : "bg-indigo-400 text-black hover:bg-gray-300"
          }`}
          title={label}
        >
          {label}
        </button>
      ))}
    </div>
  );
};

export default NSDLSubTabs;
