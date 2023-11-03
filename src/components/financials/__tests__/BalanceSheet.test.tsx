import { BalanceSheet } from "../BalanceSheet";
import { render } from "@testing-library/react";
import { QueryClient, QueryClientProvider, UseQueryResult } from "react-query";
import * as Hooks from "../../../hooks/customHooks";
import { mockBalanceSheetResponse } from "../../../utils/test";

describe("BalanceSheet", () => {
  let element: { container: HTMLElement };
  beforeEach(() => {
    jest.spyOn(Hooks, "useApi").mockReturnValue({
      data: mockBalanceSheetResponse(),
      isError: false,
      isLoading: false,
      refetch: jest.fn(),
    } as unknown as UseQueryResult<unknown, unknown>);
    const queryClient = new QueryClient();

    element = render(
      <QueryClientProvider client={queryClient}>
        <BalanceSheet />
      </QueryClientProvider>,
    );
  });

  test("renders BalanceSheet component", () => {
    expect(element.container.firstChild).toMatchSnapshot();
  });

  test("displays BalanceSheet", async () => {
    await expect(element.container.textContent).toContain("Balance Sheet");
  });
});
