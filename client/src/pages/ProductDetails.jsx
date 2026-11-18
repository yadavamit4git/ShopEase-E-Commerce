
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { ShoppingCart, ArrowLeft, Package } from "lucide-react";
import { useCart } from "../context/CartContext";
import "./ProductDetails.css";

function ProductDetails() {
    const { id } = useParams();
    const { addToCart } = useCart();

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await axios.get(
                    `http://localhost:8000/api/products/${id}`
                );
                setProduct(response.data);
            } catch (err) {
                setError("Product not found.");
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [id]);

    if (loading) {
        return <div className="details-message">Loading product...</div>;
    }

    if (error || !product) {
        return (
            <div className="details-message">
                <h2>{error || "Product not found"}</h2>
                <Link to="/">Back to Home</Link>
            </div>
        );
    }

    return (
        <div className="product-details-page">
            <Link to="/" className="details-back">
                <ArrowLeft size={18} /> Back to Shopping
            </Link>

            <div className="details-container">
                <div className="details-image">
                    <img src={product.image} alt={product.name} />
                </div>

                <div className="details-info">
                    <p className="details-category">{product.category}</p>

                    <h1>{product.name}</h1>

                    <h2 className="details-price">
                        ₹{Number(product.price).toLocaleString("en-IN")}
                    </h2>

                    <p className="details-description">
                        {product.description}
                    </p>

                    <p className="details-stock">
                        <Package size={18} />
                        {product.stock > 0
                            ? `${product.stock} items available`
                            : "Out of Stock"}
                    </p>

                    <button
                        className="details-cart-btn"
                        disabled={product.stock <= 0}
                        onClick={() => addToCart(product)}
                    >
                        <ShoppingCart size={19} />
                        {product.stock > 0 ? "Add to Cart" : "Out of Stock"}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ProductDetails;
