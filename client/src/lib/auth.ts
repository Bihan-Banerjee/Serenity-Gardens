export const logout = () => {
  localStorage.removeItem("token");
  if (window.location.pathname !== "/login") {
    window.location.replace("/login");
  }
};
