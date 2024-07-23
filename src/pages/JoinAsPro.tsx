import React, { useContext, useState } from "react";
import axios from "axios";
import MultipleSelect from "../components/MultipleSelect";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import CircularProgress from "@mui/material/CircularProgress";
import { StateContext } from "../context/State";
import config from "../config";

import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";

const JoinAsPro = ({ handleClose }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [cities, setCities] = useState([]);
  const [loadingCities, setLoadingCities] = useState(false);
  const { state } = useContext(StateContext);

  const [formData, setFormData] = useState({
    business_name: "",
    address: "",
    sub_category_1: [],
    sub_category_2: [],
    sub_category_3: [],
    category: "INTERIOR_DESIGNER",
    started_in: "",
    number_of_employees: "",
    average_project_value: "",
    projects_completed: "",
    city: "",
    state: "",
    description: "",
    social: {
      instagram: "",
      facebook: "",
      website: "",
    },
  });

  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);

  const handleStateChange = async (event, value) => {
    setFormData((prevData) => ({
      ...prevData,
      state: value,
      city: "",
    }));
    setCities([]);
    setLoadingCities(true);
    if (value) {
      try {
        const response = await axios.get(
          `${config.apiBaseUrl}/location/cities?state=${value}`
        );
        setCities(response.data.data);
      } catch (error) {
      } finally {
        setLoadingCities(false);
      }
    } else {
      setLoadingCities(false);
    }
  };

  const handleSocialChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      social: {
        ...prevData.social,
        [name]: value,
      },
    }));
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const processedFormData = {
      ...formData,
      number_of_employees: parseInt(formData.number_of_employees, 10),
      average_project_value: parseFloat(formData.average_project_value),
      projects_completed: parseInt(formData.projects_completed, 10),
      sub_category_1: formData.sub_category_1.join(","),
      sub_category_2: formData.sub_category_2.join(","),
      sub_category_3: formData.sub_category_3.join(","),
    };

    console.log(processedFormData);

    try {
      const response = await axios.post(
        `${config.apiBaseUrl}/vendor/onboard`,
        processedFormData,
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          },
        }
      );
      console.log(response);

      sessionStorage.removeItem("token");
      sessionStorage.setItem("token", response.data.access_token);

      if (logoFile) {
        const formData = new FormData();
        formData.append("logo", logoFile);

        const fileUploadResponse = await axios.post(
          `${config.apiBaseUrl}/image-upload/logo`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${sessionStorage.getItem("token")}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );
      }
    } catch (error) {}
    window.location.reload();
    handleClose();
  };

  const nextStep = () => setCurrentStep((prevStep) => prevStep + 1);
  const prevStep = () => setCurrentStep((prevStep) => prevStep - 1);

  const cityOptions = formData.state
    ? cities
    : [{ title: "Select a state first", disabled: true }];

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    setLogoFile(file);

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex justify-center">
      <div className="flex flex-col gap-4 h-[485px] text-lg">
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-4 h-[480px] justify-between w-[455px] text-lg"
        >
          <h1 className="text-xl font-bold">
            Let's get started by creating your profile
          </h1>

          {currentStep === 1 && (
            <>
              <div className="flex gap-3">
                <label className="text-[16px] w-fit">
                  Business Name
                  <br />
                  <input
                    type="text"
                    name="business_name"
                    className="w-[220px] px-2"
                    value={formData.business_name}
                    onChange={handleChange}
                    required
                    style={{ borderRadius: "5px", border: "solid 0.3px" }}
                  />
                </label>
                <label className="flex flex-col text-[16px]">
                  Started In
                  <input
                    type="text"
                    style={{ borderRadius: "5px", border: "solid 0.3px" }}
                    name="started_in"
                    className="w-[220px] px-2"
                    value={formData.started_in}
                    onChange={handleChange}
                    required
                  />
                </label>
              </div>

              <div className="flex gap-3">
                <label className="flex flex-col text-[16px]">
                  Address
                  <input
                    type="text"
                    style={{ borderRadius: "5px", border: "solid 0.3px" }}
                    name="address"
                    className="w-[220px] px-2"
                    value={formData.address}
                    onChange={handleChange}
                    required
                  />
                </label>
                <label className="flex flex-col text-[16px]">
                  Number of Employees
                  <input
                    type="number"
                    style={{ borderRadius: "5px", border: "solid 0.3px" }}
                    name="number_of_employees"
                    className="w-[220px] px-2"
                    value={formData.number_of_employees}
                    onChange={handleChange}
                    required
                  />
                </label>
              </div>
              <div className="flex gap-3">
                <label className="flex flex-col text-[16px]">
                  Average project value
                  <input
                    type="number"
                    step="0.01"
                    style={{ borderRadius: "5px", border: "solid 0.3px" }}
                    name="average_project_value"
                    className="w-[220px] px-2"
                    value={formData.average_project_value}
                    onChange={handleChange}
                    required
                  />
                </label>
                <label className="flex flex-col text-[16px]">
                  Projects completed
                  <input
                    type="number"
                    name="projects_completed"
                    className="w-[220px] px-2"
                    value={formData.projects_completed}
                    onChange={handleChange}
                    required
                    style={{ borderRadius: "5px", border: "solid 0.3px" }}
                  />
                </label>
              </div>
              <label className="text-sm mt-4">
                Description
                <br />
                <textarea
                  name="description"
                  className="w-full md:w-[452px] mt-1 px-2"
                  rows={5}
                  value={formData.description}
                  onChange={handleChange}
                  style={{ borderRadius: "5px", border: "solid 0.3px" }}
                  required
                />
              </label>
              <div className="flex gap-2 justify-end w-[455px]">
                <button
                  type="button"
                  onClick={nextStep}
                  className="p-2 w-[100px] bg-sec rounded-[5px] border-[2px] text-white"
                >
                  Next
                </button>
              </div>
            </>
          )}

          {currentStep === 2 && (
            <>
              <br />
              <label htmlFor="" className="flex items-center">
                <p>Select your themes (maximum of three)</p>
                <MultipleSelect
                  size="small"
                  apiEndpoint={`${config.apiBaseUrl}/category/subcategory1/list?category=INTERIOR_DESIGNER`}
                  maxSelection={3}
                  onChange={(selected) => {
                    setFormData((prevData) => ({
                      ...prevData,
                      sub_category_1: selected,
                    }));
                  }}
                />
              </label>

              <label htmlFor="" className="flex items-center">
                <p>Select your spaces (maximum of three)</p>
                <MultipleSelect
                  size="small"
                  // label="Spaces"
                  apiEndpoint={`${config.apiBaseUrl}/category/subcategory2/list?category=INTERIOR_DESIGNER`}
                  maxSelection={3}
                  onChange={(selected) =>
                    setFormData((prevData) => ({
                      ...prevData,
                      sub_category_2: selected,
                    }))
                  }
                />
              </label>

              <label
                htmlFor=""
                className="flex items-center justify-end gap-[89px]"
              >
                <p>Type of execution</p>
                <MultipleSelect
                  size="small"
                  // label="Execution Type"
                  apiEndpoint={`${config.apiBaseUrl}/category/subcategory3/list?category=INTERIOR_DESIGNER`}
                  maxSelection={3}
                  onChange={(selected) =>
                    setFormData((prevData) => ({
                      ...prevData,
                      sub_category_3: selected,
                    }))
                  }
                />
              </label>
              <br />
              <div className="flex gap-2 justify-between w-[455px]">
                <button
                  type="button"
                  onClick={prevStep}
                  className="p-2 w-[100px] rounded-[5px] border-text border-[2px] text-text bg-prim"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={nextStep}
                  className="p-2 w-[100px] bg-sec rounded-[5px] border-[2px] text-white"
                >
                  Next
                </button>
              </div>
            </>
          )}

          {currentStep === 3 && (
            <>
              <br />
              <label htmlFor="" className="flex items-center justify-between">
                <p>Select your state</p>
                <Autocomplete
                  disablePortal
                  id="state-autocomplete"
                  options={state}
                  onChange={handleStateChange}
                  sx={{ width: 220 }}
                  size="small"
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                          <React.Fragment>
                            {params.InputProps.endAdornment}
                          </React.Fragment>
                        ),
                      }}
                    />
                  )}
                />
              </label>
              <label
                htmlFor=""
                className="flex items-center justify-between gap-[10px]"
              >
                <p>Select your city</p>
                <Autocomplete
                  disablePortal
                  id="city-autocomplete"
                  options={cityOptions}
                  size="small"
                  onChange={(event, value) =>
                    setFormData((prevData) => ({
                      ...prevData,
                      city: value,
                    }))
                  }
                  loading={loadingCities}
                  sx={{ width: 220 }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      // label="Enter your city"
                      InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                          <React.Fragment>
                            {loadingCities ? (
                              <CircularProgress color="inherit" size={20} />
                            ) : null}
                            {params.InputProps.endAdornment}
                          </React.Fragment>
                        ),
                      }}
                    />
                  )}
                />
              </label>

              <label className="flex justify-between mt-4">
                <p>Upload Logo</p>
                <input
                  type="file"
                  name="logo"
                  onChange={handleLogoChange}
                  style={{ borderRadius: "5px", border: "solid 0.3px" }}
                  className="w-[220px] px-2 text-[14px]"
                  required
                />
              </label>
              {logoPreview && (
                <div className="flex items-center justify-center">
                  <img
                    src={logoPreview}
                    alt="Logo Preview"
                    className="w-[100px] h-auto mt-2"
                    style={{ borderRadius: "5px", border: "solid 0.3px" }}
                  />
                </div>
              )}
              <br />
              <div className="flex gap-2 w-[455px] justify-between">
                <button
                  type="button"
                  onClick={prevStep}
                  className="p-2 w-[100px] rounded-[5px] border-text border-[2px] text-text bg-prim"
                >
                  Back
                </button>

                <button
                  type="button"
                  onClick={nextStep}
                  className="p-2 w-[100px] bg-sec rounded-[5px] border-[2px] text-white"
                >
                  Next
                </button>
              </div>
            </>
          )}
          {currentStep === 4 && (
            <>
              <br />

              <div className="flex flex-col gap-2">
                <label className="flex text-[16px] justify-between">
                  <p>
                    Instagram <InstagramIcon />
                  </p>
                  <input
                    type="url"
                    style={{ borderRadius: "5px", border: "solid 0.3px" }}
                    name="instagram"
                    className="w-[220px] px-2"
                    value={formData.social.instagram}
                    onChange={handleSocialChange}
                  />
                </label>
                <br />
                <label className="flex text-[16px] justify-between">
                  <p>
                    Facebook <FacebookIcon />
                  </p>
                  <input
                    type="url"
                    style={{ borderRadius: "5px", border: "solid 0.3px" }}
                    name="facebook"
                    className="w-[220px] px-2"
                    value={formData.social.facebook}
                    onChange={handleSocialChange}
                  />
                </label>
                <br />
                <label className="flex text-[16px] justify-between">
                  <p>
                    Website <OpenInNewIcon />
                  </p>
                  <input
                    type="url"
                    style={{ borderRadius: "5px", border: "solid 0.3px" }}
                    name="website"
                    className="w-[220px] px-2"
                    value={formData.social.website}
                    onChange={handleSocialChange}
                  />
                </label>
              </div>

              <br />
              <div className="flex gap-2 w-[455px] justify-between">
                <button
                  type="button"
                  onClick={prevStep}
                  className="p-2 w-[100px] rounded-[5px] border-text border-[2px] text-text bg-prim"
                >
                  Back
                </button>

                <button
                  type="submit"
                  className="p-2 w-[100px] bg-sec rounded-[5px] border-[2px] text-white"
                >
                  Submit
                </button>
              </div>
            </>
          )}
        </form>
      </div>
    </div>
  );
};

export default JoinAsPro;
