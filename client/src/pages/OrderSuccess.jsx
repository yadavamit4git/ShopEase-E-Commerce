
import { Link, useLocation, Navigate } from "react-router-dom";
import {
    CheckCircle,
    Package,
    ShoppingBag,
    MapPin,
    CreditCard,
    ArrowRight
} from "lucide-react";
import "../App.css";

function OrderSuccess() {
    const location = useLocation();
    const order = location.state?.order;

    if (!order) {
        return <Navigate to="/" replace />;
    }

    const address = order.shippingAddress || {};

    return (
        <div className="order-success-page">

            <div className="success-card">

                <div className="success-icon">
                    <CheckCircle size={75} />
                </div>

                <h1>Order Placed Successfully!</h1>

                <p className="success-message">
                    Thank you for shopping with ShopEase.
                    Your order has been received.
                </p>

                <div className="success-order-id">
                    <span>Order ID</span>
                    <strong>{order._id}</strong>
                </div>

                <div className="success-details">

                    <div className="success-detail-item">
                        <Package size={22} />
                        <div>
                            <span>Order Status</span>
                            <strong>{order.status || "Pending"}</strong>
                        </div>
                    </div>

                    <div className="success-detail-item">
                        <CreditCard size={22} />
                        <div>
                            <span>Payment Method</span>
                            <strong>Cash on Delivery</strong>
                        </div>
                    </div>

                    <div className="success-detail-item">
                        <ShoppingBag size={22} />
                        <div>
                            <span>Total Amount</span>
                            <strong>
                                ₹{Number(order.totalAmount).toLocaleString("en-IN")}
                            </strong>
                        </div>
                    </div>

                </div>

                {address.fullName && (
                    <div className="success-address">
                        <h3>
                            <MapPin size={19} />
                            Delivery Address
                        </h3>

                        <p>{address.fullName}</p>
                        <p>{address.phone}</p>
                        <p>{address.address}</p>
                        <p>
                            {address.city}, {address.state} - {address.pincode}
                        </p>
                    </div>
                )}

                <div className="success-buttons">

                    <Link to="/my-orders" className="my-orders-btn">
                        View My Orders
                        <ArrowRight size={18} />
                    </Link>

                    <Link to="/" className="success-shop-btn">
                        Continue Shopping
                    </Link>

                </div>

            </div>

        </div>
    );
}

export default OrderSuccess;
