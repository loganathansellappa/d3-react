import axios from "axios";
import { useQuery } from "react-query";
import {
  NormalizedCompanySchema,
  BalanceSheetSchema,
  IncomeStatementSchema,
  ApiLimitSchema,
  TimeSeriesDailySchema,
} from "../@types/zodSchema";
import { z } from "zod";
import {serverData, transformTimeSeriesDaily} from "../utils/HelperUtils";

const TransformedTimeSeriesDailySchema = TimeSeriesDailySchema.transform(
  (data) => transformTimeSeriesDaily(data["Time Series (Daily)"]),
);
const fetchData = async (fn: string = "OVERVIEW") => {
  const url = `${serverData().baseUrl}?function=${fn}&symbol=IBM&apikey=${
    serverData().apiKey
  }`;
  const response = await axios.get(url);
  const schemaMap: Record<string, z.Schema<unknown>> = {
    OVERVIEW: NormalizedCompanySchema,
    BALANCE_SHEET: BalanceSheetSchema,
    INCOME_STATEMENT: IncomeStatementSchema,
    TIME_SERIES_DAILY: TransformedTimeSeriesDailySchema,
    LIMIT_EXCEEDED: ApiLimitSchema,
    // Add more functions and schemas as needed
  };
  if (response.data.Information) {
    throw new Error(response.data.Information);
  }
  return schemaMap[fn].parse(response.data);
};

export function useApi(fn: string = "OVERVIEW") {
  return useQuery({
    queryKey: fn,
    queryFn: () => fetchData(fn),
  });
}


