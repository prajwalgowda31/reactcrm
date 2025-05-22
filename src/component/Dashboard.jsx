import React, { useState } from 'react';
import Dvaralogo from '../assets/dvaralogo.png';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


import NSDLSubTabs from '../component/Nsdlsubtab';
import MoneyAddedEMDFloat from '../component/MoneyAddedEMDFloat';
import NSDLInstakitsForm from './NSDLInstakitsForm'


import { addNsdlFloat } from '../api/apiNSDL';
import AllocationTable from './AllocationTable';
import AllocationSummary from './AllocationSummary';


// ----------------- Main Dashboard -----------------
const Dashboard = () => {
    const crm_user_mobile = localStorage.getItem('crm_user_mobile');
    const [activeTab, setActiveTab] = useState('nsdl');
    const [activeNsdlSubTab, setActiveNsdlSubTab] = useState('moneyAdded');

    const [amount, setAmount] = useState('');
    const [refNo, setRefNo] = useState('');
    const [instrumentType, setInstrumentType] = useState('');
    const [comments, setComments] = useState('');
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const handleReset = () => {
        if (loading) return;
        setAmount('');
        setRefNo('');
        setInstrumentType('');
        setComments('');
        setErrors({});
    };

    const handleSubmit = async () => {
        if (loading) return;

        const newErrors = {};
        if (!amount) newErrors.amount = 'Amount is required';
        if (!refNo.trim()) newErrors.refNo = 'Reference Number is required';
        if (!instrumentType) newErrors.instrumentType = 'Instrument Type is required';
        setErrors(newErrors);

        if (Object.keys(newErrors).length === 0) {
            setLoading(true);
            const payload = {
                transaction_ref_no: refNo.trim(),
                transaction_mode: instrumentType,
                transaction_amount: parseFloat(amount),
                transaction_source: 'crm',
                bank: 'nsdl',
                product: 'topup'
            };

            try {
                const data = await addNsdlFloat(payload);
                if (data.statuscode === 'S001') {
                    toast.success('Money added to EMD float successfully!');
                    handleReset();
                } else {
                    toast.error(`Failed to add money: ${data.message || 'Unknown error'}`);
                }
            } catch (error) {
                toast.error('Failed to submit. Please try again later.');
            }
            finally {
                setLoading(false);
            }
        }
    };

    return (
        <div className="flex h-screen">
            <ToastContainer position="top-center" autoClose={3000} />

            {/* Sidebar */}
            <div className="w-64 bg-white border-r p-4">
                <img src={Dvaralogo} alt="Logo" className="h-10 mb-6" />
                <div className="flex flex-col gap-2">
                    <div
                        onClick={() => setActiveTab('nsdl')}
                        className={`cursor-pointer px-3 py-2 rounded ${activeTab === 'nsdl' ? 'bg-indigo-100 font-semibold border-l-4 border-indigo-600 text-indigo-700' : 'hover:bg-gray-100 text-indigo-600'}`}
                    >
                        📄 NSDL
                    </div>
                    <div
                        onClick={() => setActiveTab('goldLoan')}
                        className={`cursor-pointer px-3 py-2 rounded ${activeTab === 'goldLoan' ? 'bg-indigo-100 font-semibold border-l-4 border-indigo-600 text-indigo-700' : 'hover:bg-gray-100 text-indigo-600'}`}
                    >
                        🪙 Gold Loan
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col">
                {/* Top Bar */}
                <div className="flex justify-end items-center px-6 py-4 border-b bg-white">
                    <div className="text-gray-700 mr-4">Hi! {crm_user_mobile}</div>
                    <button className="bg-indigo-400 text-white px-4 py-2 rounded">Logout</button>
                </div>

                {/* Content Area */}
                <div className="flex-1 overflow-auto">
                    {activeTab === 'nsdl' && (
                        <>
                            <NSDLSubTabs
                                activeNsdlSubTab={activeNsdlSubTab}
                                setActiveNsdlSubTab={setActiveNsdlSubTab}
                            />


                            <div className="p-4">
                                {activeNsdlSubTab === 'moneyAdded' && (
                                    <MoneyAddedEMDFloat
                                        amount={amount}
                                        setAmount={setAmount}
                                        refNo={refNo}
                                        setRefNo={setRefNo}
                                        instrumentType={instrumentType}
                                        setInstrumentType={setInstrumentType}
                                        comments={comments}
                                        setComments={setComments}
                                        errors={errors}
                                        handleSubmit={handleSubmit}
                                        handleReset={handleReset}
                                        loading={loading}
                                    />
                                )}

                                {activeNsdlSubTab === 'instakits' && <NSDLInstakitsForm />}
                                   {/* Adding AllocationTable Component */}
                                {activeNsdlSubTab === "allocation" && <AllocationTable />}
                                {activeNsdlSubTab === "summary" && <AllocationSummary />}
                            </div>
                        </>
                    )}

                    {activeTab === 'goldLoan' && (
                        <div className="p-6">
                            <h2 className="text-xl font-semibold">Gold Loan Leads</h2>
                            <p className="text-gray-500">This section is under construction.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
