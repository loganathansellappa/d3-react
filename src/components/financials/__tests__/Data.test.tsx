import { render } from "@testing-library/react";
import { QueryClient, QueryClientProvider, UseQueryResult } from "react-query";
import * as Hooks from "../../../hooks/customHooks";
import { mockIncomeStatementResponse } from "../../../utils/test";
import { DataComponent } from "../Data";

const props = {
  dataKey: "INCOME_STATEMENT",
  title: "Income Statement",
};
const queryClient = new QueryClient();
const mockResponse = {
  data: mockIncomeStatementResponse(),
  isError: false,
  isLoading: false,
  refetch: jest.fn(),
};

describe("Data", () => {
  let element: { container: HTMLElement };
  beforeEach(() => {
    jest
      .spyOn(Hooks, "useApi")
      .mockReturnValue(
        mockResponse as unknown as UseQueryResult<unknown, unknown>,
      );
    element = render(
      <QueryClientProvider client={queryClient}>
        <DataComponent {...props} />
      </QueryClientProvider>,
    );
  });

  test("renders Data component", () => {
    expect(element.container.firstChild).toMatchSnapshot();
  });

  test("displays Income Statement Data", async () => {
    await expect(element.container.textContent).toContain("Income Statement");
  });

  test("displays Error meesage when data is not present", async () => {
    jest.spyOn(Hooks, "useApi").mockReturnValue({
      ...mockResponse,
      isError: true,
      error: new Error("Error fetching data"),
    } as unknown as UseQueryResult<unknown, unknown>);
    element = render(
      <QueryClientProvider client={queryClient}>
        <DataComponent {...props} />
      </QueryClientProvider>,
    );

    await expect(element.container.textContent).toContain(
      "Error fetching data",
    );
  });

  test("displays loader when data is loading", async () => {
    jest.spyOn(Hooks, "useApi").mockReturnValue({
      ...mockResponse,
      isLoading: true,
    } as unknown as UseQueryResult<unknown, unknown>);
    element = render(
      <QueryClientProvider client={queryClient}>
        <DataComponent {...props} />
      </QueryClientProvider>,
    );
    await expect(
      element.container.querySelector(".spinner-container"),
    ).toBeTruthy();
  });
});
