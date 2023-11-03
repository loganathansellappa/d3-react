import { TimeSeriesDataType } from "../@types/zodSchema";
import { ChartDatum } from "../@types/ChartData";

export type ServerConfig = {
  baseUrl: string;
  apiKey: string;
};
export const serverData = () => {
  return {
    baseUrl: process.env.DATA_URL,
    apiKey: process.env.API_KEY,
  } as ServerConfig;
};

export const transformTimeSeriesDaily = (
  data: Record<string, TimeSeriesDataType>,
) => {
  const keyMapping: Record<string, string> = {
    "1. open": "open",
    "2. high": "high",
    "3. low": "low",
    "4. close": "Close",
    "5. volume": "volume",
  };

  const transformedData: Record<string, ChartDatum> = {};

  for (const date in data) {
    const innerObject = data[date] as Record<any, any>;

    const transformedInnerObject: ChartDatum = {} as ChartDatum;

    for (const oldKey in innerObject) {
      const newKey = keyMapping[oldKey as keyof typeof keyMapping];
      if (keyMapping[oldKey]) {
        innerObject[oldKey] = +innerObject[oldKey];
        transformedInnerObject[newKey as keyof ChartDatum] =
          innerObject[oldKey];
      } else {
        transformedInnerObject[newKey as keyof ChartDatum] =
          innerObject[oldKey];
      }
    }

    transformedData[date] = transformedInnerObject;
  }
  return transformedData;
};
