/* eslint-disable react/prop-types */
import { createContext, useContext, useEffect, useState } from "react";
import { CurrentUserContext } from "./currentUser";
import { apiUrl } from "../src/lib/apis";
export const FavContext = createContext();
export default function FavItems({ children }) {
  const [itemsOnFav, setIsOnFav] = useState([]);
  const { currentUser } = useContext(CurrentUserContext);
  useEffect(() => {
    if (currentUser) {
      const token=localStorage.getItem("token")
      fetch(
        `${apiUrl}/getFavItems?currentUser=${currentUser.userId}`,
        {
          method: "GET",
          headers: {authorization:token },
        }
      )
        .then((response) => response.json())
        .then((data) => {
          setIsOnFav(data.products);
        })
        .catch((e) => console.error(e));
    }
  }, [currentUser]);

  function addItemOnFav(itemId) {
    if (currentUser) {
      fetch(`${apiUrl}/addItemOnFav`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: currentUser.userId, prodId: itemId }),
      })
        .then((response) => response.json())
        .then((data) => console.log(data))
        .catch((e) => console.error(e));
    }
  }

  function deleteItemFromFav(itemId) {
    if (currentUser) {
      fetch(
        `${apiUrl}/deleteFavItem?itemId=${itemId}&userId=${currentUser.userId}
  `,
        {
          method: "DELETE",
        }
      )
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
        })
        .catch((e) => console.error(e));
    }
  }
  return (
    <FavContext.Provider
      value={{ itemsOnFav, addItemOnFav, deleteItemFromFav }}
    >
      {children}
    </FavContext.Provider>
  );
}
