import OverviewContextMenu from "../OverviewContextMenu";
import { renderWithRouter } from "../../../utils/test";

describe("OverviewContextMenu", () => {
  let element: { container: HTMLElement };
  beforeEach(() => {
    element = renderWithRouter(<OverviewContextMenu />);
  });

  test("renders Button component", () => {
    expect(element.container.firstChild).toMatchSnapshot();
  });

  test("displays button label", () => {
    expect(element.container.textContent).toContain(
      "Balance SheetIncome Statement",
    );
  });
});
