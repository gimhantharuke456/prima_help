export const checkAuth = async () => {
  return localStorage.getItem("email") != null;
};
