
import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "../App.css";

function AdminDashboard() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const statuses = [
        "Placed",
        "Processing",
        "Shipped",
        "Delivered",
        "Cancelled"
    ];

    const fetchOrders = async () => {
        try {
            const token = localStorage.getItem("token");

            const response = await axios.get(
                "http://localhost:8000/api/orders/admin/all",
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setOrders(response.data);

        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Unable to load admin orders"
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const changeStatus = async (orderId, status) => {
        try {
            const token = localStorage.getItem("token");

            await axios.put(
                `http://localhost:8000/api/orders/admin/${orderId}/status`,
                { status },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setOrders((previousOrders) =>
                previousOrders.map((order) =>
                    order._id === orderId
                        ? { ...order, status }
                        : order
                )
            );

        } catch (err) {
            alert(
                err.response?.data?.message ||
                "Status update failed"
            );
        }
    };

    if (loading) {
        return <div className="admin-page">Loading dashboard...</div>;
    }

    return (
        <div className="admin-page">

            <h1>Admin Dashboard</h1>
            <p className="admin-subtitle">
                Manage your store and customer orders
            </p>

            {error && <p className="checkout-error">{error}</p>}

            {/* ADMIN MANAGEMENT LINKS */}
            <div className="admin-management-links">
                <Link to="/admin/products" className="admin-manage-btn">
                    Manage Products
                </Link>
            </div>

            {/* ORDER STATISTICS */}
            <div className="admin-stats">
                <div>
                    <h3>{orders.length}</h3>
                    <p>Total Orders</p>
                </div>

                <div>
                    <h3>
                        {orders.filter(o => o.status === "Placed").length}
                    </h3>
                    <p>New Orders</p>
                </div>

                <div>
                    <h3>
                        {orders.filter(o => o.status === "Delivered").length}
                    </h3>
                    <p>Delivered</p>
                </div>
            </div>

            <h2>All Orders</h2>

            {orders.length === 0 ? (
                <p>No orders found.</p>
            ) : (
                <div className="admin-orders">
                    {orders.map((order) => (
                        <div className="admin-order-card" key={order._id}>

                            <div className="admin-order-top">
                                <div>
                                    <h3>Order #{order._id.slice(-8)}</h3>

                                    <p>
                                        Customer: {order.user?.name || "Unknown"}
                                    </p>

                                    <p>
                                        Email: {order.user?.email || "N/A"}
                                    </p>
                                </div>

                                <strong>
                                    ₹{order.totalAmount.toLocaleString("en-IN")}
                                </strong>
                            </div>

                            <div className="admin-order-items">
                                {order.items.map((item, index) => (
                                    <p key={index}>
                                        {item.name} × {item.quantity}
                                    </p>
                                ))}
                            </div>

                            <div className="admin-order-bottom">
                                <span>
                                    {new Date(order.createdAt).toLocaleDateString("en-IN")}
                                </span>

                                <select
                                    value={order.status}
                                    onChange={(e) =>
                                        changeStatus(order._id, e.target.value)
                                    }
                                >
                                    {statuses.map((status) => (
                                        <option key={status} value={status}>
                                            {status}
                                        </option>
                                    ))}
                                </select>
                            </div>

                        </div>
                    ))}
                </div>
            )}

        </div>
    );
}

export default AdminDashboard;
