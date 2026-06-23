import { useState, useEffect, useCallback } from "react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

const useDashboard = () => {
  const { isAuthenticated } = useAuth();
  const [data, setData] = useState({
    cards: {
      totalLearners: 0,
      femaleLearners: 0,
      maleLearners: 0,
      disabledLearners: 0,
      totalInstitutions: 0,
    },
    barGraph: { female: 0, male: 0 },
    lineGraph: [],
  });

  const fetchDashboard = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;
      const response = await api.get("/dashboard");
      if (response.data) {
        setData(response.data);
      }
    } catch (error) {
      console.error("Dashboard fetch error:", error);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      // Small delay to ensure token is fully set
      const timer = setTimeout(() => {
        fetchDashboard();
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isAuthenticated, fetchDashboard]);

  return { data, refetch: fetchDashboard };
};

export default useDashboard;