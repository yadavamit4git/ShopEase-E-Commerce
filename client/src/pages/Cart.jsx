
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import {
    Trash2,
    Plus,
    Minus,
    ArrowLeft,
    ShoppingBag,
    ShieldCheck
} from "lucide-react";
import "../App.css";

function Cart() {
    const {
        cart,
        removeFromCart,
        updateQuantity,
        totalPrice
    } = useCart();

    return (
        <div className="cart-page">
            <div className="cart-heading">
                <h1>Shopping Cart</h1>
                <p>Review your items before checkout</p>
            </div>

            {cart.length === 0 ? (
                <div className="empty-cart">
                    <ShoppingBag size={65} />
                    <h2>Your Cart is Empty</h2>
                    <p>Add some products to continue shopping.</p>

                    <Link to="/" className="shop-btn">
                        <ArrowLeft size={18} />
                        Continue Shopping
                    </Link>
                </div>
            ) : (
                <div className="cart-container">
                    <div className="cart-items">
                        <h2>Your Items ({cart.length})</h2>

                        {cart.map((item) => (
                            <div className="cart-item" key={item._id}>
                                <Link to={`/product/${item._id}`}>
                                    <img
                                        src={item.image}
                                        alt={item.name}
                                    />
                                </Link>

                                <div className="cart-item-info">
                                    <h3>{item.name}</h3>

                                    <p className="cart-item-price">
                                        ₹{Number(item.price).toLocaleString("en-IN")}
                                    </p>

                                    <div className="quantity-control">
                                        <button
                                            disabled={item.quantity <= 1}
                                            onClick={() =>
                                                updateQuantity(
                                                    item._id,
                                                    item.quantity - 1
                                                )
                                            }
                                        >
                                            <Minus size={16} />
                                        </button>

                                        <span>{item.quantity}</span>

                                        <button
                                            onClick={() =>
                                                updateQuantity(
                                                    item._id,
                                                    item.quantity + 1
                                                )
                                            }
                                        >
                                            <Plus size={16} />
                                        </button>
                                    </div>
                                </div>

                                <div className="cart-item-actions">
                                    <h3>
                                        ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                                    </h3>

                                    <button
                                        className="remove-btn"
                                        onClick={() =>
                                            removeFromCart(item._id)
                                        }
                                    >
                                        <Trash2 size={18} />
                                        Remove
                                    </button>
                                </div>
                            </div>
                        ))}

                        <Link to="/" className="continue-shopping">
                            <ArrowLeft size={17} />
                            Continue Shopping
                        </Link>
                    </div>

                    <div className="cart-summary">
                        <h2>Order Summary</h2>

                        <div className="summary-row">
                            <span>Subtotal</span>
                            <span>₹{totalPrice.toLocaleString("en-IN")}</span>
                        </div>

                        <div className="summary-row">
                            <span>Delivery</span>
                            <span className="free-delivery">Free</span>
                        </div>

                        <hr />

                        <div className="summary-total">
                            <h3>Total</h3>
                            <h3>₹{totalPrice.toLocaleString("en-IN")}</h3>
                        </div>

                        <Link to="/checkout" className="checkout-btn">
                            Proceed to Checkout
                        </Link>

                        <div className="secure-checkout">
                            <ShieldCheck size={18} />
                            Secure Checkout
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Cart;
