import { render } from "@testing-library/react";
import { KeyValueTable } from "../KeyValueTable";

describe("KeyValueTable", () => {
  let element: { container: HTMLElement };
  beforeEach(() => {
    const props = {
      data: [
        { name: "NameOne", value: "ValueOne" },
        { name: "NameTwo", value: "ValueTwo" },
      ],
      headers: ["Name", "Value"],
    };
    element = render(<KeyValueTable {...props} />);
  });

  test("renders KeyValueTable component", () => {
    expect(element.container.firstChild).toMatchSnapshot();
  });

  test("displays tables with data", () => {
    expect(element.container.textContent).toContain("NameOne");
    expect(element.container.textContent).toContain("NameTwo");
  });
});
