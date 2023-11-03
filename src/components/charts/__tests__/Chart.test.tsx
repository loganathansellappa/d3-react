import { QueryClient, QueryClientProvider, UseQueryResult } from "react-query";
import { mockDailyData, renderWithRouter } from "../../../utils/test";
import * as Hooks from "../../../hooks/customHooks";
import { Chart } from "../Chart";
import { fireEvent } from "@testing-library/react";

describe("Chart", () => {
  let element: { container: HTMLElement };
  beforeEach(() => {
    jest.spyOn(Hooks, "useApi").mockReturnValue({
      data: mockDailyData(),
      isError: false,
      isLoading: false,
      refetch: jest.fn(),
    } as unknown as UseQueryResult<unknown, unknown>);
    const queryClient = new QueryClient();
    element = renderWithRouter(
      <QueryClientProvider client={queryClient}>
        <Chart />
      </QueryClientProvider>,
    );
  });

  test("renders Overview component", () => {
    expect(element.container.firstChild).toMatchSnapshot();
  });

  test("displays area chart", () => {
    expect(element.container.textContent).toContain("Area");
  });

  test("displays area chart by default", () => {
    const buttonOne =
      element.container.getElementsByClassName("button-active")[0];
    expect(buttonOne.textContent).toContain("Area");
  });

  test("displays candle chart when clicking button", () => {
    const button = element.container.getElementsByClassName("button")[1];
    fireEvent.click(button);
    const buttonTwo = element.container.getElementsByClassName("button")[1];
    expect(buttonTwo.textContent).toContain("Candle");
  });

  test("displays svg", () => {
    const chart = element.container.getElementsByTagName("svg")[0];
    expect(chart).toBeTruthy();
  });
});
