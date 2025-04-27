import { useContext, useEffect, useState } from "react";
import ProductCard from "./Product";
import { Pagination, Stack } from "@mui/material";
import { ThemeContext } from "@emotion/react";
import { FavContext } from "../../constants/favItems";
import { CartContext } from "../../constants/cartItems";
import useProducts from "../../constants/products";
import Loader3 from "./Loading3";

const FavProducts = () => {
  const { loading, products } = useProducts();
  const { itemsOnCart, addItemOncart, deleteItem } = useContext(CartContext);
  const [localCart, setLocalCart] = useState([]);
  const [localFav, setLocalFav] = useState([]);
  const [Favprods, setFavProds] = useState([]);
  const { itemsOnFav, addItemOnFav, deleteItemFromFav } =
    useContext(FavContext);
  const { theme } = useContext(ThemeContext);

  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 12;
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = Favprods.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );
  const totalPages = Math.ceil(Favprods.length / productsPerPage);

  useEffect(() => {
    if (itemsOnCart && itemsOnCart.length > 0) {
      setLocalCart(itemsOnCart.map((item) => item.productId));
    } else {
      setLocalCart([]);
    }
    if (itemsOnFav && itemsOnFav.length > 0) {
      setLocalFav(itemsOnFav.map((items) => items.productId));
    } else {
      setLocalFav([]);
    }
  }, [itemsOnCart, itemsOnFav]);

  const handleAddToCart = (pantId) => {
    addItemOncart(pantId);
    setLocalCart([...localCart, pantId]);
  };

  const handleDeleteItem = (pantId) => {
    deleteItem(pantId);
    setLocalCart(localCart.filter((id) => id !== pantId));
  };

  const handleAddToFav = (pantId) => {
    addItemOnFav(pantId);
    setLocalFav([...localFav, pantId]);
  };

  const handleDeleteFromFav = (pantId) => {
    deleteItemFromFav(pantId);
    setLocalFav(localFav.filter((id) => id !== pantId));
    setFavProds(Favprods.filter((product) => product.prodId !== pantId));
  };

  const handlePageChange = (event, pageNumber) => {
    setCurrentPage(pageNumber);
  };

  useEffect(() => {
    if (itemsOnFav?.length > 0 && products?.length > 0) {
      const filteredFavProducts = products.filter((product) =>
        itemsOnFav.some((favItem) => favItem.productId === product.prodId)
      );
      setFavProds(filteredFavProducts);
    } else {
      setFavProds([]);
    }
  }, [itemsOnFav, products]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center text-center size-10  justify-center">
        <Loader3 />
      </div>
    );
  }

  return (
    <div className="p-5">
      <div className="font-roboto text-black dark:text-white font-bold text-2xl m-5">
        <h1>User Wishlist</h1>
      </div>
      {Favprods.length > 0 ? (
        <div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {currentProducts.map((pant) => {
              const isOnCart = localCart.includes(pant.prodId);
              const isOnFav = localFav.includes(pant.prodId);

              return (
                <div key={pant.prodId}>
                  <ProductCard
                    itemImage={pant.image}
                    itemName={pant.prodName}
                    itemDesc={pant.prodDescription}
                    itemPrice={`RWF ${pant.price}`}
                    handleAddToCart={() => handleAddToCart(pant.prodId)}
                    deleteItem={() => handleDeleteItem(pant.prodId)}
                    isOnCart={isOnCart}
                    isOnFav={isOnFav}
                    addToFav={() => handleAddToFav(pant.prodId)}
                    deleteFromFav={() => handleDeleteFromFav(pant.prodId)}
                  />
                </div>
              );
            })}
          </div>
          <div className="flex justify-center items-center">
            <div className="flex justify-center items-center text-red-500">
              <Stack spacing={2} className="mt-5">
                <Pagination
                  count={totalPages}
                  page={currentPage}
                  onChange={handlePageChange}
                  variant="outlined"
                  shape="circular"
                  siblingCount={1}
                  boundaryCount={2}
                  sx={{
                    "& .MuiPaginationItem-root": {
                      color: theme === "dark" ? "#fff" : "#000",
                      borderColor: theme === "dark" ? "#fff" : "#000",
                    },
                    "& .MuiPaginationItem-root.Mui-selected": {
                      backgroundColor: theme === "dark" ? "#fff" : "#000",
                      color: theme === "dark" ? "#000" : "#fff",
                    },
                    "& .MuiPaginationItem-ellipsis": {
                      color: theme === "dark" ? "#fff" : "#000",
                    },
                  }}
                />
              </Stack>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-black min-h-screen font-bold text-lg flex flex-col items-center justify-center dark:text-white">
          <img
            src="/noData.png"
            alt="No Data"
            className="w-[10rem] h-[10rem] rounded-md my-3"
          />
          <h1 className="font-montserrat">
            No products available on your wishlist
          </h1>
        </div>
      )}
    </div>
  );
};

export default FavProducts;
