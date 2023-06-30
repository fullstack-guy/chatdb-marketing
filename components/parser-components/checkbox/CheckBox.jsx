"use client";
import { useState } from "react";

const Checkbox = () => {
  const [isChecked, setIsChecked] = useState(true);

  const handleCheckboxChange = () => {
    setIsChecked(!isChecked);
  };

  return (
    <label className="flex items-center ">
      <input
        type="checkbox"
        checked={isChecked}
        onChange={handleCheckboxChange}
        className="form-checkbox h-5 w-5 text-indigo-600 transition duration-150 ease-in-out"
      />
      <span className="text-md ml-2">Limit to 100 rows</span>
    </label>
  );
};

export default Checkbox;
