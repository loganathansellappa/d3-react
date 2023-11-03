import App from "./App";
import { render } from "@testing-library/react";

let element: { container: HTMLElement };

test("renders App component", () => {
  element = render(<App />);
  expect(element.container.firstChild).toMatchSnapshot();
  expect(element.container.textContent).toContain("Overview");
});
