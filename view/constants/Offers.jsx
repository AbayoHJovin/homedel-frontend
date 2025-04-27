// /* eslint-disable react/prop-types */
// /* eslint-disable no-unused-vars */
// import { createContext, useContext, useEffect, useState } from "react";
// import { CurrentUserContext } from "./currentUser";
// import { apiUrl } from "../src/lib/apis";

// export const OffersContext = createContext();

// export default function Offers({ children }) {
//   const { isAnAdmin } = useContext(CurrentUserContext);
//   const [allOffers, setOffers] = useState([]);
//   const [isLoading, setISLoading] = useState(false);
//   const [pending,setPending]=useState([])
//   const [approved,setApproved]=useState([])
//   const [kigali,setKigali]=useState([])
//   const [north,setNorth]=useState([])
//   const [south,setSouth]=useState([])
//   const [west,setWest]=useState([])
//   const [east,setEast]=useState([])
//   useEffect(() => {
//     if (isAnAdmin === true) {
//       fetch(`${apiUrl}/getOffer`, {
//         method: "GET",
//       })
//         .then((resp) => resp.json())
//         .then((message) => {
//         const response=message.message
//           setOffers(response);
//           setApproved(response.approved === true)
//           setPending(response.approved === false)
//         })
//         .catch((e) => console.error(e))
//         .finally(()=>setISLoading(false))
//     }
//   }, [isAnAdmin]);
//   return (
//     <OffersContext.Provider value={{allOffers,isLoading,pending,approved}}>
//         {children}
//     </OffersContext.Provider>
//   )
// }

/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { createContext, useContext, useEffect, useState } from "react";
import { CurrentUserContext } from "./currentUser";
import { apiUrl } from "../src/lib/apis";

export const OffersContext = createContext();

export default function Offers({ children }) {
  const { isAnAdmin } = useContext(CurrentUserContext);
  const [allOffers, setOffers] = useState([]);
  const [isLoading, setISLoading] = useState(false);
  const [pending, setPending] = useState([]);
  const [approved, setApproved] = useState([]);
  const [kigali, setKigali] = useState([]);
  const [north, setNorth] = useState([]);
  const [south, setSouth] = useState([]);
  const [west, setWest] = useState([]);
  const [east, setEast] = useState([]);

  useEffect(() => {
    if (isAnAdmin === true) {
      fetch(`${apiUrl}/getOffer`, {
        method: "GET",
      })
        .then((resp) => resp.json())
        .then((message) => {
          const response = message.orders;

          setOffers(response);

          const approvedOrders = response?.filter(
            (order) => order.approved === true
          );
          const pendingOrders = response?.filter(
            (order) => order.approved === false
          );
          setApproved(approvedOrders);
          setPending(pendingOrders);

          const kigaliOrders = [];
          const northernOrders = [];
          const southernOrders = [];
          const easternOrders = [];
          const westernOrders = [];

          response?.forEach((order) => {
            const addressParts = order.address.split("-"); // Split the address by commas
            const province = addressParts[0].trim(); // Get the first string and trim any whitespace

            switch (province) {
              case "Kigali":
                kigaliOrders.push(order);
                break;
              case "Northern":
                northernOrders.push(order);
                break;
              case "Southern":
                southernOrders.push(order);
                break;
              case "Eastern":
                easternOrders.push(order);
                break;
              case "Western":
                westernOrders.push(order);
                break;
              default:
                break;
            }
          });

          setKigali(kigaliOrders);
          setNorth(northernOrders);
          setSouth(southernOrders);
          setEast(easternOrders);
          setWest(westernOrders);
        })
        .catch((e) => console.error(e))
        .finally(() => setISLoading(false));
    }
  }, [isAnAdmin]);

  return (
    <OffersContext.Provider
      value={{
        allOffers,
        isLoading,
        pending,
        approved,
        kigali,
        north,
        south,
        east,
        west,
      }}
    >
      {children}
    </OffersContext.Provider>
  );
}
