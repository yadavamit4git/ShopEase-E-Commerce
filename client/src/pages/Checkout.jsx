
import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import {
    ArrowLeft,
    ShoppingBag,
    MapPin,
    Phone,
    User,
    ShieldCheck
} from "lucide-react";
import "../App.css";

function Checkout() {
    const navigate = useNavigate();
    const { cart, totalPrice, clearCart } = useCart();

    const [form, setForm] = useState({
        fullName: "",
        phone: "",
        address: "",
        city: "",
        state: "",
        pincode: ""
    });

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        const token = localStorage.getItem("token");

        if (!token) {
            navigate("/login");
            return;
        }

        if (cart.length === 0) {
            setError("Your cart is empty");
            return;
        }

        try {
            setLoading(true);

            const response = await axios.post(
                "http://localhost:8000/api/orders",
                {
                    items: cart.map((item) => ({
                        productId: item._id,
                        quantity: item.quantity
                    })),
                    shippingAddress: form,
                    paymentMethod: "COD"
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            clearCart();

            navigate("/order-success", {
                state: { order: response.data.order }
            });

        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Unable to place order. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    if (cart.length === 0) {
        return (
            <div className="checkout-page checkout-empty">
                <ShoppingBag size={55} />
                <h2>Your cart is empty</h2>
                <p>Add products before proceeding to checkout.</p>
                <Link to="/" className="checkout-shop-btn">
                    Continue Shopping
                </Link>
            </div>
        );
    }

    return (
        <div className="checkout-page">

            <Link to="/cart" className="back-link">
                <ArrowLeft size={18} />
                Back to Cart
            </Link>

            <div className="checkout-heading">
                <h1>Secure Checkout</h1>
                <p>Complete your details to place your order.</p>
            </div>

            <div className="checkout-layout">

                <form
                    className="checkout-form"
                    onSubmit={handleSubmit}
                >
                    <div className="checkout-section-heading">
                        <MapPin size={22} />
                        <h2>Delivery Information</h2>
                    </div>

                    <label>
                        <User size={15} /> Full Name
                    </label>
                    <input
                        name="fullName"
                        value={form.fullName}
                        onChange={handleChange}
                        placeholder="Enter your full name"
                        required
                    />

                    <label>
                        <Phone size={15} /> Phone Number
                    </label>
                    <input
                        name="phone"
                        type="tel"
                        value={form.phone}
                        onChange={handleChange}
                        placeholder="10-digit phone number"
                        pattern="[0-9]{10}"
                        maxLength="10"
                        required
                    />

                    <label>Full Address</label>
                    <textarea
                        name="address"
                        value={form.address}
                        onChange={handleChange}
                        placeholder="House number, street, area"
                        required
                    />

                    <div className="checkout-row">
                        <div>
                            <label>City</label>
                            <input
                                name="city"
                                value={form.city}
                                onChange={handleChange}
                                placeholder="City"
                                required
                            />
                        </div>

                        <div>
                            <label>State</label>
                            <input
                                name="state"
                                value={form.state}
                                onChange={handleChange}
                                placeholder="State"
                                required
                            />
                        </div>
                    </div>

                    <label>PIN Code</label>
                    <input
                        name="pincode"
                        value={form.pincode}
                        onChange={handleChange}
                        placeholder="6-digit PIN code"
                        pattern="[0-9]{6}"
                        maxLength="6"
                        required
                    />

                    <div className="payment-option">
                        <h3>Payment Method</h3>
                        <div className="cod-payment">
                            <ShoppingBag size={22} />
                            <div>
                                <strong>Cash on Delivery</strong>
                                <p>Pay when your order is delivered.</p>
                            </div>
                            <span>Selected</span>
                        </div>
                    </div>

                    {error && (
                        <p className="checkout-error">{error}</p>
                    )}

                    <button
                        type="submit"
                        className="place-order-btn"
                        disabled={loading}
                    >
                        {loading ? "Placing Order..." : "Place Order"}
                    </button>

                    <p className="checkout-security">
                        <ShieldCheck size={17} />
                        Your order information is securely submitted.
                    </p>
                </form>

                <div className="checkout-summary">
                    <h2>Order Summary</h2>

                    <p className="checkout-items-count">
                        {cart.length} product(s) in your cart
                    </p>

                    {cart.map((item) => (
                        <div className="checkout-product" key={item._id}>
                            <div className="checkout-product-info">
                                <img src={item.image} alt={item.name} />
                                <span>
                                    {item.name}
                                    <small>Qty: {item.quantity}</small>
                                </span>
                            </div>

                            <strong>
                                ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                            </strong>
                        </div>
                    ))}

                    <div className="checkout-total">
                        <span>Total Amount</span>
                        <strong>
                            ₹{totalPrice.toLocaleString("en-IN")}
                        </strong>
                    </div>

                    <p className="cod-note">
                        <ShieldCheck size={17} />
                        Cash on Delivery
                    </p>
                </div>

            </div>
        </div>
    );
}

export default Checkout;
