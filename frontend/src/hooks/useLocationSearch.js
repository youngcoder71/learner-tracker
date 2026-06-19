import { useState, useEffect } from "react";

const useLocationSearch = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!searchTerm || searchTerm.length < 1) {
      setSuggestions([]);
      setIsOpen(false);
      return;
    }

    const delayDebounce = setTimeout(async () => {
      setIsLoading(true);
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          `http://localhost:5000/api/locations?search=${encodeURIComponent(searchTerm)}`,
          {
            headers: {
              Authorization: token ? `Bearer ${token}` : "",
            },
          }
        );
        const data = await response.json();
        setSuggestions(data.locations || []);
        setIsOpen(data.locations?.length > 0);
      } catch (error) {
        console.error("Failed to fetch locations:", error);
        setSuggestions([]);
        setIsOpen(false);
      } finally {
        setIsLoading(false);
      }
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [searchTerm]);

  const selectLocation = (location) => {
    setSearchTerm(location);
    setSuggestions([]);
    setIsOpen(false);
  };

  const clearSearch = () => {
    setSearchTerm("");
    setSuggestions([]);
    setIsOpen(false);
  };

  return {
    searchTerm,
    setSearchTerm,
    suggestions,
    isLoading,
    isOpen,
    selectLocation,
    clearSearch,
  };
};

export default useLocationSearch;
