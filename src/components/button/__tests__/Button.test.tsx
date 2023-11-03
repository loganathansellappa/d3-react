import { fireEvent, render } from "@testing-library/react";
import { Button } from "../Button";

describe("Button", () => {
  let element: { container: HTMLElement };
  const buttonProps = {
    buttonOneClick: jest.fn(),
    buttonTwoClick: jest.fn(),
    labelOne: "labelOne",
    labelTwo: "labelTwo",
  };
  beforeEach(() => {
    element = render(<Button {...buttonProps} />);
  });

  test("renders Button component", () => {
    expect(element.container.firstChild).toMatchSnapshot();
  });

  test("displays button label", () => {
    expect(element.container.textContent).toContain("labelOne");
    expect(element.container.textContent).toContain("labelTwo");
  });

  test("handles button one click event", () => {
    const buttonOne = element.container.getElementsByClassName("button")[0];
    fireEvent.click(buttonOne);
    expect(buttonProps.buttonOneClick).toHaveBeenCalled();
  });

  test("handles button two click event", () => {
    const buttonTwo = element.container.getElementsByClassName("button")[1];
    fireEvent.click(buttonTwo);
    expect(buttonProps.buttonTwoClick).toHaveBeenCalled();
  });
});
