import { useState } from "react";

interface CheckboxProps {
  options: string[];
  onChange: (selectedOptions: string) => void;
}

const Checkbox: React.FC<CheckboxProps> = ({ options, onChange }) => {
  const [selectedOptions, setSelectedOptions] = useState("");

  const handleCheckboxChange = (option: string) => {
    let updatedOptionsArray = selectedOptions ? selectedOptions.split(",") : [];

    const formattedOption = option.split(" ").join("_");

    if (updatedOptionsArray.includes(formattedOption)) {
      updatedOptionsArray = updatedOptionsArray.filter(
        (opt) => opt !== formattedOption
      );
    } else {
      updatedOptionsArray.push(formattedOption);
    }

    const updatedOptions = updatedOptionsArray.join(",");
    setSelectedOptions(updatedOptions);
    onChange(updatedOptions);
  };

  return (
    <div className="flex flex-col gap-1">
      {options.map((option: string) => (
        <label key={option}>
          <input
            type="checkbox"
            value={option}
            checked={selectedOptions
              .split(",")
              .includes(option.split(" ").join("_"))}
            onChange={() => handleCheckboxChange(option)}
            className="mr-3"
          />
          {option}
        </label>
      ))}
    </div>
  );
};

export default Checkbox;
