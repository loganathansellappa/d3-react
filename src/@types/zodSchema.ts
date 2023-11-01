import {string, z} from 'zod';

// Add a comment to this line
export const NormalizedCompanySchema = z.object({
    Symbol: z.string(),
    Name: z.string(),
    Description: z.string(),
    Exchange: z.string(),
    Currency: z.string(),
    Country: z.string(),
    Sector: z.string(),
    Industry: z.string(),
    FiscalYearEnd: z.string(),
    LatestQuarter: z.string(),
    EBITDA: z.string(),
    PERatio: z.string(),
    DividendPerShare: z.string(),
    DividendYield: z.string(),
    EPS: z.string(),
    RevenuePerShareTTM: z.string(),
    ProfitMargin: z.string(),
    OperatingMarginTTM: z.string(),
    ReturnOnAssetsTTM: z.string(),
    ReturnOnEquityTTM: z.string(),
    RevenueTTM: z.string(),
    GrossProfitTTM: z.string(),
    DilutedEPSTTM: z.string(),
    QuarterlyEarningsGrowthYOY: z.string(),
    QuarterlyRevenueGrowthYOY: z.string(),
    PriceToSalesRatioTTM: z.string(),
    PriceToBookRatio: z.string(),
    Beta: z.string(),
    ['52WeekHigh']: z.string(),
    ['52WeekLow']: z.string(),
    ['50DayMovingAverage']: z.string(),
    ['200DayMovingAverage']: z.string(),
    SharesOutstanding: z.string(),
    DividendDate: z.string(),
    ExDividendDate: z.string(),
});

const AnnualReportSchema = z.object({
    fiscalDateEnding: z.string(),
    reportedCurrency: z.string(),
    totalAssets: z.string(),
    totalCurrentAssets: z.string(),
    cashAndCashEquivalentsAtCarryingValue: z.string(),
    cashAndShortTermInvestments: z.string(),
    inventory: z.string(),
    currentNetReceivables: z.string(),
    totalNonCurrentAssets: z.string(),
    propertyPlantEquipment: z.string(),
    accumulatedDepreciationAmortizationPPE: z.string(),
    intangibleAssets: z.string(),
    intangibleAssetsExcludingGoodwill: z.string(),
    goodwill: z.string(),
    investments: z.string(),
    longTermInvestments: z.string(),
    shortTermInvestments: z.string(),
    otherCurrentAssets: z.string(),
    otherNonCurrentAssets: z.string(),
    totalLiabilities: z.string(),
    totalCurrentLiabilities: z.string(),
    currentAccountsPayable: z.string(),
    deferredRevenue: z.string(),
    currentDebt: z.string(),
    shortTermDebt: z.string(),
    totalNonCurrentLiabilities: z.string(),
    capitalLeaseObligations: z.string(),
    longTermDebt: z.string(),
    currentLongTermDebt: z.string(),
    longTermDebtNoncurrent: z.string(),
    shortLongTermDebtTotal: z.string(),
    otherCurrentLiabilities: z.string(),
    otherNonCurrentLiabilities: z.string(),
    totalShareholderEquity: z.string(),
    treasuryStock: z.string(),
    retainedEarnings: z.string(),
    commonStock: z.string(),
    commonStockSharesOutstanding: z.string(),
});

export const BalanceSheetSchema = z.object({
    symbol: z.string(),
    annualReports: z.array(AnnualReportSchema),
    quarterlyReports: z.array(AnnualReportSchema),
});

export const CashFlowSchema = z.object({
    fiscalDateEnding: z.string(),
    reportedCurrency: z.string(),
    grossProfit: z.string(),
    totalRevenue: z.string(),
    costOfRevenue: z.string(),
    costofGoodsAndServicesSold: z.string(),
    operatingIncome: z.string(),
    sellingGeneralAndAdministrative: z.string(),
    researchAndDevelopment: z.string(),
    operatingExpenses: z.string(),
    investmentIncomeNet: z.string(),
    netInterestIncome: z.string(),
    interestIncome: z.string(),
    interestExpense: z.string(),
    nonInterestIncome: z.string(),
    otherNonOperatingIncome: z.string(),
    depreciation: z.string(),
    depreciationAndAmortization: z.string(),
    incomeBeforeTax: z.string(),
    incomeTaxExpense: z.string(),
    interestAndDebtExpense: z.string(),
    netIncomeFromContinuingOperations: z.string(),
    comprehensiveIncomeNetOfTax: z.string(),
    ebit: z.string(),
    ebitda: z.string(),
    netIncome: z.string(),
});
export const IncomeStatementSchema = z.object({
    symbol: z.string(),
    annualReports: z.array(CashFlowSchema),
    quarterlyReports: z.array(CashFlowSchema),
});

export const ApiLimitSchema = z.object({
    Information: z.string()
});


const timeSeriesItemSchema = z.object(
        {        "1. open": z.string(),
                        "2. high": z.string(),
                        "3. low": z.string(),
                        "4. close": z.string(),
                        "5. volume": z.string(),
});

const metaDataSchema =  z.object({
        '1. Information': string(),
        '2. Symbol': string(),
        '3. Last Refreshed': string(),
        '4. Output Size': string(),
        '5. Time Zone': string(),
    })

const timeSeriesDailySchema = z.record(string(), timeSeriesItemSchema)

export const TimeSeriesDailySchema = z.object({
    'Meta Data': metaDataSchema,
    'Time Series (Daily)': timeSeriesDailySchema,
});


export type AnnualReportType = z.infer<typeof AnnualReportSchema>;
export type TimeSeriesDailyType = z.infer<typeof TimeSeriesDailySchema>;
export type TimeSeriesDataType = z.infer<typeof timeSeriesItemSchema>;
export type CashFlowType = z.infer<typeof CashFlowSchema>;
export type IncomeStatementType = z.infer<typeof IncomeStatementSchema>;
export type BalanceSheetSchemaType = z.infer<typeof BalanceSheetSchema>;