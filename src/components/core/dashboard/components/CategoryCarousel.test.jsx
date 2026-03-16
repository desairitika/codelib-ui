import React from "react";
import { render, fireEvent } from "@testing-library/react";
import CategoryCarousel from "./CategoryCarousel";

// mock react-slick so tests don't depend on its implementation
jest.mock("react-slick", () => ({ children }) => {
  return <div data-testid="mock-slider">{children}</div>;
});

const dummyCategories = [
  { value: "array", label: "Array", icon: "MdDataArray" },
  { value: "string", label: "String", icon: "AiOutlineFieldString" },
];
const dummyStats = { categoryCounts: { array: 3, string: 5 } };
const dummyIconMap = { MdDataArray: <span>arr</span>, AiOutlineFieldString: <span>str</span> };

describe("CategoryCarousel component", () => {
  it("renders category cards and view all button", () => {
    const handleClick = jest.fn();
    const { getByText, getAllByRole } = render(
      <CategoryCarousel
        categories={dummyCategories}
        stats={dummyStats}
        iconMap={dummyIconMap}
        onCategoryClick={handleClick}
      />
    );

    // verify category labels
    expect(getByText("Array")).toBeInTheDocument();
    expect(getByText("String")).toBeInTheDocument();

    // verify counts
    expect(getByText("3")).toBeInTheDocument();
    expect(getByText("5")).toBeInTheDocument();

    // verify view all button
    expect(getByText(/view all/i)).toBeInTheDocument();

    // simulate clicking a card
    const cards = getAllByRole("button");
    fireEvent.click(cards[0]);
    expect(handleClick).toHaveBeenCalledWith({ category: "array" });

    // click view all (last button)
    fireEvent.click(cards[cards.length - 1]);
    expect(handleClick).toHaveBeenCalledWith({});
  });
});
