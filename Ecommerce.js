import React, { useState, useEffect } from 'react';
import axios from 'axios';

// Product Component
const Product = ({ product, addToCart }) => {
  return (
    <div className="product">
      <h3>{product.name}</h3>
      <p>{product.description}</p>
      <p>Price: ${product.price}</p>
      <button onClick={() => addToCart(product)}>Add to Cart</button>
    </div>
  );
};

// Product List Component
const ProductList = ({ products, addToCart, applyFilters }) => {
  const [sortOption, setSortOption] = useState('');

  const handleSortChange = (e) => {
    setSortOption(e.target.value);
    applyFilters(e.target.value);
  };

  return (
    <div>
      <h2>Product List</h2>
      <select value={sortOption} onChange={handleSortChange}>
        <option value="">Sort by</option>
        <option value="price-asc">Price: Low to High</option>
        <option value="price-desc">Price: High to Low</option>
      </select>
      <div className="product-list">
        {products.map((product) => (
          <Product key={product.id} product={product} addToCart={addToCart} />
        ))}
      </div>
    </div>
  );
};

// Cart Component
const Cart = ({ cart, updateQuantity, checkout }) => {
  const total = cart.reduce((acc, item) => acc + item.quantity * item.price, 0);

  return (
    <div>
      <h2>Shopping Cart</h2>
      {cart.length === 0 ? (
        <p>Your cart is empty</p>
      ) : (
        <div>
          {cart.map((item) => (
            <div key={item.id} className="cart-item">
              <p>{item.name}</p>
              <p>Price: ${item.price}</p>
              <p>
                Quantity:
                <input
                  type="number"
                  value={item.quantity}
                  onChange={(e) => updateQuantity(item.id, +e.target.value)}
                />
              </p>
            </div>
          ))}
          <h3>Total: ${total.toFixed(2)}</h3>
          <button onClick={checkout}>Checkout</button>
        </div>
      )}
    </div>
  );
};

// Main App Component
const App = () => {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);

  useEffect(() => {
    // Fetch products from API
    axios.get('/api/products').then((response) => {
      setProducts(response.data);
    });
  }, []);

  const addToCart = (product) => {
    setCart((prevCart) => {
      const existingProduct = prevCart.find((item) => item.id === product.id);
      if (existingProduct) {
        return prevCart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });
  };

  const updateQuantity = (productId, quantity) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const checkout = () => {
    console.log('Checkout:', cart);
    setCart([]); // Clear the cart after checkout
    alert('Checkout successful!');
  };

  const applyFilters = (sortOption) => {
    const sortedProducts = [...products];
    if (sortOption === 'price-asc') {
      sortedProducts.sort((a, b) => a.price - b.price);
    } else if (sortOption === 'price-desc') {
      sortedProducts.sort((a, b) => b.price - a.price);
    }
    setProducts(sortedProducts);
  };

  return (
    <div className="app">
      <h1>E-commerce Shopping Cart</h1>
      <div className="main-content">
        <ProductList
          products={products}
          addToCart={addToCart}
          applyFilters={applyFilters}
        />
        <Cart cart={cart} updateQuantity={updateQuantity} checkout={checkout} />
      </div>
    </div>
  );
};