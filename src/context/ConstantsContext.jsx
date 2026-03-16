// context/ConstantsContext.jsx
import { createContext, useContext, useState, useEffect, useRef } from "react";
import { getConstants } from "../services/constantService";
import { updateConstants } from "../utils/constants";

export const ConstantsContext = createContext();

export const ConstantsProvider = ({ children }) => {
  const [categories, setCategories] = useState([]);
  const hasFetchedConstants = useRef(false);

  useEffect(() => {
    const fetchConstants = async () => {
      if (!hasFetchedConstants.current) {
        try {
          const res = await getConstants();
          const updated = updateConstants(res.data);
          setCategories([...updated]); // << returning updated categories from `updateConstants`
          hasFetchedConstants.current = true;
        } catch (err) {
          console.error("Error fetching constants:", err);
        }
      }
    };

    fetchConstants();
  }, []);

  return (
    <ConstantsContext.Provider value={{ categories }}>
      {children}
    </ConstantsContext.Provider>
  );
};

export const useConstantsContext = () => useContext(ConstantsContext);
