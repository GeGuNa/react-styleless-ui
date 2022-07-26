// Cherry picked from https://github.com/mantinedev/mantine/blob/master/src/mantine-tests/src/it-supports-style.tsx

import * as React from "react";
import { render } from ".";

const itSupportsStyle = <T,>(
  Component: React.ComponentType<T>,
  requiredProps: T,
  selector?: string
): void => {
  it("supports style prop", () => {
    const getTarget = (container: HTMLElement): HTMLElement =>
      selector
        ? (container.querySelector(selector) as HTMLElement)
        : (container.firstChild as HTMLElement);

    const style = { border: "1px solid red", backgroundColor: "black" };

    const { container } = render(
      <Component {...requiredProps} style={style} />
    );

    expect(getTarget(container)).toHaveStyle(style);
  });
};

export default itSupportsStyle;
