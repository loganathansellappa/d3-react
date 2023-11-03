import { render } from "@testing-library/react";
import LoadingSpinner from "../LoadingSpinner";

describe("LoadingSpinner", () => {
  let element: { container: HTMLElement };
  beforeEach(() => {
    element = render(<LoadingSpinner />);
  });

  test("renders KeyValueTable component", () => {
    expect(element.container.firstChild).toMatchSnapshot();
  });
});
