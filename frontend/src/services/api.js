import axios from "axios";

// Create axios instance with base configuration
const api = axios.create({
  baseURL: "https://mitronet.onrender.com/",
  withCredentials: true, // Enable sending cookies with requests
  headers: {
    "Content-Type": "application/json",
  },
});

// Auth API functions
export const authAPI = {
  signup: async (userData) => {
    const response = await api.post("/signup", userData);
    return response.data;
  },

  login: async (credentials) => {
    const response = await api.post("/login", credentials);
    return response.data;
  },

  logout: async () => {
    const response = await api.post("/logout");
    return response.data;
  },

  checkAuth: async () => {
    const response = await api.get("/loginSuccessful");
    return response.data;
  },
};

// Posts API functions
export const postsAPI = {
  getAllPosts: async () => {
    const response = await api.get("/loginSuccessful");
    return response.data;
  },

  createPost: async (postData) => {
    const response = await api.post("/createpost", postData);
    return response.data;
  },

  likePost: async (postId) => {
    const response = await api.post(`/like/${postId}`);
    return response.data;
  },

  addComment: async (postId, commentData) => {
    const response = await api.post(`/comment/${postId}`, commentData);
    return response.data;
  },

  deletePost: async (postId) => {
    const response = await api.delete(`/deletepost/${postId}`);
    return response.data;
  },

  deleteComment: async (postId, commentId) => {
    const response = await api.delete(`/deletecomment/${postId}/${commentId}`);
    return response.data;
  },
};

// Profile API functions
export const profileAPI = {
  getProfile: async () => {
    const response = await api.get("/profile");
    return response.data;
  },

  updateProfile: async (profileData) => {
    const formData = new FormData();
    Object.keys(profileData).forEach((key) => {
      if (profileData[key]) {
        formData.append(key, profileData[key]);
      }
    });

    const response = await api.post("/editprofile", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },
};

// Friends/Connections API functions
export const friendsAPI = {
  addFriend: async (userId) => {
    const response = await api.post("/addfriend", { userId });
    return response.data;
  },

  removeFriend: async (userId) => {
    const response = await api.post("/removefriend", { userId });
    return response.data;
  },

  getConnections: async () => {
    const response = await api.get("/connection");
    return response.data;
  },
};

// Dashboard API functions
export const dashboardAPI = {
  getDashboard: async () => {
    const response = await api.get("/dashboard");
    return response.data;
  },
};

export default api;
