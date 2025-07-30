// client/src/UpdateOrderStatusModal.js
import React, { useState, useEffect } from 'react';
import { X as CloseIcon, RefreshCcw, Save } from 'lucide-react';

const UpdateOrderStatusModal = ({ onClose }) => {
    const [orderId, setOrderId] = useState('');
    const [order, setOrder] = useState(null); // Stores the full order details
    const [newStatus, setNewStatus] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [message, setMessage] = useState(''); // For success messages

    // Define possible order statuses
    const possibleStatuses = [
        'Order Placed',
        'Order Confirmed',
        'Processing',
        'Out for Delivery',
        'Delivered',
        'Cancelled'
    ];

    const fetchOrderDetails = async () => {
        if (!orderId) {
            setError('Please enter an Order ID to fetch details.');
            setOrder(null);
            return;
        }
        setLoading(true);
        setError('');
        setMessage('');
        setOrder(null); // Clear previous order details

        try {
            // Replace with your actual API endpoint to fetch full order details
            const response = await fetch(`http://localhost:3001/api/admin/orders/${orderId}`);
            if (!response.ok) {
                throw new Error(`Order not found or an error occurred: ${response.statusText}`);
            }
            const data = await response.json();
            setOrder(data);
            setNewStatus(data.status); // Set current status as default for update
        } catch (err) {
            setError(err.message || 'Failed to fetch order details. Please check the Order ID.');
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateStatus = async () => {
        if (!order || !newStatus) {
            setError('Please fetch an order and select a new status.');
            return;
        }
        setLoading(true);
        setError('');
        setMessage('');

        try {
            // Replace with your actual API endpoint to update order status
            const response = await fetch(`http://localhost:3001/api/admin/orders/${order.order_id}/status`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    // Add authorization token if your admin API requires it
                    // 'Authorization': `Bearer ${adminAuthToken}`
                },
                body: JSON.stringify({ status: newStatus }),
            });

            if (!response.ok) {
                throw new Error(`Failed to update status: ${response.statusText}`);
            }

            const data = await response.json();
            setOrder(data); // Update local state with the new status
            setMessage('Order status updated successfully!');
        } catch (err) {
            setError(err.message || 'Failed to update order status.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-lg mx-auto relative">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
                    aria-label="Close"
                >
                    <CloseIcon size={24} />
                </button>
                <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Update Order Status</h2>

                <div className="mb-4 flex items-end space-x-2">
                    <div className="flex-grow">
                        <label htmlFor="adminOrderId" className="block text-sm font-medium text-gray-700 mb-1">
                            Order ID:
                        </label>
                        <input
                            type="text"
                            id="adminOrderId"
                            className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                            value={orderId}
                            onChange={(e) => setOrderId(e.target.value)}
                            placeholder="Enter Order ID"
                            required
                        />
                    </div>
                    <button
                        onClick={fetchOrderDetails}
                        className="px-6 py-3 bg-gray-200 text-gray-800 rounded-md font-semibold hover:bg-gray-300 transition-all duration-300 flex items-center"
                        disabled={loading}
                    >
                        <SearchIcon className="mr-2" size={20} /> Fetch Order
                    </button>
                </div>

                {loading && <p className="text-blue-600 text-center mb-4">Fetching order details...</p>}
                {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}
                {message && <p className="text-green-600 text-sm mb-4 text-center">{message}</p>}

                {order && (
                    <div className="bg-gray-50 p-6 rounded-md border border-gray-200 mt-6">
                        <h3 className="text-xl font-bold text-gray-800 mb-4">Order Details for #{order.order_id}</h3>
                        <p className="text-gray-700 mb-2"><strong>Customer Name:</strong> {order.customerName}</p>
                        <p className="text-gray-700 mb-2"><strong>Current Status:</strong> <span className="font-semibold text-blue-600">{order.status}</span></p>
                        <p className="text-gray-700 mb-4"><strong>Total Amount:</strong> ${order.totalAmount ? order.totalAmount.toFixed(2) : 'N/A'}</p>

                        <div className="mb-4">
                            <label htmlFor="newStatus" className="block text-sm font-medium text-gray-700 mb-1">
                                Update Status To:
                            </label>
                            <select
                                id="newStatus"
                                className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                                value={newStatus}
                                onChange={(e) => setNewStatus(e.target.value)}
                            >
                                {possibleStatuses.map((status) => (
                                    <option key={status} value={status}>
                                        {status}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <button
                            onClick={handleUpdateStatus}
                            className="w-full bg-blue-600 text-white px-6 py-3 rounded-md font-semibold shadow-lg hover:bg-blue-700 transition-all duration-300 flex items-center justify-center"
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Updating...
                                </>
                            ) : (
                                <>
                                    <Save className="mr-2" size={20} /> Update Status
                                </>
                            )}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default UpdateOrderStatusModal;