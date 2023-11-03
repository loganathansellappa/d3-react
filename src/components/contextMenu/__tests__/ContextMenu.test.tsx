import { ContextMenu, ContextMenuProps } from "../ContextMenu";
import { renderWithRouter } from "../../../utils/test";

describe("ContextMenu", () => {
  let element: { container: HTMLElement };
  beforeEach(() => {
    const props: ContextMenuProps = {
      showMenu: true,
      position: { top: 0, left: 0 },
      options: [
        { label: "NameOne", to: "/ValueOne" },
        { label: "NameTwo", to: "/ValueTwo" },
      ],
    };
    element = renderWithRouter(<ContextMenu {...props} />);
  });

  test("renders ContextMenu component", () => {
    expect(element.container.firstChild).toMatchSnapshot();
  });

  test("displays menu options", () => {
    expect(element.container.textContent).toContain("NameOne");
    expect(
      element.container.getElementsByClassName("context-menu-item")!.length,
    ).toBe(2);
  });
});
