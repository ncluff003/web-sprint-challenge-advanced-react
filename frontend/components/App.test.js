import React from "react";
import { render, fireEvent, screen } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import AppFunctional from "./AppFunctional";

// Write your tests here
test("sanity", () => {
  expect(false).toBe(false);
});

test("Widget renders to the screen.", () => {
  render(<AppFunctional />);

  expect(AppFunctional).toBeInTheDocument;
});

test(`Steps increments for every move.`, async () => {
  render(<AppFunctional />);

  const stepsHeader = screen.getByText("You moved 0 times");
  const upButton = screen.getByText("UP");

  fireEvent.click(upButton);
  expect(stepsHeader).toHaveTextContent("You moved 1 time");
});

test(`Coordinates show appropriate x and y value with each move.`, async () => {
  render(<AppFunctional />);

  const coordinates = screen.getByText("Coordinates (2, 2)");
  const upButton = screen.getByText("UP");

  fireEvent.click(upButton);
  expect(coordinates).toHaveTextContent("Coordinates (2, 1)");
});

test("Input value equals example@email.com when it is typed in", () => {
  render(<AppFunctional />);

  const input = screen.getByPlaceholderText("type email");
  fireEvent.change(input, { target: { value: "example@email.com" } });

  expect(input).toHaveValue("example@email.com");
});

test("User cannot move beyond the edges of the grid.", () => {
  render(<AppFunctional />);

  const upButton = screen.getByText("UP");
  fireEvent.click(upButton);
  fireEvent.click(upButton);

  const message = document.querySelector("#message");
  expect(message).toHaveTextContent(`You can't go up`);
});
