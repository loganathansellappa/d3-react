import { renderWithRouter } from "../../../utils/test";
import {
  ContextMenuProvider,
  ContextMenuProviderProps,
} from "../ContextMenuProvider";
import { fireEvent } from "@testing-library/react";

describe("ContextMenuProvider", () => {
  let element: { container: HTMLElement };
  beforeEach(() => {
    const props: ContextMenuProviderProps = {
      children: <div className="child-element">Child Element</div>,
    };
    element = renderWithRouter(<ContextMenuProvider {...props} />);
  });

  test("renders ContextMenuProvider component", () => {
    expect(element.container.firstChild).toMatchSnapshot();
    expect(element.container.textContent).toContain("Child Element");
  });

  test("displays menu on click", () => {
    const childElement =
      element.container.getElementsByClassName("child-element")[0];
    expect(
      element.container.getElementsByClassName("context-menu-item")!.length,
    ).toBe(0);
    fireEvent.contextMenu(childElement);
  });
});
