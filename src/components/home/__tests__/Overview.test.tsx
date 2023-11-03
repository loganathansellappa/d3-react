import { QueryClient, QueryClientProvider, UseQueryResult } from "react-query";
import { Overview } from "../Overview";
import { mockOverviewResponse, renderWithRouter } from "../../../utils/test";
import * as Hooks from "../../../hooks/customHooks";

describe("Overview", () => {
  let element: { container: HTMLElement };
  beforeEach(() => {
    jest.spyOn(Hooks, "useApi").mockReturnValue({
      data: mockOverviewResponse(),
      isError: false,
      isLoading: false,
      refetch: jest.fn(),
    } as unknown as UseQueryResult<unknown, unknown>);
    const queryClient = new QueryClient();
    element = renderWithRouter(
      <QueryClientProvider client={queryClient}>
        <Overview />
      </QueryClientProvider>,
    );
  });

  test("renders Overview component", () => {
    expect(element.container.firstChild).toMatchSnapshot();
  });

  test("displays response data and chart", () => {
    expect(element.container.textContent).toContain(
      "International Business Machines",
    );
    expect(element.container.textContent).toContain("Chart");
  });
});
