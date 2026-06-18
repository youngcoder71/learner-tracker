import { useState, useEffect, useCallback } from "react";
import api from "../services/api";

const useDashboard = () => {
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
  const [isLoading, setIsLoading] = useState(true);

  const fetchDashboard = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await api.get("/dashboard");
      setData(response.data);
    } catch (error) {
      console.error("Dashboard fetch error:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  return { data, isLoading, refetch: fetchDashboard };
};

export default useDashboard;