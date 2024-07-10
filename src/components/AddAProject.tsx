import { useEffect, useState, useContext } from "react";
import axios from "axios";

import MultipleSelect from "./Testing";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import CircularProgress from "@mui/material/CircularProgress";
import { AuthContext } from "../context/Login";
import ProjectImages from "./ProjectImages";

const AddAProject = ({ handleClose }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [loadingStates, setLoadingStates] = useState(false);
  const [loadingCities, setLoadingCities] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [selectedSubCategories, setSelectedSubCategories] = useState([]);
  const { setProjectId } = useContext(AuthContext);
  const [currentStep, setCurrentStep] = useState(1);
  const [error, setError] = useState("");

  const nextStep = () => setCurrentStep((prevStep) => prevStep + 1);
  const prevStep = () => setCurrentStep((prevStep) => prevStep - 1);

  const [formData, setFormData] = useState({
    sub_category_1: [],
    sub_category_2: [],
    sub_category_3: [],
    city: "",
    state: "",
  });

  useEffect(() => {
    const fetchStateData = async () => {
      setLoadingStates(true);
      try {
        const response = await axios.get(
          "https://designmatch.ddns.net/location/states"
        );
        setStates(response.data.data);
      } catch (error) {
        console.error("Error fetching state data:", error);
      } finally {
        setLoadingStates(false);
      }
    };
    fetchStateData();
  }, []);

  const handleStateChange = async (value) => {
    setFormData((prevData) => ({
      ...prevData,
      state: value,
      city: "", // Reset city value when state changes
    }));
    setCities([]);
    setLoadingCities(true);
    if (value) {
      try {
        const response = await axios.get(
          `https://designmatch.ddns.net/location/cities?state=${value}`
        );
        setCities(response.data.data);
      } catch (error) {
        console.error("Error fetching city data:", error);
      } finally {
        setLoadingCities(false);
      }
    } else {
      setLoadingCities(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

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

    try {
      const response = await axios.post(
        "https://designmatch.ddns.net/vendor/project",
        processedFormData,
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          },
        }
      );
      console.log("Project creation successful:", response);
      console.log(response.data.data.project_id);
      setProjectId(response.data.data.project_id);

      // Set the selected subcategories and mark the form as submitted
      setSelectedSubCategories(formData.sub_category_2);
      setIsSubmitted(true);

      // Optionally, navigate to a different route if needed
      // navigate("/some-route");
    } catch (error) {
      console.error("Error during project creation:", error);
    }
    // handleClose();
  };

  if (isSubmitted) {
    return (
      <ProjectImages
        subCategories={selectedSubCategories}
        handleClose={handleClose}
      />
    );
  }

  return (
    <div className="pl-3 h-full flex flex-col items-center justify-center">
      <h1 className="text-3xl font-bold text-text">Add a New Project</h1>

      <form onSubmit={handleSubmit} className="flex flex-col mt-6 h-[548]">
        {currentStep === 1 && (
          <div className="h-[385px]">
            <div className="flex gap-4">
              <label className="text-sm w-full md:w-auto">
                Title <br />
                <input
                  type="text"
                  className="w-full md:w-[250px] h-10 mt-1 px-2"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  style={{ borderRadius: "5px", border: "solid 0.3px" }}
                />
              </label>
            </div>
            <br />
            <div className="flex gap-6 justify-between">
              <label className="text-sm w-full md:w-auto">
                Start Date <br />
                <input
                  type="date"
                  className="w-full md:w-[250px] h-10 mt-1 px-2"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  required
                  style={{ borderRadius: "5px", border: "solid 0.3px" }}
                />
              </label>
              <label className="text-sm w-full md:w-auto">
                End Date <br />
                <input
                  type="date"
                  className="w-full md:w-[250px] h-10 mt-1 px-2"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  required
                  style={{ borderRadius: "5px", border: "solid 0.3px" }}
                />
              </label>
            </div>
            <label className="text-sm mt-4">
              Description
              <br />
              <textarea
                className="w-full md:w-[548px] mt-1 px-2"
                rows={5}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                style={{ borderRadius: "5px", border: "solid 0.3px" }}
                required
              />
            </label>
            <br />
            <br />
            <br />
            <div className="flex gap-2 justify-end w-[548px]">
              <button
                type="button"
                onClick={nextStep}
                className="p-2 w-[100px] bg-sec rounded-[5px] border-[2px] text-white"
              >
                Next
              </button>
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <>
            <p className="flex items-center justify-center text-[red]">
              {error}
            </p>
            <div className="flex flex-col items-end flex-wrap justify-around w-[540px]">
              <label
                htmlFor=""
                className="flex  w-[540px] items-center justify-between"
              >
                <p>Select the theme (maximum of 7)</p>
                <MultipleSelect
                  size="small"
                  // label="Theme"
                  apiEndpoint="https://designmatch.ddns.net/category/subcategory1/list?category=INTERIOR_DESIGNER"
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
                className="flex  w-[540px] items-center justify-between"
              >
                <p>Select the spaces (maximum of 7)</p>
                <MultipleSelect
                  size="small"
                  // label="Spaces"
                  apiEndpoint="https://designmatch.ddns.net/category/subcategory2/list?category=INTERIOR_DESIGNER"
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
                className="flex  w-[540px] items-center justify-between"
              >
                <p>Type of execution</p>
                <MultipleSelect
                  size="small"
                  // label="Execution Type"
                  apiEndpoint="https://designmatch.ddns.net/category/subcategory3/list?category=INTERIOR_DESIGNER"
                  maxSelection={1}
                  onChange={(selected) => {
                    setFormData((prevData) => ({
                      ...prevData,
                      sub_category_3: selected,
                    }));
                  }}
                />
              </label>
            </div>
            <div className="flex flex-col gap-2 w-[534px]  justify-between ">
              <div className="mt-4">
                <label htmlFor="" className="flex  justify-between">
                  <p>Select the state</p>
                  <Autocomplete
                    disablePortal
                    id="state-autocomplete"
                    options={states}
                    onChange={handleStateChange}
                    loading={loadingStates}
                    size="small"
                    sx={{
                      width: 208,
                      borderRadius: "5px",
                      border: "solid 0.3px",
                      marginRight: "3px",
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        // label="State"
                        InputProps={{
                          ...params.InputProps,
                          endAdornment: (
                            <>
                              {loadingStates ? (
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
              <div className="mt-4">
                <label htmlFor="" className="flex  justify-between">
                  <p>Select the city</p>
                  <Autocomplete
                    disablePortal
                    size="small"
                    id="city-autocomplete"
                    options={cities}
                    onChange={(event, value) =>
                      setFormData((prevData) => ({
                        ...prevData,
                        city: value,
                      }))
                    }
                    loading={loadingCities}
                    sx={{
                      width: 208,
                      borderRadius: "5px",
                      border: "solid 0.3px",
                      marginRight: "3px",
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        // label="City"
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
            <br />
            <div className="flex gap-2 justify-between  items-center">
              <button
                type="button"
                onClick={prevStep}
                className="p-2 w-[100px]  rounded-[5px] border-text border-[2px] text-text bg-prim"
              >
                Back
              </button>
              <button
                type="submit"
                style={{ borderRadius: "5px" }}
                className="p-2 w-[100px]  rounded-[5px] border-text border-[2px] text-text bg-prim"
              >
                Next
              </button>
            </div>
          </>
        )}

        {/* <div className="flex justify-center">
          <button
            type="submit"
            style={{ borderRadius: "5px" }}
            className="p-2 mt-4 w-[250px] rounded-md border-text border-[2px] text-text bg-prim hover:bg-text hover:text-prim hover:border-text"
          >
            Add Project
          </button>
        </div> */}
      </form>
    </div>
  );
};

export default AddAProject;
