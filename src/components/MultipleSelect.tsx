import { useEffect, useState } from "react";
import { useTheme } from "@mui/material/styles";
import OutlinedInput from "@mui/material/OutlinedInput";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import CircularProgress from "@mui/material/CircularProgress";
import { useQuery } from "react-query";
import axios from "axios";
import { Checkbox } from "@mui/material";
import constants from "../constants";

const ITEM_HEIGHT = 30;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
    },
  },
};

function getStyles(value: string, selectedValues: string[], theme: any) {
  return {
    fontWeight:
      selectedValues.indexOf(value) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  };
}

const fetchOptions = async (apiEndpoint: string) => {
  const response = await axios.get(apiEndpoint);
  console.log(response.data.data);

  return response.data.data.value
    ? response.data.data.value
    : response.data.data;
};

interface MultipleSelectProps {
  apiEndpoint: string;
  maxSelection: number;
  selectedValue?: string[];
  onChange: (selectedValues: string[]) => void;
}

export default function MultipleSelect({
  apiEndpoint,
  maxSelection,
  selectedValue: initialSelectedValues = [],
  onChange,
}: MultipleSelectProps) {
  const theme = useTheme();
  const [selectedValues, setSelectedValues] = useState<string[]>([]);

  const { data: options = [], isLoading } = useQuery(
    ["options", apiEndpoint],
    () => fetchOptions(apiEndpoint)
  );

  useEffect(() => {
    setSelectedValues(initialSelectedValues);
  }, []);

  const handleChange = (event: SelectChangeEvent<string[]>) => {
    const {
      target: { value },
    } = event;
    let newValue;
    if (typeof value === "string") {
      newValue = value.split(",");
    } else {
      newValue =
        (value as string[]).length <= maxSelection
          ? (value as string[])
          : selectedValues;
    }
    setSelectedValues(newValue);
    onChange(newValue);
  };

  const selectedValuesWithIds = selectedValues.map((value) => {
    const option = options.find((option: any) => option.value === value);
    return { id: option.id, value: option.value };
  });

  selectedValuesWithIds.sort((a, b) => a.id - b.id);

  const sortedSelectedValues = selectedValuesWithIds.map((item) => item.value);

  return (
    <div className="w-[226px] h-[57px] flex justify-center">
      <FormControl>
        <Select
          multiple
          value={selectedValues}
          onChange={handleChange}
          input={<OutlinedInput />}
          MenuProps={MenuProps}
          renderValue={() => sortedSelectedValues.join(", ")}
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "208px",
            borderRadius: "5px",
            border: "solid 1px",
          }}
          size="small"
        >
          {isLoading ? (
            <MenuItem disabled>
              <CircularProgress size={24} />
            </MenuItem>
          ) : (
            options.map((option: any) => (
              <MenuItem
                key={option.id}
                value={option.value}
                style={getStyles(option.value, selectedValues, theme)}
                sx={{
                  wordWrap: "break-word",
                  whiteSpace: "normal",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
                disabled={
                  selectedValues.length >= maxSelection &&
                  !selectedValues.includes(option.value)
                }
              >
                <Checkbox checked={selectedValues.includes(option.value)} />
                {option.value === "DESIGN"
                  ? constants.DESIGN
                  : option.value === "MATERIAL_SUPPORT"
                  ? constants.MATERIAL_SUPPORT
                  : option.value === "COMPLETE"
                  ? constants.COMPLETE
                  : option.value}
              </MenuItem>
            ))
          )}
        </Select>
      </FormControl>
    </div>
  );
}
