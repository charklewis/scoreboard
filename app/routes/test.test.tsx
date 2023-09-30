import { expect, test } from "bun:test";
import { Button } from "./button";
import { render, screen } from "@testing-library/react";

test("this test passes", () => {
  expect(true).toBe(true);
});

test("button loads", () => {
  render(<Button />);
  screen.getByText(/click me/i);
});
