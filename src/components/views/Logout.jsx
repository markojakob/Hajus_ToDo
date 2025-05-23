import { useEffect } from "react";
import { useNavigate } from "react-router";

export default function Logout() {
  const navigate = useNavigate();
  localStorage.removeItem("token");
  useEffect(() => {
    
    
    navigate("/login");
  }, [navigate]);

  return null;
}