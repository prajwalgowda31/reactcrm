import React from 'react';

const GoldLoanSubTabs = ({ activeGoldLoanSubTab, setActiveGoldLoanSubTab }) => {
  const tabs = [
    { id: "interestedLeads", label: "Interested Leads" },
    { id: "leadStatus", label: "Lead Status" },
  ];

  return (
    <div className="flex flex-wrap gap-1 px-1 py-0.5 border-b bg-white">
      {tabs.map(({ id, label }) => (
        <button
          key={id}
          onClick={() => setActiveGoldLoanSubTab(id)}
          className={`inline-block px-4 py-4 text-[13px] font-semibold rounded min-w-max ${
            activeGoldLoanSubTab === id
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

export default GoldLoanSubTabs;
