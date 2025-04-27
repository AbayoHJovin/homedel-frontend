import { create } from "zustand";
import { apiUrl } from "../src/lib/apis";

const useOrders = create((set, get) => ({
  orders: [],
  loading: false,
  currentPage: 1,
  totalPages: 1,
  filter: "all",
  error: null,

  fetchOrders: async (page = 1, filter = "all") => {
    try {
      set({ loading: true });
      const response = await fetch(
        `${apiUrl}/orders?page=${page}&filter=${filter}`,
        { credentials: "include" }
      );
      const data = await response.json();

      set({
        orders: data.orders,
        currentPage: page,
        totalPages: data.totalPages,
        loading: false,
      });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  approveOrder: async (orderId, message = "") => {
    try {
      set({ loading: true });
      const response = await fetch(`${apiUrl}/updateOrder?offerId=${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ approvalMessage: message }),
      });
      const data = await response.json();

      if (data.message === "Offer Approved") {
        const orders = get().orders.map((order) =>
          order.orderId === orderId
            ? { ...order, approved: true, approvalMessage: message }
            : order
        );
        set({ orders });
      }
    } catch (error) {
      set({ error: error.message });
    } finally {
      set({ loading: false });
    }
  },

  deleteOrder: async (orderId) => {
    try {
      set({ loading: true });
      await fetch(`${apiUrl}/removeOrder?offerId=${orderId}`, {
        method: "DELETE",
      });
      const orders = get().orders.filter((order) => order.orderId !== orderId);
      set({ orders });
    } catch (error) {
      set({ error: error.message });
    } finally {
      set({ loading: false });
    }
  },
}));

export default useOrders;
