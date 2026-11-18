
import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

import {
    Package,
    ShoppingBag,
    CalendarDays,
    CreditCard,
    MapPin,
    ArrowRight
} from "lucide-react";

import "../App.css";

function MyOrders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // FETCH CUSTOMER ORDERS
    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const token = localStorage.getItem("token");

                if (!token) {
                    setError("Please login to view your orders.");
                    return;
                }

                const response = await axios.get(
                    "http://localhost:8000/api/orders/my-orders",
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );

                setOrders(
                    Array.isArray(response.data)
                        ? response.data
                        : response.data.orders || []
                );

            } catch (err) {
                setError(
                    err.response?.data?.message ||
                    "Unable to load orders"
                );
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    // LOADING
    if (loading) {
        return (
            <div className="orders-page orders-loading">
                Loading your orders...
            </div>
        );
    }

    // ERROR
    if (error) {
        return (
            <div className="orders-page orders-loading">
                <h2>{error}</h2>

                <Link to="/login" className="orders-shop-btn">
                    Login
                </Link>
            </div>
        );
    }

    return (
        <div className="orders-page">

            {/* PAGE HEADER */}
            <div className="orders-heading">
                <h1>My Orders</h1>
                <p>Track and manage your ShopEase purchases.</p>
            </div>

            {/* ORDER OVERVIEW */}
            <div className="orders-overview">

                <div>
                    <ShoppingBag size={25} />
                    <span>Total Orders</span>
                    <strong>{orders.length}</strong>
                </div>

                <div>
                    <Package size={25} />
                    <span>Delivered Orders</span>
                    <strong>
                        {orders.filter(
                            order =>
                                order.status?.toLowerCase() === "delivered"
                        ).length}
                    </strong>
                </div>

            </div>

            {/* EMPTY ORDERS */}
            {orders.length === 0 ? (

                <div className="orders-empty">
                    <ShoppingBag size={60} />

                    <h2>No Orders Yet</h2>

                    <p>Your placed orders will appear here.</p>

                    <Link to="/" className="orders-shop-btn">
                        Start Shopping
                        <ArrowRight size={18} />
                    </Link>
                </div>

            ) : (

                /* ORDERS LIST */
                <div className="orders-list">

                    {orders.map((order) => {

                        const address = order.shippingAddress || {};

                        return (

                            <div className="order-card" key={order._id}>

                                {/* ORDER HEADER */}
                                <div className="order-card-heading">

                                    <div>
                                        <h3>
                                            Order #{order._id.slice(-8)}
                                        </h3>

                                        <p>
                                            <CalendarDays size={15} />

                                            {new Date(
                                                order.createdAt
                                            ).toLocaleDateString("en-IN", {
                                                day: "numeric",
                                                month: "short",
                                                year: "numeric"
                                            })}
                                        </p>
                                    </div>

                                    <span
                                        className={`order-status ${(order.status || "pending").toLowerCase()}`}
                                    >
                                        {order.status || "Pending"}
                                    </span>

                                </div>

                                {/* ORDER PRODUCTS */}
                                <div className="order-products-list">

                                    {(order.items || []).map((item, index) => (

                                        <div
                                            className="order-product"
                                            key={item._id || index}
                                        >

                                            <div className="order-product-info">

                                                {item.image && (
                                                    <img
                                                        src={item.image}
                                                        alt={item.name}
                                                    />
                                                )}

                                                <div>
                                                    <strong>{item.name}</strong>

                                                    <span>
                                                        Quantity: {item.quantity}
                                                    </span>
                                                </div>

                                            </div>

                                            <strong>
                                                ₹{(
                                                    item.price * item.quantity
                                                ).toLocaleString("en-IN")}
                                            </strong>

                                        </div>

                                    ))}

                                </div>

                                {/* DELIVERY ADDRESS */}
                                {address.fullName && (

                                    <div className="order-delivery-address">

                                        <h4>
                                            <MapPin size={17} />
                                            Delivery Address
                                        </h4>

                                        <p>{address.fullName}</p>
                                        <p>{address.phone}</p>

                                        <p>
                                            {address.address}, {address.city},{" "}
                                            {address.state} - {address.pincode}
                                        </p>

                                    </div>

                                )}

                                {/* ORDER FOOTER */}
                                <div className="order-card-footer">

                                    <span>
                                        <CreditCard size={16} />
                                        {order.paymentMethod || "COD"}
                                    </span>

                                    <strong>
                                        Total: ₹{Number(
                                            order.totalAmount || 0
                                        ).toLocaleString("en-IN")}
                                    </strong>

                                </div>

                            </div>

                        );
                    })}

                </div>

            )}

        </div>
    );
}

export default MyOrders;
