
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import "./OrderTracking.css";

function OrderTracking() {
    const { id } = useParams();

    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const steps = ["Placed", "Processing", "Shipped", "Delivered"];

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const token = localStorage.getItem("token");

                const response = await axios.get(
                    `http://localhost:8000/api/orders/${id}/track`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );

                setOrder(response.data);
            } catch (err) {
                setError(
                    err.response?.data?.message || "Unable to load order"
                );
            } finally {
                setLoading(false);
            }
        };

        fetchOrder();
    }, [id]);

    if (loading) return <div className="tracking-message">Loading order...</div>;
    if (error) return <div className="tracking-message">{error}</div>;
    if (!order) return null;

    const currentStep = steps.indexOf(order.status);

    return (
        <div className="tracking-page">
            <div className="tracking-container">
                <Link to="/my-orders" className="back-link">
                    ← Back to My Orders
                </Link>

                <div className="tracking-header">
                    <h1>Track Your Order</h1>
                    <p>Order ID: {order._id}</p>
                    <span className={`tracking-status ${order.status.toLowerCase()}`}>
                        {order.status}
                    </span>
                </div>

                {order.status === "Cancelled" ? (
                    <div className="cancelled-message">
                        <h2>Order Cancelled</h2>
                        <p>This order has been cancelled.</p>
                    </div>
                ) : (
                    <div className="tracking-timeline">
                        {steps.map((step, index) => (
                            <div
                                key={step}
                                className={`tracking-step ${
                                    index <= currentStep ? "completed" : ""
                                }`}
                            >
                                <div className="step-circle">
                                    {index <= currentStep ? "✓" : index + 1}
                                </div>
                                <div className="step-info">
                                    <h3>{step}</h3>
                                    <p>
                                        {step === "Placed" && "Your order has been placed."}
                                        {step === "Processing" && "Your order is being prepared."}
                                        {step === "Shipped" && "Your order is on the way."}
                                        {step === "Delivered" && "Your order has been delivered."}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                <div className="tracking-details">
                    <h2>Order Details</h2>

                    {order.items.map((item, index) => (
                        <div className="tracking-product" key={index}>
                            <div>
                                <h3>{item.name}</h3>
                                <p>Quantity: {item.quantity}</p>
                            </div>
                            <strong>₹{item.price * item.quantity}</strong>
                        </div>
                    ))}

                    <div className="tracking-total">
                        <span>Total Amount</span>
                        <strong>₹{order.totalAmount}</strong>
                    </div>

                    <div className="tracking-address">
                        <h3>Delivery Address</h3>
                        <p>{order.shippingAddress.fullName}</p>
                        <p>{order.shippingAddress.address}</p>
                        <p>
                            {order.shippingAddress.city},{" "}
                            {order.shippingAddress.state} -{" "}
                            {order.shippingAddress.pincode}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default OrderTracking;
