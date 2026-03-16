import { useEffect, useRef } from "react";
import { getConstants } from "../services/constantService";
import { updateConstants } from "../utils/constants.jsx";

export function useConstants() {
  const hasFetchedConstants = useRef(false);

  useEffect(() => {
    async function fetchConstants() {
      if (!hasFetchedConstants.current) {
        try {
          const res = await getConstants();
          updateConstants(res.data);
          hasFetchedConstants.current = true;
        } catch (err) {
          console.error(err);
        }
      }
    }
    fetchConstants();
  }, []);
}
