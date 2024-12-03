import { FormEvent, useContext, useState } from "react";
import { MultipleSelect, ProjectImages } from "./index";
import {
  TextField,
  Autocomplete,
  CircularProgress,
  Alert,
  Button,
} from "@mui/material";
import constants from "../constants";
import spacesData from "./Spaces";
import { LoadingButton } from "@mui/lab";
import { StateContext } from "../context";
import { fetchCities } from "../controllers/StateController";
import { AddProject } from "../controllers/interior-designers/AddAProjectController";

interface AddAProjectProps {
  setProjectId: (id: number) => void;
  projectId: number;
}

interface FormData {
  sub_category_1: string[];
  sub_category_2: string[];
  sub_category_3: string[];
  city: string;
  state: string;
}
const AddAProject: React.FC<AddAProjectProps> = ({
  setProjectId,
  projectId,
}) => {
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [cities, setCities] = useState<string[]>([]);
  const [loadingCities, setLoadingCities] = useState<boolean>(false);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [selectedSubCategories, setSelectedSubCategories] = useState<string[]>(
    []
  );
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const nextStep = () => {
    if (currentStep === 1) {
      if (!title) {
        setError("Please enter a title");
        return;
      }
      if (!startDate) {
        setError("Please enter a starting date of project");
        return;
      }
      if (!endDate) {
        setError("Please enter a ending date of project");
        return;
      }
      if (!description) {
        setError("Please enter a description about the project");
        return;
      }
    }
    setCurrentStep((prevStep) => prevStep + 1);
    setError("");
  };
  const prevStep = () => setCurrentStep((prevStep) => prevStep - 1);

  const [formData, setFormData] = useState<FormData>({
    sub_category_1: [],
    sub_category_2: [],
    sub_category_3: [],
    city: "",
    state: "",
  });

  const stateContext = useContext(StateContext);

  if (stateContext === undefined) {
    return;
  }
  const { state } = stateContext;

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const processedFormData = {
      ...formData,
      title,
      description,
      start_date: startDate,
      end_date: endDate,
      sub_category_1: formData.sub_category_1.join(","),
      sub_category_2: formData.sub_category_2.join(","),
      sub_category_3: formData.sub_category_3.join(","),
      category: "INTERIOR_DESIGNER",
    };
    if (!processedFormData.sub_category_1) {
      setError("Please select the theme of the project");
      return;
    }
    if (!processedFormData.sub_category_2) {
      setError("Please select the spaces");
      return;
    }
    if (!processedFormData.sub_category_3) {
      setError("Please select the execution type");
      return;
    }
    if (!processedFormData.state) {
      setError("Please select the state");
      return;
    }
    if (!processedFormData.city) {
      setError("Please select a city");
      return;
    }
    setLoading(true);

    try {
      const response = await AddProject(processedFormData);
      setProjectId(response.data.data.project_id);
      setSelectedSubCategories(formData.sub_category_2);
      setIsSubmitted(true);
    } catch (error) {}
    setLoading(false);
  };

  if (isSubmitted) {
    return (
      <ProjectImages
        subCategories={selectedSubCategories}
        projectId={projectId}
      />
    );
  }

  return (
    <div className="md:pl-3 h-full flex flex-col items-center justify-center">
      <h1 className="text-2xl md:text-3xl font-bold text-black">
        Add a New Project
      </h1>

      <form onSubmit={handleSubmit} className="flex flex-col mt-6 h-[548]">
        {currentStep === 1 && (
          <div className="h-[385px]">
            {error && <Alert severity="error">{error}</Alert>}
            <div className="flex gap-4 mb-[1em]">
              <label className="text-sm w-full md:w-auto flex flex-col">
                <p>Title</p>
                <input
                  type="text"
                  className="w-[220px] h-10 mt-1 px-2"
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                  required
                  style={{ borderRadius: "5px", border: "solid 0.3px" }}
                />
              </label>
            </div>
            <div className="flex flex-col md:flex-row gap-6 justify-between">
              <label className="text-sm w-full md:w-auto flex flex-col">
                <p>Start Date </p>
                <input
                  type="date"
                  className="w-[220px] h-10 mt-1 px-2"
                  value={startDate}
                  onChange={(event) => setStartDate(event.target.value)}
                  required
                  style={{ borderRadius: "5px", border: "solid 0.3px" }}
                />
              </label>
              <label className="text-sm w-full md:w-auto flex flex-col">
                <p>End Date </p>
                <input
                  type="date"
                  className="w-[220px] h-10 mt-1 px-2"
                  value={endDate}
                  onChange={(event) => setEndDate(event.target.value)}
                  required
                  style={{ borderRadius: "5px", border: "solid 0.3px" }}
                />
              </label>
            </div>
            <label className="text-sm mt-4 flex flex-col mb-[3em]">
              <p>Description</p>

              <textarea
                className="w-[220px] md:w-[548px] mt-1 px-2"
                rows={5}
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                style={{ borderRadius: "5px", border: "solid 0.3px" }}
                required
              />
            </label>
            <div className="flex gap-2 justify-end w-[220px] md:w-[548px]">
              <Button
                onClick={nextStep}
                variant="outlined"
                style={{ backgroundColor: "#8c52ff", color: "white" }}
              >
                Next
              </Button>
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <>
            {error && <Alert severity="error">{error}</Alert>}
            <div className="flex flex-col items-end flex-wrap justify-around w-[220px] mt-2 md:w-[540px]">
              <label
                htmlFor=""
                className="flex flex-col md:flex-row  w-[220px] md:w-[540px] items-center justify-between"
              >
                <p>Select the theme (maximum of 7)</p>
                <MultipleSelect
                  apiEndpoint={`${constants.apiBaseUrl}/category/subcategory1/list?category=INTERIOR_DESIGNER`}
                  maxSelection={7}
                  onChange={(selected) => {
                    setFormData((prevData) => ({
                      ...prevData,
                      sub_category_1: selected,
                    }));
                  }}
                />
              </label>

              <label
                htmlFor=""
                className="flex flex-col md:flex-row  w-[220px] md:w-[540px] items-center justify-between my-3"
              >
                <p>Select the spaces</p>
                <MultipleSelect
                  dataArray={spacesData.values}
                  maxSelection={7}
                  onChange={(selected) => {
                    setFormData((prevData) => ({
                      ...prevData,
                      sub_category_2: selected,
                    }));
                  }}
                />
              </label>
              <label
                htmlFor=""
                className="flex flex-col md:flex-row  w-[220px] md:w-[540px] items-center justify-between"
              >
                <p>Type of execution</p>
                <MultipleSelect
                  apiEndpoint={`${constants.apiBaseUrl}/category/subcategory3/list?category=INTERIOR_DESIGNER`}
                  maxSelection={1}
                  // selectedValue={["DESIGN"]}
                  onChange={(selected) => {
                    setFormData((prevData) => ({
                      ...prevData,
                      sub_category_3: selected,
                    }));
                  }}
                />
              </label>
            </div>
            <div className="flex flex-col gap-2 w-[220px] md:w-[540px]  justify-between ">
              <div className="mt-4">
                <label
                  htmlFor=""
                  className="flex flex-col items-center md:flex-row  justify-between"
                >
                  <p className="mb-2">Select the state</p>
                  <Autocomplete
                    disablePortal
                    id="state-autocomplete"
                    options={state}
                    onChange={(event, value) =>
                      fetchCities({
                        event,
                        value,
                        setFormData,
                        setCities,
                        setLoadingCities,
                      })
                    }
                    size="small"
                    sx={{
                      width: 208,
                      borderRadius: "5px",
                      border: "solid 0.3px",
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        InputProps={{
                          ...params.InputProps,
                          endAdornment: <>{params.InputProps.endAdornment}</>,
                        }}
                      />
                    )}
                  />
                </label>
              </div>
              <div className="mt-4">
                <label
                  htmlFor=""
                  className="flex flex-col items-center md:flex-row  justify-between"
                >
                  <p className="mb-2">Select the city</p>
                  <Autocomplete
                    disablePortal
                    size="small"
                    id="city-autocomplete"
                    options={cities}
                    onChange={(_event, value) => {
                      setFormData((prevData) => ({
                        ...prevData,
                        city: value ?? "",
                      }));
                    }}
                    loading={loadingCities}
                    sx={{
                      width: 208,
                      borderRadius: "5px",
                      border: "solid 0.3px",
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        InputProps={{
                          ...params.InputProps,
                          endAdornment: (
                            <>
                              {loadingCities ? (
                                <CircularProgress color="inherit" size={20} />
                              ) : null}
                              {params.InputProps.endAdornment}
                            </>
                          ),
                        }}
                      />
                    )}
                  />
                </label>
              </div>
            </div>
            <div className="flex gap-2 justify-between  items-center mt-[1em]">
              <Button
                onClick={prevStep}
                variant="outlined"
                style={{ backgroundColor: "#8c52ff", color: "white" }}
              >
                Back
              </Button>
              <LoadingButton
                type="submit"
                variant="outlined"
                style={{ backgroundColor: "#8c52ff", color: "white" }}
                loading={loading}
              >
                {loading ? "" : "Next"}
              </LoadingButton>
            </div>
          </>
        )}
      </form>
    </div>
  );
};

export default AddAProject;
