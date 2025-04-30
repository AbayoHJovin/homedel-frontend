import { useContext, useEffect, useState, useCallback } from "react";
import useProducts from "../../../constants/products";
import { CartContext } from "../../../constants/cartItems";
import { ThemeContext } from "../../../constants/ThemeContext";
import ProductDisplay from "../ProductDisplay";

const Watches = () => {
  const { loading, products } = useProducts();
  const { itemsOnCart, addItemOncart, deleteItem } = useContext(CartContext);
  const { theme } = useContext(ThemeContext);
  
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [localCart, setLocalCart] = useState([]);

  const filterProducts = useCallback(() => {
    return products.filter(prod => prod.category === "watches");
  }, [products]);

  useEffect(() => {
    setFilteredProducts(filterProducts());
  }, [filterProducts]);

  useEffect(() => {
    setLocalCart(itemsOnCart?.map(item => item.productId) || []);
  }, [itemsOnCart]);

  const handleAddToCart = useCallback((productId, event) => {
    event.stopPropagation();
    addItemOncart(productId);
  }, [addItemOncart]);

  const handleDeleteItem = useCallback((productId, event) => {
    event.stopPropagation();
    deleteItem(productId);
  }, [deleteItem]);

  return (
    <ProductDisplay
      products={filteredProducts}
      loading={loading}
      handleAddToCart={handleAddToCart}
      handleDeleteItem={handleDeleteItem}
      localCart={localCart}
      theme={theme}
    />
  );
};

export default Watches;
