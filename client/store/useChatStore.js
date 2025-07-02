import { create } from "zustand";
import useAuthStore from "./useAuthStore";

export const useChatStore = create((set, get) => ({
  users: [],
  messages: [],
  isLoading: false,
  selectedUser: null,
  setSelectedUser: (selectedUser) => set({ selectedUser }),

  getUsers: async (axiosPrivate) => {
    set({ isLoading: true });
    try {
      const response = await axiosPrivate.get("/messages/users");
      set({ isLoading: false, users: response.data });
    } catch (e) {
      set({ isLoading: false });
      console.error(e);
    }
  },
  getMessages: async (axiosPrivate, selectedUser) => {
    set({ isLoading: true });
    try {
      const response = await axiosPrivate.get(`/messages/${selectedUser}`);
      console.log(response);
      set({ isLoading: false, messages: response.data });
    } catch (e) {
      set({ isLoading: false });
      console.error(e);
    }
  },
  sendMessages: async ({ axiosPrivate, text, image }) => {
    const { selectedUser, messages } = get();
    try {
      const response = await axiosPrivate.post(
        `/messages/send/${selectedUser._id}`,
        { text, image }
      );
      set({ messages: [...messages, response.data] });
    } catch (e) {
      console.error(e);
      throw e; // Wichtig für Error Handling im Frontend
    }
  },
  subscribeToMessages: () => {
    const { selectedUser } = get();
    if (!selectedUser) return;

    const socket = useAuthStore.getState().socketInstance;
    socket.on("message", (message) => {
      if (message.senderId !== selectedUser._id) return;

      set({ messages: [...get().messages, message] });
    });
  },
  unsubscribeFromMessages: () => {
    const socket = useAuthStore.getState().socketInstance;
    socket.off("message");
  },
}));
