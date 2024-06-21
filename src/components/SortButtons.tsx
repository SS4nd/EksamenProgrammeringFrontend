import React from "react";
import "./SortButtons.css";

interface SortButtonsProps {
  onSort: (key: string) => void;
}

const SortButtons: React.FC<SortButtonsProps> = ({ onSort }) => {
  const handleSort = (event: React.ChangeEvent<HTMLInputElement>) => {
    const key = event.target.value;
    onSort(key);
  };

  return (
    <div className="sort-buttons">
      <label>
        <input
          type="radio"
          name="sortOption"
          value="alder"
          onChange={handleSort}
        />
        <span>Youngest to Oldest</span>
      </label>
      <label>
        <input
          type="radio"
          name="sortOption"
          value="-alder"
          onChange={handleSort}
        />
        <span>Oldest to Youngest</span>
      </label>
      <label>
        <input
          type="radio"
          name="sortOption"
          value="gender"
          onChange={handleSort}
        />
        <span>Female</span>
      </label>
      <label>
        <input
          type="radio"
          name="sortOption"
          value="-gender"
          onChange={handleSort}
        />
        <span>Male</span>
      </label>
      <label>
        <input
          type="radio"
          name="sortOption"
          value="klub"
          onChange={handleSort}
        />
        <span>Club Alphabetical</span>
      </label>
      <label>
        <input
          type="radio"
          name="sortOption"
          value="-klub"
          onChange={handleSort}
        />
        <span>Reverse Club Alphabetical</span>
      </label>
    </div>
  );
};

export default SortButtons;
