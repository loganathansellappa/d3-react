import { render } from "@testing-library/react";
import { QueryClient, QueryClientProvider, UseQueryResult } from "react-query";
import * as Hooks from "../../../hooks/customHooks";
import { mockIncomeStatementResponse } from "../../../utils/test";
import { IncomeStatement } from "../IncomeStatement";

describe("IncomeStatement", () => {
  let element: { container: HTMLElement };
  beforeEach(() => {
    jest.spyOn(Hooks, "useApi").mockReturnValue({
      data: mockIncomeStatementResponse(),
      isError: false,
      isLoading: false,
      refetch: jest.fn(),
    } as unknown as UseQueryResult<unknown, unknown>);
    const queryClient = new QueryClient();

    element = render(
      <QueryClientProvider client={queryClient}>
        <IncomeStatement />
      </QueryClientProvider>,
    );
  });

  test("renders BalanceSheet component", () => {
    expect(element.container.firstChild).toMatchSnapshot();
  });

  test("displays BalanceSheet", async () => {
    await expect(element.container.textContent).toContain("Income Statement");
  });
});
