import toast from "react-hot-toast";
import { create } from "zustand";
import { axiosPublic } from "../lib/axiosInstances.js";
import { io } from "socket.io-client";

const BASE_URL = "http://localhost:5001";

const useAuthStore = create((set, get) => ({
  authEmail: null,
  authUsername: null,
  accessToken: null,
  roles: [],
  error: null,
  isLoading: false,
  User: null,
  socketInstance: null,
  onlineUsers: [],
  setAuthEmail: (authEmail) => set({ authEmail }),
  setAuthUsername: (authUsername) => set({ authUsername }),
  setAccessToken: (token) => set({ accessToken: token }),
  setRoles: (roles) => set({ roles }),
  setIsLoading: (status) => set({ isLoading: status }),

  signup: async (email, username, password, navigate) => {
    try {
      set({ isLoading: true, error: null });
      const response = await axiosPublic.post("/auth/register", {
        email,
        username,
        password,
      });
      toast.success("Registered Successfully");
      navigate("/login");
      set({ isLoading: false });
    } catch (e) {
      set({
        error: e.response.data.error || "Error signing up",
        isLoading: false,
      });
      toast.error(e);
    }
  },
  login: async (email, password, navigate) => {
    try {
      set({ isLoading: true, error: null });
      const response = await axiosPublic.post("/auth/login", {
        email,
        password,
      });
      console.log("Access Token:", response.data.accessToken);
      console.log("Roles:", response.data.roles);

      // Update Zustand state with accessToken and roles
      set({
        accessToken: response.data.accessToken,
        roles: response.data.roles,
        isLoading: false,
        User: response.data,
      });

      get().connectSocket();

      // Navigate after successful login
      navigate("/");
    } catch (e) {
      set({
        error: e.response.data.error || "Error signing up",
        isLoading: false,
      });
      toast.error(e);
    }
  },
  logout: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosPublic.get("/auth/logout");
      set({ isLoading: false, User: null, accessToken: null, roles: null });
      toast.success("Logged out successfully");
      get().disconnectSocket();
    } catch (e) {
      set({
        error: e.response.data.error || "Error logging out",
        isLoading: false,
      });
      toast.error(e);
    }
  },
  updateProfile: async (profilePic, axiosPrivate) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosPrivate.put(
        "/auth/update-profile",
        profilePic
      );
      set({ User: response.data });
      console.log(response.data);
      toast.success("Profile updated successfully");
    } catch (e) {
      set({
        error: e.response.data.error || "Error updating profile",
      });
      toast.error(e);
    } finally {
      set({ isLoading: false });
    }
  },
  connectSocket: () => {
    const { User } = get();
    try {
      const socket = io(BASE_URL, {
        withCredentials: true,
        transports: ["websocket"],
        query: {
          userId: User.id,
        },
      });
      socket.connect();

      set({ socketInstance: socket });

      socket.on("getOnlineUsers", (userIds) => {
        set({ onlineUsers: userIds });
      });
    } catch (e) {
      console.error(e.message);
    }
  },
  disconnectSocket: () => {
    if (get().socketInstance?.connected) get().socketInstance?.disconnect();
  },
}));

export default useAuthStore;
