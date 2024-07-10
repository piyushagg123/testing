import { useState, useEffect } from "react";
import { useTheme } from "@mui/material/styles";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import CircularProgress from "@mui/material/CircularProgress";
import axios from "axios";

const ITEM_HEIGHT = 30;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
    },
  },
};

function getStyles(value, selectedValues, theme) {
  return {
    fontWeight:
      selectedValues.indexOf(value) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  };
}

export default function MultipleSelect({
  label,
  apiEndpoint,
  maxSelection,
  onChange,
}) {
  const theme = useTheme();
  const [selectedValues, setSelectedValues] = useState([]);
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleChange = (event) => {
    const {
      target: { value },
    } = event;
    let newValue;
    if (typeof value === "string") {
      newValue = value.split(",");
    } else {
      newValue = value.length <= maxSelection ? value : selectedValues;
    }
    setSelectedValues(newValue);
    onChange(newValue);
  };

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const response = await axios.get(apiEndpoint);
        setOptions(response.data.data.value);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOptions();
  }, [apiEndpoint]);

  const selectedValuesWithIds = selectedValues.map((value) => {
    const option = options.find((option) => option.value === value);
    return { id: option.id, value: option.value };
  });

  selectedValuesWithIds.sort((a, b) => a.id - b.id);

  const sortedSelectedValues = selectedValuesWithIds.map((item) => item.value);

  return (
    <div>
      <FormControl sx={{ m: 1 }}>
        <InputLabel id={`multiple-select-label-${label}`}>{label}</InputLabel>
        <Select
          labelId={`multiple-select-label-${label}`}
          id={`multiple-select-${label}`}
          multiple
          value={selectedValues}
          onChange={handleChange}
          input={<OutlinedInput label={label} />}
          MenuProps={MenuProps}
          renderValue={(selected) => sortedSelectedValues.join(", ")}
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "210px",
            borderRadius: "5px",
            border: "solid 1px",
          }}
          size="small"
        >
          {loading ? (
            <MenuItem disabled>
              <CircularProgress size={24} />
            </MenuItem>
          ) : (
            options.map((option) => (
              <MenuItem
                key={option.id}
                value={option.value}
                style={getStyles(option.value, selectedValues, theme)}
                disabled={
                  selectedValues.length >= maxSelection &&
                  !selectedValues.includes(option.value)
                }
              >
                {option.value}
              </MenuItem>
            ))
          )}
        </Select>
      </FormControl>
    </div>
  );
}
