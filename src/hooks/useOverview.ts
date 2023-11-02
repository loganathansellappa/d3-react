import axios from 'axios';
import { useQuery } from 'react-query';
import {
    NormalizedCompanySchema,
    BalanceSheetSchema,
    IncomeStatementSchema,
    ApiLimitSchema,
    TimeSeriesDailySchema, TimeSeriesDataType
} from "../@types/zodSchema";
import {z} from "zod";

const TransformedTimeSeriesDailySchema = TimeSeriesDailySchema.transform(
    (data) => transformTimeSeriesDaily(data["Time Series (Daily)"]),
    (data) => data
);
const fetchData = async (fn: string = 'OVERVIEW') => {

    const response = await axios.get(
        `https://www.alphavantage.co/query?function=${fn}&symbol=IBM&apikey=demo`
    );
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


/*
    Added default value, we can extend this hook with any symbol
 */

export function useApi(fn: string = 'OVERVIEW') {
    return useQuery({
        queryKey: fn,
        queryFn: () => fetchData(fn),
    });
}

const transformTimeSeriesDaily = (data: Record<string, TimeSeriesDataType>) => {

    const keyMapping: Record<string, string> = {
        '1. open': 'open',
        '2. high': 'high',
        '3. low': 'low',
        '4. close': 'close',
        '5. volume': 'volume',
    };

    const transformedData: Record<string, Record<string, string>> = {};

    for (const date in data) {

        const innerObject = data[date];
        const transformedInnerObject: Record<string, string> = {};

        for (const oldKey in innerObject) {
            if (keyMapping[oldKey]) {
                innerObject[oldKey] = +innerObject[oldKey];
                transformedInnerObject[keyMapping[oldKey]] = innerObject[oldKey];
            } else {
                transformedInnerObject[oldKey] = innerObject[oldKey];
            }
        }

        transformedData[date] = transformedInnerObject;
    }

    return transformedData;
};

