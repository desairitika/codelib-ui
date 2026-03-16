import React from "react";
import { render, fireEvent } from "@testing-library/react";
import StatsCard from "./StatsCard";

describe("StatsCard component", () => {
  it("renders title, count and handles click", () => {
    const handleClick = jest.fn();
    const { getByText, getByRole } = render(
      <StatsCard title="Test" count={42} icon={<span>icon</span>} color="#123456" onClick={handleClick} />
    );

    expect(getByText("Test")).toBeInTheDocument();
    expect(getByText("42")).toBeInTheDocument();

    fireEvent.click(getByRole("button"));
    expect(handleClick).toHaveBeenCalled();
  });
});
