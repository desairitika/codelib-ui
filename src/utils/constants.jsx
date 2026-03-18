import { MdDataArray } from "react-icons/md";
import { AiOutlineFieldString } from "react-icons/ai";
import { LuListEnd } from "react-icons/lu";
import { RiStackLine } from "react-icons/ri";
import { BsCollection } from "react-icons/bs";
import { TbBinaryTree } from "react-icons/tb";
import { GrGraphQl } from "react-icons/gr";
import { MdDynamicFeed } from "react-icons/md";
import { LiaSlackHash } from "react-icons/lia";
import { FaCode } from "react-icons/fa";
import { MdOutlineQueue } from "react-icons/md";

export const updateConstants = (data) => {
  const updatedCategories = [];

  data.forEach((constant) => {
    if (constant.type === "category") {
      if (!Object.prototype.hasOwnProperty.call(categoryMap, constant.value)) {
        categoryMap[constant.value] = constant.label;
        const category = {
          value: constant.value,
          label: constant.label,
          icon: constant.icon || "FaCode",
          count: constant.count || 0,
        };
        updatedCategories.push(category);
        CATEGORIES.push(category);
      }
    }
  });

  return updatedCategories;
};


export const CATEGORIES = [];
export const categoryMap = {};

export const iconMap = {
  MdDataArray: <MdDataArray />,
  AiOutlineFieldString: <AiOutlineFieldString />,
  LuListEnd: <LuListEnd />,
  RiStackLine: <RiStackLine />,
  BsCollection: <BsCollection />,
  TbBinaryTree: <TbBinaryTree />,
  GrGraphQl: <GrGraphQl />,
  MdDynamicFeed: <MdDynamicFeed />,
  LiaSlackHash: <LiaSlackHash />,
  FaCode: <FaCode />,
  MdOutlineQueue: <MdOutlineQueue />,
};

// provide a default palette for category cards; this is used by the carousel component
// and will gracefully fall back to a rotating array if a value is missing.
export const categoryColorMap = {
  array: "#0984E3",
  string: "#6C5CE7",
  linkedlist: "#00B894",
  stack: "#FD79A8",
  queue: "#74B9FF",
  tree: "#ff7675",
  default: "#007bff",
};

export const DIFFICULTIES = [
  { value: "", label: "Select Difficulty" },
  { value: "easy", label: "Easy" },
  { value: "medium", label: "Medium" },
  { value: "hard", label: "Hard" },
];

export const difficultyColorMap = {
  easy: "rgb(0 184 163)",
  medium: "rgb(255 192 30)",
  hard: "rgb(255 55 95)",
};

export const STATUSES = [
  { value: "", label: "Select Status" },
  { value: "solved", label: "Solved" },
  { value: "unsolved", label: "Unsolved" },
];

export const OWNERSHIP = [
  { value: "", label: "Select Owner" },
  { value: "all", label: "All" },
  { value: "owned", label: "Owned" },
  { value: "unowned", label: "Un-Owned" },
];

export const difficultyMap = {
  easy: "Easy",
  medium: "Medium",
  hard: "Hard",
};

export const statusesMap = {
  solved: "Solved",
  unsolved: "Unsolved",
};

export const ownershipMap = {
  owned: "Owned",
  unowned: "Un-Owned",
};
