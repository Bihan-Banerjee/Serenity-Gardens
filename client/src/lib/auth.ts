export const getTokenEmail = (): string | null => {
  const token = localStorage.getItem("token");
  if (!token) return null;

  try {
    const payload = JSON.parse(
      atob(token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/"))
    );
    return typeof payload.email === "string" ? payload.email : null;
  } catch {
    return null;
  }
};

export const logout = () => {
  localStorage.removeItem("token");
  if (window.location.pathname !== "/login") {
    window.location.replace("/login");
  }
};
