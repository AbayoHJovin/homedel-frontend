import { useEffect, useState } from "react";
import axios from "axios";
import { apiUrl } from "../src/lib/apis";

const UseUsers = () => {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        const token=localStorage.getItem("admTokn")
        const getUsers = async () => {
            try {
                const response = await axios.get(`${apiUrl}/users`, {
                    headers: { token:token},
                });
                setUsers(response.data);
            } catch (e) {
                console.log("Error:", e);
            }
        };

        getUsers();
    }, []); 

    return { users };
};

export default UseUsers;
