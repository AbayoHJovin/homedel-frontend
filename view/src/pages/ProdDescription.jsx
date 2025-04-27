import { useState, useEffect } from "react";
import useProducts from "../../constants/products";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";

const ProdDescription = () => {
  const { products } = useProducts();
  const params = useParams();
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    const productFilter = products.find(
      (product) => product.prodId === params.prodId
    );
    setSelectedProduct(productFilter);
  }, [params.prodId, products]);

  return (
    <div>
      <Navbar />
      {selectedProduct ? (
        <div>
          <h1>{selectedProduct.prodName}</h1>
          <img
            className="bg-black"
            src={selectedProduct.image}
            alt={selectedProduct.prodName}
          />
        </div>
      ) : (
        <p>Product not found</p>
      )}
    </div>
  );
};

export default ProdDescription;
