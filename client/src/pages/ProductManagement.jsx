
import { useEffect, useState } from "react";
import axios from "axios";
import "./ProductManagement.css";

function ProductManagement() {
    const [products, setProducts] = useState([]);
    const [editingId, setEditingId] = useState(null);
    const [loading, setLoading] = useState(false);

    const [form, setForm] = useState({
        name: "",
        description: "",
        price: "",
        category: "",
        image: "",
        stock: ""
    });

    const API = "http://localhost:8000/api/products";

    const getConfig = () => ({
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
        }
    });

    const fetchProducts = async () => {
        try {
            const response = await axios.get(API);
            setProducts(response.data);
        } catch (error) {
            alert("Products load nahi hue");
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    const resetForm = () => {
        setForm({
            name: "",
            description: "",
            price: "",
            category: "",
            image: "",
            stock: ""
        });
        setEditingId(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const productData = {
                ...form,
                price: Number(form.price),
                stock: Number(form.stock)
            };

            if (editingId) {
                await axios.put(
                    `${API}/${editingId}`,
                    productData,
                    getConfig()
                );
                alert("Product updated successfully");
            } else {
                await axios.post(
                    API,
                    productData,
                    getConfig()
                );
                alert("Product added successfully");
            }

            resetForm();
            fetchProducts();

        } catch (error) {
            alert(error.response?.data?.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (product) => {
        setEditingId(product._id);

        setForm({
            name: product.name,
            description: product.description,
            price: product.price,
            category: product.category,
            image: product.image,
            stock: product.stock
        });

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this product?")) {
            return;
        }

        try {
            await axios.delete(`${API}/${id}`, getConfig());
            alert("Product deleted successfully");
            fetchProducts();
        } catch (error) {
            alert(error.response?.data?.message || "Delete failed");
        }
    };

    return (
        <div className="product-management">

            <h1>Product Management</h1>
            <p>Add, update and manage your store products.</p>

            <form onSubmit={handleSubmit} className="product-form">

                <h2>{editingId ? "Edit Product" : "Add New Product"}</h2>

                <input
                    name="name"
                    placeholder="Product Name"
                    value={form.name}
                    onChange={handleChange}
                    required
                />

                <textarea
                    name="description"
                    placeholder="Product Description"
                    value={form.description}
                    onChange={handleChange}
                    required
                />

                <input
                    type="number"
                    name="price"
                    placeholder="Price"
                    min="0"
                    value={form.price}
                    onChange={handleChange}
                    required
                />

                <input
                    name="category"
                    placeholder="Category"
                    value={form.category}
                    onChange={handleChange}
                    required
                />

                <input
                    name="image"
                    placeholder="Image URL"
                    value={form.image}
                    onChange={handleChange}
                    required
                />

                <input
                    type="number"
                    name="stock"
                    placeholder="Stock"
                    min="0"
                    value={form.stock}
                    onChange={handleChange}
                    required
                />

                <button type="submit" disabled={loading}>
                    {loading
                        ? "Please wait..."
                        : editingId
                            ? "Update Product"
                            : "Add Product"}
                </button>

                {editingId && (
                    <button type="button" onClick={resetForm}>
                        Cancel Edit
                    </button>
                )}

            </form>

            <h2>All Products ({products.length})</h2>

            <div className="product-table-wrapper">
                <table className="product-table">
                    <thead>
                        <tr>
                            <th>Image</th>
                            <th>Name</th>
                            <th>Price</th>
                            <th>Category</th>
                            <th>Stock</th>
                            <th>Actions</th>
                        </tr>
                    </thead>

                    <tbody>
                        {products.map((product) => (
                            <tr key={product._id}>
                                <td>
                                    <img
                                        src={product.image}
                                        alt={product.name}
                                        width="55"
                                    />
                                </td>

                                <td>{product.name}</td>
                                <td>₹{product.price}</td>
                                <td>{product.category}</td>
                                <td>{product.stock}</td>

                                <td>
                                    <button onClick={() => handleEdit(product)}>
                                        Edit
                                    </button>

                                    <button onClick={() => handleDelete(product._id)}>
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

        </div>
    );
}

export default ProductManagement;
