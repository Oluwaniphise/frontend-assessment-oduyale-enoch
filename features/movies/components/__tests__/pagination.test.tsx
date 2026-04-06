import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Pagination } from "@/features/movies/components/pagination";

describe("Pagination", () => {
  it("renders visible page links and navigation controls", () => {
    render(
      <Pagination
        currentPage={3}
        totalPages={8}
        buildHref={(page) => `/?page=${page}`}
      />,
    );

    expect(screen.getByRole("link", { name: "Previous" })).toHaveAttribute("href", "/?page=2");
    expect(screen.getByRole("link", { name: "Next" })).toHaveAttribute("href", "/?page=4");
    expect(screen.getByRole("link", { name: "1" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "3" })).toHaveAttribute("aria-current", "page");
    expect(screen.getByRole("link", { name: "8" })).toBeInTheDocument();
  });

  it("returns null when only one page is available", () => {
    const { container } = render(
      <Pagination
        currentPage={1}
        totalPages={1}
        buildHref={(page) => `/?page=${page}`}
      />,
    );

    expect(container).toBeEmptyDOMElement();
  });
});
