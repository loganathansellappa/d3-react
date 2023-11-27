# React + TypeScript + D3JS

### Tasks
- Create an overview of the IBM stock and financial data in a tabbed environment.

- You can use Yahoo Finance’s layout as a template for “Chart”, “Income Statement”, and “Balance sheet”. The data sources are:

  - https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=IBM&apikey=demo
  - https://www.alphavantage.co/query?function=INCOME_STATEMENT&symbol=IBM&apikey=demo
  - https://www.alphavantage.co/query?function=BALANCE_SHEET&symbol=IBM&apikey=demo

- For the Chart use the library d3.js
- Use css or sass modules but do not use third party css frameworks
- Write at least one test suite for a simple component of your choice.
- App has context menu
--------------------------------------------------------------------------------------------------------------------------------------------------------
# The React+Typescript Demo App


## Available Features

| Feature                                                   |
|-----------------------------------------------------------|
| List Company Summary                                      |
| List Balance Sheet                                        |
| List Income Statement                                     |
| Display Daily data in Area & Candle chart with Tooltip    |
| Area Chart with dynamic Tooltip   position based on hover |
| Candle Chart with fixed Tooltip position                  |
| Context Menu on whole app, to navigate to any pages       |


## Api Used
-  `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=IBM&apikey=demo`
-  `https://www.alphavantage.co/query?function=INCOME_STATEMENT&symbol=IBM&apikey=demo`
-  `https://www.alphavantage.co/query?function=BALANCE_SHEET&symbol=IBM&apikey=demo`
-  `https://www.alphavantage.co/query?function=OVERVIEW&symbol=IBM&apikey=demo`

## Tech

- Node
- Yarn 
- React 
- Typescript 
- Vite
- Jest 
- D3Js

## Installation

Install the dependencies and devDependencies and start the server.

```sh
cd ibm-data
yarn install
yarn dev
```


## Run Tests
```sh
cd ibm-data
yarn test
```

## Demo
[Demo Video](./DemoVideo/DemoVideo.mp4)

