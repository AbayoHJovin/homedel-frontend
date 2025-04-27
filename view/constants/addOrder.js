import { useNavigate } from "react-router-dom";
import { apiUrl } from "../src/lib/apis";
import { useContext } from "react";
import { CurrentUserContext } from "./currentUser";

// Wrap the function inside a functional component or custom hook.
const UseAddOrder = () => {
  const navigate = useNavigate();
  const { currentUser } = useContext(CurrentUserContext);

  const addOrder = async (transactionUrl, paymentMethod, orderData) => {
    console.log("transactionUrl==>", transactionUrl);
    try {
      const response = await fetch(`${apiUrl}/addOffer`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderData,
          paymentMethod,
          transactionUrl,
          userId: currentUser.userId,
        }),
      });
      const data = await response.json();
      if (data.message === "Order placed successfully") {
        await handleRedirect();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleRedirect = async () => {
    try {
      const response = await fetch(
        `${apiUrl}/deleteAllCartItems?userId=${currentUser.userId}`,
        {
          method: "DELETE",
        }
      );
      const message = await response.json();

      if (message.message === "Cart reset successfully.") {
        navigate("/offerComfirmation");
      }
    } catch (e) {
      console.error(e);
    }
  };

  return { addOrder };
};

export default UseAddOrder;
