import { transformTimeSeriesDaily, serverData } from '../HelperUtils';

describe('HelperUtils', () => {
    describe('serverData', () => {
        const OLD_ENV = process.env;
        const env = {
            DATA_URL: 'https://example.com',
            API_KEY: 'api-key'
        };

        beforeEach(() => {
            jest.resetModules();
            process.env = {...OLD_ENV, ...env};
        });

        it('#apiService should return base url', () => {
            expect(serverData().baseUrl).toEqual(env.DATA_URL);
        });
    });

    describe("transformTimeSeriesDaily", () => {
        it("transforms data correctly", () => {
            const testData = {
                "2023-01-01": {
                    "1. open": "100.0",
                    "2. high": "120.0",
                    "3. low": "90.0",
                    "4. close": "110.0",
                    "5. volume": "1000",
                },
            };

            const transformedData = transformTimeSeriesDaily(testData);

            expect(transformedData).toEqual({
                "2023-01-01": {
                    open: 100.0,
                    high: 120.0,
                    low: 90.0,
                    Close: 110.0,
                    volume: 1000,
                },
            });
        });
    });

});

