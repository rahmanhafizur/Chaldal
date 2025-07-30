// client/src/TrackOrderModal.js
import React, { useState, useEffect } from 'react';
import { X as CloseIcon, Package } from 'lucide-react';

const TrackOrderModal = ({ onClose }) => {
    const [orderId, setOrderId] = useState('');
    const [orderStatus, setOrderStatus] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleTrackOrder = async () => {
        if (!orderId) {
            setError('Please enter an Order ID.');
            return;
        }
        setLoading(true);
        setError('');
        setOrderStatus(null); // Clear previous status

        try {
            // Replace with your actual API endpoint to fetch order status
            const response = await fetch(`http://localhost:3001/api/orders/track/${orderId}`);
            if (!response.ok) {
                throw new Error(`Order not found or an error occurred: ${response.statusText}`);
            }
            const data = await response.json();
            setOrderStatus(data); // Assuming data contains order details and status
        } catch (err) {
            setError(err.message || 'Failed to fetch order status. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    // Function to render the status timeline
    const renderStatusTimeline = () => {
        if (!orderStatus || !orderStatus.status) {
            return null;
        }

        const statuses = ['Order Placed', 'Order Confirmed', 'Processing', 'Out for Delivery', 'Delivered'];
        const currentStatusIndex = statuses.indexOf(orderStatus.status);

        return (
            <div className="mt-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Order Progress:</h3>
                <div className="flex justify-between items-center relative mb-4">
                    <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-200 -z-10 transform -translate-y-1/2"></div>
                    {statuses.map((status, index) => (
                        <div key={status} className="flex flex-col items-center flex-1 z-10">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${index <= currentStatusIndex ? 'bg-blue-600' : 'bg-gray-400'}`}>
                                {index + 1}
                            </div>
                            <p className={`text-center mt-2 text-sm ${index <= currentStatusIndex ? 'text-blue-600 font-medium' : 'text-gray-600'}`}>
                                {status}
                            </p>
                        </div>
                    ))}
                </div>
                <p className="text-center text-gray-700 mt-4">
                    Current Status: <span className="font-semibold text-blue-600">{orderStatus.status}</span>
                </p>
                {orderStatus.expectedDelivery && (
                    <p className="text-center text-gray-700 mt-2">
                        Expected Delivery: <span className="font-semibold">{new Date(orderStatus.expectedDelivery).toLocaleDateString()}</span>
                    </p>
                )}
            </div>
        );
    };

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md mx-auto relative">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
                    aria-label="Close"
                >
                    <CloseIcon size={24} />
                </button>
                <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Track Your Order</h2>

                <div className="mb-4">
                    <label htmlFor="orderId" className="block text-sm font-medium text-gray-700 mb-1">
                        Enter Order ID:
                    </label>
                    <input
                        type="text"
                        id="orderId"
                        className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                        value={orderId}
                        onChange={(e) => setOrderId(e.target.value)}
                        placeholder="e.g., ORD12345"
                        required
                    />
                </div>

                {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}

                <button
                    onClick={handleTrackOrder}
                    className="w-full bg-blue-600 text-white px-6 py-3 rounded-md font-semibold shadow-lg hover:bg-blue-700 transition-all duration-300 flex items-center justify-center"
                    disabled={loading}
                >
                    {loading ? (
                        <>
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Tracking...
                        </>
                    ) : (
                        <>
                            <Package className="mr-2" size={20} /> Track Order
                        </>
                    )}
                </button>

                {orderStatus && (
                    <div className="mt-8 p-4 bg-gray-50 rounded-md border border-gray-200">
                        <h3 className="text-xl font-bold text-gray-800 mb-3">Order Details:</h3>
                        <p className="text-gray-700"><strong>Order ID:</strong> {orderStatus.order_id}</p>
                        <p className="text-gray-700"><strong>Customer:</strong> {orderStatus.customerName}</p>
                        <p className="text-gray-700"><strong>Total Amount:</strong> ${orderStatus.totalAmount ? orderStatus.totalAmount.toFixed(2) : 'N/A'}</p>
                        {/* Render the timeline based on the screenshot */}
                        {renderStatusTimeline()}
                    </div>
                )}
            </div>
        </div>
    );
};

export default TrackOrderModal;