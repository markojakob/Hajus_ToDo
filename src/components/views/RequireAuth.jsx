import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

export default function RequireAuth({ children }) {
  const navigate = useNavigate();
  const [checkingAuth, setCheckingAuth] = useState(true);
  const token = localStorage.getItem("access_token");

  useEffect(() => {
    if (!token) {
      navigate("/login");
    } else {
      setCheckingAuth(false);
    }
  }, [token, navigate]);

  if (checkingAuth) {
    return null; // or loading spinner if you want
  }

  return children;
}
