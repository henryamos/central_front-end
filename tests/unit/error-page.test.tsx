// @vitest-environment jsdom
import "../setup";
import { fireEvent, render, screen } from "@testing-library/react";
import { expect, it, vi } from "vitest";
import ErrorPage from "@/app/error";

it("offers recovery without displaying internal error details", () => {
  const reset = vi.fn();
  render(
    <ErrorPage
      error={new Error("Internal private diagnostic")}
      reset={reset}
    />,
  );

  expect(
    screen.getByRole("heading", { name: "Something went wrong" }),
  ).toBeVisible();
  expect(
    screen.queryByText("Internal private diagnostic"),
  ).not.toBeInTheDocument();
  fireEvent.click(screen.getByRole("button", { name: "Try again" }));
  expect(reset).toHaveBeenCalledOnce();
});
