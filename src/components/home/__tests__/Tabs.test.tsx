import { Tabs } from "../Tabs";
import { renderWithRouter } from "../../../utils/test";

describe("Tabs", () => {
  let element: { container: HTMLElement };
  beforeEach(() => (element = renderWithRouter(<Tabs />)));

  test("renders Tabs component", () => {
    expect(element.container.firstChild).toMatchSnapshot();
  });

  test("displays links", () => {
    expect(element.container.textContent).toContain("Overview");
    expect(element.container.getElementsByClassName("tab-link")!.length).toBe(
      4,
    );
  });
});
