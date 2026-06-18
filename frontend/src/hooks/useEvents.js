import { useState, useEffect } from "react";

const useEvents = () => {
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("http://localhost:5000/api/events?status=upcoming");
      const data = await response.json();
      setEvents(data.events || []);
    } catch (error) {
      console.error("Failed to fetch events:", error);
      setEvents([]);
    } finally {
      setIsLoading(false);
    }
  };

  const addEvent = async (eventData) => {
    try {
      const response = await fetch("http://localhost:5000/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(eventData),
      });
      if (response.ok) {
        fetchEvents();
        return { success: true };
      }
      return { success: false, error: "Failed to add event" };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  return { events, isLoading, addEvent, refetch: fetchEvents };
};

export default useEvents;