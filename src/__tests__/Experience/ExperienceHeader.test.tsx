import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { ExperienceHeader } from "../../components/Experience/ExperienceHeader";

describe("ExperienceHeader", () => {
  it("renders the title inside an h2 heading", () => {
    render(<ExperienceHeader title="Experiência" />);

    const heading = screen.getByRole("heading", { name: "Experiência" });

    expect(heading).toBeInTheDocument();
    expect(heading.tagName).toBe("H2");
  });

  it("keeps key layout/styling wrappers", () => {
    const { container } = render(<ExperienceHeader title="XP" />);

    const heading = screen.getByRole("heading", { name: "XP" });
    expect(heading).toHaveClass("text-2xl", "sm:text-3xl", "font-bold", "text-emerald-400", "p-1", "text-center");

    const outer = container.querySelector("div.flex.justify-center");
    expect(outer).not.toBeNull();
    
    const pill = container.querySelector("div.inline-block");
    expect(pill).not.toBeNull();
    expect(pill).toHaveClass("rounded-full");
  });
});
