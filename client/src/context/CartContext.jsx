
import { createContext, useContext, useState } from "react";

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export function CartProvider({ children }) {
    const [cart, setCart] = useState([]);

    const addToCart = (product) => {
        setCart((prev) => {
            const existing = prev.find(
                (item) => item._id === product._id
            );

            if (existing) {
                return prev.map((item) =>
                    item._id === product._id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            }

            return [...prev, { ...product, quantity: 1 }];
        });
    };

    const removeFromCart = (id) => {
        setCart((prev) =>
            prev.filter((item) => item._id !== id)
        );
    };

    const updateQuantity = (id, quantity) => {
        if (quantity < 1) return;

        setCart((prev) =>
            prev.map((item) =>
                item._id === id
                    ? { ...item, quantity }
                    : item
            )
        );
    };

    const clearCart = () => setCart([]);

    const totalItems = cart.reduce(
        (total, item) => total + item.quantity, 0
    );

    const totalPrice = cart.reduce(
        (total, item) => total + item.price * item.quantity, 0
    );

    return (
        <CartContext.Provider
            value={{
                cart,
                addToCart,
                removeFromCart,
                updateQuantity,
                clearCart,
                totalItems,
                totalPrice
            }}
        >
            {children}
        </CartContext.Provider>
    );
}
