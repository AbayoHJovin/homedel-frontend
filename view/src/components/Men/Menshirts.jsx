import { useContext, useEffect, useState, useCallback } from "react";
import useProducts from "../../../constants/products";
import { CartContext } from "../../../constants/cartItems";
import { FavContext } from "../../../constants/favItems";
import { ThemeContext } from "../../../constants/ThemeContext";
import ProductDisplay from "../ProductDisplay";

const MenShirts = () => {
  const { loading, products } = useProducts();
  const { itemsOnCart, addItemOncart, deleteItem } = useContext(CartContext);
  const { itemsOnFav } = useContext(FavContext);
  const { theme } = useContext(ThemeContext);
  
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [localCart, setLocalCart] = useState([]);
  const [localFav, setLocalFav] = useState([]);

  const filterProducts = useCallback(() => {
    return products.filter(
      (prod) => prod.gender === "Male" && prod.category === "shirts"
    );
  }, [products]);

  useEffect(() => {
    setFilteredProducts(filterProducts());
  }, [filterProducts]);

  useEffect(() => {
    setLocalCart(itemsOnCart?.map(item => item.productId) || []);
    setLocalFav(itemsOnFav?.map(item => item.productId) || []);
  }, [itemsOnCart, itemsOnFav]);

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
      localFav={localFav}
      theme={theme}
    />
  );
};

export default MenShirts;
