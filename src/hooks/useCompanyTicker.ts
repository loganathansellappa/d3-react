import { useLocation } from "react-router-dom";

export const useCompanyTicker = (): string => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const sym = searchParams.get("sym");
  return sym || "IBM"; // Provide the default value here
};
