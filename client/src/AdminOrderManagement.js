// CHALDAL/client/src/AdminOrderManagement.js
import React, { useState, useEffect } from 'react';
import { Package, User, Calendar, DollarSign, List, RefreshCcw, CheckCircle, XCircle, Clock } from 'lucide-react'; // Icons for UI

const AdminOrderManagement = ({ customerId, username, isAdmin, onBackToHome }) => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [statusUpdating, setStatusUpdating] = useState({}); // State to track which order is being updated
    const [selectedStatus, setSelectedStatus] = useState({}); // State to hold the new status for each order

    // Available order statuses
    const orderStatuses = ['Pending', 'Processing', 'Delivery', 'Delivered', 'Cancelled'];

    // Function to fetch all orders
    const fetchOrders = async () => {
        setLoading(true);
        setError(null);
        try {
            // Placeholder API endpoint to fetch all orders for admin
            const response = await fetch('http://localhost:5000/api/admin/orders'); // Adjust this endpoint as per your backend
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            setOrders(data);
            // Initialize selectedStatus for each order with its current status
            const initialStatus = {};
            data.forEach(order => {
                initialStatus[order.order_id] = order.status;
            });
            setSelectedStatus(initialStatus);
        } catch (err) {
            console.error("Error fetching orders:", err);
            setError("Failed to fetch orders. Please ensure the backend is running and accessible.");
        } finally {
            setLoading(false);
        }
    };

    // Function to update order status
    const handleUpdateStatus = async (orderId) => {
        const newStatus = selectedStatus[orderId];
        if (!newStatus) {
            alert('Please select a new status.');
            return;
        }

        setStatusUpdating(prev => ({ ...prev, [orderId]: true }));
        try {
            // Placeholder API endpoint to update order status
            const response = await fetch(`http://localhost:5000/api/admin/orders/${orderId}/status`, { // Adjust this endpoint
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    // If you have authentication for admin, add it here (e.g., 'Authorization': `Bearer ${token}`)
                },
                body: JSON.stringify({ status: newStatus, updatedBy: username }), // Pass admin user info
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
            }

            // Update the local state for the specific order
            setOrders(prevOrders =>
                prevOrders.map(order =>
                    order.order_id === orderId ? { ...order, status: newStatus } : order
                )
            );
            alert(`Order ${orderId} status updated to ${newStatus}`);
        } catch (err) {
            console.error("Error updating order status:", err);
            setError(`Failed to update status for Order ${orderId}: ${err.message}`);
        } finally {
            setStatusUpdating(prev => ({ ...prev, [orderId]: false }));
        }
    };

    // Fetch orders on component mount
    useEffect(() => {
        if (isAdmin) { // Only fetch if the user is an admin
            fetchOrders();
        } else {
            setError("You do not have administrative privileges to view this page.");
            setLoading(false);
        }
    }, [isAdmin]);

    if (!isAdmin) {
        return (
            <div className="pt-28 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto text-gray-800 text-center py-10">
                <h1 className="text-3xl font-bold text-red-600 mb-4">Access Denied</h1>
                <p className="text-lg text-gray-700">You must be logged in as an administrator to view this page.</p>
                <button
                    onClick={onBackToHome}
                    className="mt-6 px-6 py-2 rounded-full bg-blue-600 text-white font-semibold shadow-lg hover:bg-blue-700 transition-all duration-300"
                >
                    Back to Home
                </button>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="pt-28 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto text-gray-800 text-center py-10">
                <h1 className="text-3xl font-bold text-gray-800 mb-4">Loading Orders...</h1>
                <RefreshCcw className="w-10 h-10 animate-spin text-blue-500 mx-auto" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="pt-28 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto text-gray-800 text-center py-10">
                <h1 className="text-3xl font-bold text-red-600 mb-4">Error</h1>
                <p className="text-lg text-gray-700">{error}</p>
                <button
                    onClick={fetchOrders}
                    className="mt-6 px-6 py-2 rounded-full bg-blue-600 text-white font-semibold shadow-lg hover:bg-blue-700 transition-all duration-300"
                >
                    Try Again
                </button>
                <button
                    onClick={onBackToHome}
                    className="mt-4 ml-4 px-6 py-2 rounded-full bg-gray-300 text-gray-800 font-semibold shadow-lg hover:bg-gray-400 transition-all duration-300"
                >
                    Back to Home
                </button>
            </div>
        );
    }

    return (
        <div className="pt-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-gray-800">
            <h1 className="text-3xl font-bold text-gray-800 mb-6 flex items-center">
                <Package className="w-8 h-8 mr-3" /> Order Management
            </h1>

            <button
                onClick={onBackToHome}
                className="mb-6 px-4 py-2 rounded-full bg-gray-200 text-gray-700 font-semibold shadow-md hover:bg-gray-300 transition-all duration-300 flex items-center"
            >
                <ChevronLeft className="w-5 h-5 mr-1" /> Back to Home
            </button>

            {orders.length === 0 ? (
                <div className="bg-white p-8 rounded-xl shadow-lg text-center">
                    <p className="text-xl text-gray-600">No orders found.</p>
                </div>
            ) : (
                <div className="bg-white p-8 rounded-xl shadow-lg overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Order ID
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Customer
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Order Date
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Total Amount
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Current Status
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Update Status
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {orders.map((order) => (
                                <tr key={order.order_id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                        #{order.order_id}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                        <div className="flex items-center">
                                            <User className="w-4 h-4 mr-1 text-blue-500" /> {order.customer_name || 'N/A'}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                        <div className="flex items-center">
                                            <Calendar className="w-4 h-4 mr-1 text-green-500" /> {new Date(order.order_date).toLocaleDateString()}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                        <div className="flex items-center">
                                            <DollarSign className="w-4 h-4 mr-1 text-indigo-500" /> ৳{order.total_amount.toFixed(2)}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${order.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                                                order.status === 'Cancelled' ? 'bg-red-100 text-red-800' :
                                                    order.status === 'Processing' ? 'bg-yellow-100 text-yellow-800' :
                                                        'bg-blue-100 text-blue-800'
                                            }`}>
                                            {order.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                        <select
                                            value={selectedStatus[order.order_id] || order.status}
                                            onChange={(e) => setSelectedStatus(prev => ({ ...prev, [order.order_id]: e.target.value }))}
                                            className="block w-full px-3 py-1 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                            disabled={statusUpdating[order.order_id]}
                                        >
                                            {orderStatuses.map(status => (
                                                <option key={status} value={status}>
                                                    {status}
                                                </option>
                                            ))}
                                        </select>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <button
                                            onClick={() => handleUpdateStatus(order.order_id)}
                                            className="px-4 py-2 rounded-full bg-indigo-600 text-white text-xs font-semibold shadow-lg hover:bg-indigo-700 transition-all duration-300 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                                            disabled={statusUpdating[order.order_id]}
                                        >
                                            {statusUpdating[order.order_id] ? (
                                                <RefreshCcw className="w-4 h-4 animate-spin mr-1" />
                                            ) : (
                                                <CheckCircle className="w-4 h-4 mr-1" />
                                            )}
                                            {statusUpdating[order.order_id] ? 'Updating...' : 'Update'}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default AdminOrderManagement;