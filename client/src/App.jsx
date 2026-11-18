
import { useEffect, useState } from "react";
import axios from "axios";

import Checkout from "./pages/Checkout";
import OrderSuccess from "./pages/OrderSuccess";
import MyOrders from "./pages/MyOrders";
import AdminDashboard from "./pages/AdminDashboard";
import ProductManagement from "./pages/ProductManagement";
import ProductDetails from "./pages/ProductDetails";
import OrderTracking from "./pages/OrderTracking";

import {
    ShoppingCart,
    Search,
    User,
    Heart,
    ArrowRight,
    Star,
    Package
} from "lucide-react";

import {
    BrowserRouter,
    Routes,
    Route,
    Link,
    useNavigate
} from "react-router-dom";

import {
    CartProvider,
    useCart
} from "./context/CartContext";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Cart from "./pages/Cart";

import "./App.css";


// HOME PAGE
function Home() {

    const [products, setProducts] = useState([]);
    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("All");

    const [isLoggedIn, setIsLoggedIn] = useState(
        !!localStorage.getItem("token")
    );

    const { addToCart, totalItems } = useCart();
    const navigate = useNavigate();


    // CHECK LOGIN STATUS
    useEffect(() => {
        const checkLogin = () => {
            setIsLoggedIn(!!localStorage.getItem("token"));
        };

        window.addEventListener("storage", checkLogin);

        return () => {
            window.removeEventListener("storage", checkLogin);
        };
    }, []);


    // FETCH PRODUCTS
    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const response = await axios.get(
                "http://localhost:8000/api/products"
            );

            setProducts(response.data);

        } catch (error) {
            console.log(
                "Product loading error:",
                error.message
            );
        }
    };


    // LOGOUT
    const handleLogout = () => {

        localStorage.removeItem("token");
        localStorage.removeItem("user");

        setIsLoggedIn(false);

        navigate("/login");
    };


    // PRODUCT CATEGORIES
    const categories = [
        "All",
        ...new Set(products.map((p) => p.category))
    ];


    // SEARCH AND FILTER
    const filteredProducts = products.filter((product) => {

        const matchesSearch = product.name
            .toLowerCase()
            .includes(search.toLowerCase());

        const matchesCategory =
            category === "All" ||
            product.category === category;

        return matchesSearch && matchesCategory;
    });


    // ADD TO CART
    const handleAddToCart = (product) => {

        if (product.stock <= 0) return;

        addToCart(product);
    };


    return (

        <div className="app">

            {/* NAVBAR */}

            <nav className="navbar">

                <Link to="/my-orders">My Orders</Link>

                <Link to="/admin">Admin Dashboard</Link>

                <div className="nav-links">

                    <a href="#home">Home</a>
                    <a href="#products">Products</a>
                    <a href="#categories">Categories</a>
                    <a href="#footer">About</a>

                </div>


                {/* NAV ACTIONS */}

                <div className="nav-actions">

                    {isLoggedIn ? (

                        <button
                            className="auth-nav-link logout-btn"
                            onClick={handleLogout}
                        >
                            <User size={19} />
                            Logout
                        </button>

                    ) : (

                        <>
                            <Link
                                to="/login"
                                className="auth-nav-link"
                                aria-label="Login"
                            >
                                <User size={19} />
                                Login
                            </Link>

                            <Link
                                to="/register"
                                className="auth-nav-link register-link"
                            >
                                Register
                            </Link>
                        </>

                    )}


                    <Link
                        to="/cart"
                        className="icon-btn cart-btn"
                        aria-label="Shopping cart"
                        title="Shopping cart"
                    >
                        <ShoppingCart size={21} />
                        <span>{totalItems}</span>
                    </Link>

                </div>

            </nav>


            {/* HERO SECTION */}

            <section className="hero" id="home">

                <div className="hero-content">

                    <p className="hero-tag">
                        WELCOME TO Amit ShopEase - Your One-Stop Online Store
                    </p>

                    <h1>
                        Discover Your
                        <br />
                        Perfect <span>Style.</span>
                    </h1>

                    <p className="hero-description">
                        Explore our latest collection of premium products.
                        Quality products, amazing prices and a better
                        shopping experience.
                    </p>

                    <a href="#products" className="shop-btn">
                        Shop Now
                        <ArrowRight size={18} />
                    </a>

                </div>


                <div className="hero-image">

                    <img
                        src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=900"
                        alt="Shopping collection"
                    />

                </div>

            </section>


            {/* FEATURES */}

            <section className="features">

                <div className="feature">

                    <Package size={27} />

                    <div>
                        <h4>Free Shipping</h4>
                        <p>On selected orders</p>
                    </div>

                </div>


                <div className="feature">

                    <Heart size={27} />

                    <div>
                        <h4>Quality Products</h4>
                        <p>Carefully selected</p>
                    </div>

                </div>


                <div className="feature">

                    <ShoppingCart size={27} />

                    <div>
                        <h4>Easy Shopping</h4>
                        <p>Simple checkout</p>
                    </div>

                </div>

            </section>


            {/* CATEGORIES */}

            <section
                className="products-section"
                id="categories"
            >

                <div className="section-heading">

                    <div>
                        <p className="small-heading">
                            EXPLORE COLLECTIONS
                        </p>

                        <h2>Shop By Category</h2>
                    </div>

                </div>


                <div className="category-list">

                    {categories.map((item) => (

                        <button
                            key={item}
                            className={
                                category === item
                                    ? "category active"
                                    : "category"
                            }
                            onClick={() => setCategory(item)}
                        >
                            {item}
                        </button>

                    ))}

                </div>

            </section>


            {/* PRODUCTS */}

            <section
                className="products-section"
                id="products"
            >

                <div className="section-heading">

                    <div>
                        <p className="small-heading">
                            OUR COLLECTION
                        </p>

                        <h2>Featured Products</h2>
                    </div>


                    <div className="search-box">

                        <Search size={19} />

                        <input
                            type="text"
                            placeholder="Search products..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />

                    </div>

                </div>


                <div className="product-grid">

                    {filteredProducts.length > 0 ? (

                        filteredProducts.map((product) => (

                            <div
                                className="product-card"
                                key={product._id}
                            >

                                <div className="product-image">

                                    <img
                                        src={product.image}
                                        alt={product.name}
                                    />

                                    <button
                                        className="wishlist"
                                        aria-label="Add to wishlist"
                                    >
                                        <Heart size={19} />
                                    </button>

                                </div>


                                <div className="product-info">

                                    <p className="product-category">
                                        {product.category}
                                    </p>

                                    <h3>{product.name}</h3>

                                    <Link
                                        to={`/product/${product._id}`}
                                        className="view-details-btn"
                                    >
                                        View Details
                                    </Link>


                                    <div className="rating">

                                        <Star
                                            size={15}
                                            fill="currentColor"
                                        />

                                        <span>New Arrival</span>

                                    </div>


                                    <div className="product-bottom">

                                        <h3>₹{product.price}</h3>

                                        <button
                                            className="add-cart"
                                            onClick={() =>
                                                handleAddToCart(product)
                                            }
                                            disabled={product.stock <= 0}
                                        >
                                            {product.stock > 0
                                                ? "Add to Cart"
                                                : "Out of Stock"}
                                        </button>

                                    </div>

                                </div>

                            </div>

                        ))

                    ) : (

                        <div className="no-products">

                            <ShoppingCart size={35} />

                            <h3>No Products Found</h3>

                            <p>
                                Try another search or add products
                                to your database.
                            </p>

                        </div>

                    )}

                </div>

            </section>


            {/* FOOTER */}

            <footer id="footer">

                <h2>ShopEase.</h2>

                <p>
                    Your destination for quality shopping.
                </p>

                <p>
                    © 2026 ShopEase. All rights reserved.
                </p>

            </footer>

        </div>

    );

}


// MAIN APP WITH ROUTING

function App() {

    return (

        <CartProvider>

            <BrowserRouter>

                <Routes>

                    <Route path="/" element={<Home />} />

                    <Route path="/login" element={<Login />} />

                    <Route path="/my-orders" element={<MyOrders />} />

                    <Route path="/admin" element={<AdminDashboard />} />

                    <Route
                        path="/admin/products"
                        element={<ProductManagement />}
                    />

                    <Route path="/register" element={<Register />} />

                    <Route
                        path="/product/:id"
                        element={<ProductDetails />}
                    />

                    <Route path="/cart" element={<Cart />} />

                    <Route path="/checkout" element={<Checkout />} />

                    <Route
                        path="/order-success"
                        element={<OrderSuccess />}
                    />

                    <Route
                        path="/track-order/:id"
                        element={<OrderTracking />}
                    />

                </Routes>

            </BrowserRouter>

        </CartProvider>

    );

}

export default App;
