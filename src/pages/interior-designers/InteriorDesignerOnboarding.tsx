import React, { FormEvent, useContext, useState, ChangeEvent } from "react";
import { MultipleSelect } from "../../components";
import { StateContext } from "../../context";
import constants from "../../constants";
import { Instagram, Facebook, OpenInNew } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import {
  Alert,
  Button,
  CircularProgress,
  Autocomplete,
  TextField,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { VendorData } from "./Types";
import { uploadLogo } from "../../controllers/LogoControllers";
import { handleStateChange } from "../../controllers/StateControllers";
import { interiorDesignerOnboarding } from "../../controllers/interior-designers/VendorControllers";

const InteriorDesignerOnboarding = () => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [cities, setCities] = useState<string[]>([]);
  const [loadingCities, setLoadingCities] = useState<boolean>(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const stateContext = useContext(StateContext);

  if (stateContext === undefined) {
    return;
  }
  const { state } = stateContext;

  const [formData, setFormData] = useState<VendorData>({
    business_name: "",
    address: "",
    sub_category_1: [],
    sub_category_2: [],
    sub_category_3: [],
    category: "INTERIOR_DESIGNER",
    started_in: "",
    number_of_employees: 0,
    average_project_value: "",
    projects_completed: 0,
    city: "",
    state: "",
    description: "",
    social: {
      instagram: "",
      facebook: "",
      website: "",
    },
  });

  const navigate = useNavigate();

  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | ArrayBuffer | null>(
    null
  );

  const handleSocialChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      social: {
        ...prevData.social,
        [name]: value,
      },
    }));
  };

  const handleChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type, checked } = event.target as HTMLInputElement;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleDeleteLogo = async () => {
    setLogoPreview(null);
    setFormData((prevData) => ({ ...prevData, logo: null }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    const processedFormData = {
      ...formData,
      number_of_employees: parseInt(
        formData.number_of_employees.toString(),
        10
      ),
      average_project_value: parseFloat(formData.average_project_value),
      projects_completed: parseInt(formData.projects_completed.toString(), 10),
      sub_category_1: [formData.sub_category_1 as Array<string>].join(","),
      sub_category_2: [formData.sub_category_2 as Array<string>].join(","),
      sub_category_3: [formData.sub_category_3 as Array<string>].join(","),
    };

    try {
      const response = await interiorDesignerOnboarding(processedFormData);

      localStorage.removeItem("token");
      localStorage.setItem("token", response.data.access_token);

      if (logoFile) {
        const formData = new FormData();
        formData.append("logo", logoFile);

        await uploadLogo(formData);
      }
    } catch (error) {}
    navigate("/interior-designers");
    window.location.reload();
    setLoading(false);
  };

  const nextStep = () => {
    if (currentStep === 1) {
      if (!formData.business_name) {
        setError("Please enter the business name ");
        return;
      }
      if (!formData.started_in) {
        setError("Please enter the start date of your business ");
        return;
      }
      if (!formData.address) {
        setError("Please enter your address ");
        return;
      }
      if (!formData.number_of_employees) {
        setError("Please enter the number of employees working with you ");
        return;
      }
      if (!formData.average_project_value) {
        setError("Please enter average value of your projects ");
        return;
      }
      if (!formData.projects_completed) {
        setError("Please enter the number of cprojects completed so far ");
        return;
      }
      if (!formData.description) {
        setError("Please enter your business description ");
        return;
      }
    }

    if (currentStep === 2) {
      if (formData.sub_category_1.length === 0) {
        setError("please select your theme");
        return;
      }
      if (formData.sub_category_2.length === 0) {
        setError("please select your specialized spaces");
        return;
      }
      if (formData.sub_category_3.length === 0) {
        setError("please select your type of execution");
        return;
      }
    }

    if (currentStep === 3) {
      if (!formData.state) {
        setError("Please enter your state ");
        return;
      }
      if (!formData.city) {
        setError("Please enter your city ");
        return;
      }
    }
    setCurrentStep((prevStep) => prevStep + 1);
    setError("");
  };
  const prevStep = () => setCurrentStep((prevStep) => prevStep - 1);
  const handleLogoChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
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
      <div className="flex flex-col gap-4  text-lg">
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-4 justify-between w-[235px] lg:w-[495px] text-lg"
        >
          <h1 className="text-xl font-bold">
            {currentStep === 1
              ? "Let's get started by creating your profile"
              : "Few more details needed"}
          </h1>
          {error && <Alert severity="error">{error}</Alert>}
          {currentStep === 1 && (
            <>
              <div className="flex flex-col lg:flex-row gap-3">
                <label className="text-[16px] w-fit flex flex-col">
                  <p>Business Name</p>
                  <input
                    type="text"
                    name="business_name"
                    className="w-[235px] px-2 h-[40px]"
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
                    className="w-[235px] px-2 h-[40px]"
                    value={formData.started_in}
                    onChange={handleChange}
                    required
                  />
                </label>
              </div>

              <div className="flex flex-col lg:flex-row gap-3">
                <label className="flex flex-col text-[16px]">
                  Address
                  <input
                    type="text"
                    style={{ borderRadius: "5px", border: "solid 0.3px" }}
                    name="address"
                    className="w-[235px] px-2 h-[40px]"
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
                    className="w-[235px] px-2 h-[40px]"
                    value={formData.number_of_employees}
                    onChange={handleChange}
                    required
                  />
                </label>
              </div>
              <div className="flex flex-col lg:flex-row gap-3">
                <label className="flex flex-col text-[16px]">
                  Average project value
                  <div className="flex items-center border border-black rounded w-[235px]">
                    <span className="px-2">₹</span>
                    <input
                      type="number"
                      step="0.01"
                      style={{ borderRadius: "5px", border: "none" }}
                      name="average_project_value"
                      className="w-[235px] px-2 h-[40px] outline-none"
                      value={formData.average_project_value}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </label>
                <label className="flex flex-col text-[16px]">
                  Projects completed
                  <input
                    type="number"
                    name="projects_completed"
                    className="w-[235px] px-2 h-[40px]"
                    value={formData.projects_completed}
                    onChange={handleChange}
                    required
                    style={{ borderRadius: "5px", border: "solid 0.3px" }}
                  />
                </label>
              </div>
              <label className="text-base mt-4 flex flex-col">
                <p>Description</p>

                <textarea
                  name="description"
                  className="w-[235px] lg:w-[482px] mt-1 px-2"
                  rows={5}
                  value={formData.description}
                  onChange={handleChange}
                  style={{ borderRadius: "5px", border: "solid 0.3px" }}
                  required
                />
              </label>
              <div className="flex gap-2 justify-end w-[235px] lg:w-[485px]">
                <Button
                  variant="outlined"
                  style={{ backgroundColor: "#8c52ff", color: "white" }}
                  onClick={nextStep}
                >
                  Next
                </Button>
              </div>
            </>
          )}

          {currentStep === 2 && (
            <>
              <label
                htmlFor=""
                className="flex flex-col lg:flex-row justify-start lg:justify-between md:mt-10"
              >
                <p className="text-base ">
                  Select your themes (maximum of three)
                </p>
                <MultipleSelect
                  apiEndpoint={`${constants.apiBaseUrl}/category/subcategory1/list?category=INTERIOR_DESIGNER`}
                  maxSelection={3}
                  selectedValue={
                    formData.sub_category_1
                      ? (formData.sub_category_1 as Array<string>)
                      : []
                  }
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
                className="flex flex-col lg:flex-row   justify-start lg:justify-between"
              >
                <p className="text-base">Select your spaces</p>
                <MultipleSelect
                  apiEndpoint={`${constants.apiBaseUrl}/category/subcategory2/list?category=INTERIOR_DESIGNER`}
                  maxSelection={3}
                  selectedValue={
                    formData.sub_category_2
                      ? (formData.sub_category_2 as Array<string>)
                      : []
                  }
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
                className="flex flex-col lg:flex-row justify-start lg:justify-between"
              >
                <p className="text-base">Type of execution</p>
                <MultipleSelect
                  apiEndpoint={`${constants.apiBaseUrl}/category/subcategory3/list?category=INTERIOR_DESIGNER`}
                  maxSelection={1}
                  selectedValue={
                    formData.sub_category_3
                      ? (formData.sub_category_3 as Array<string>)
                      : []
                  }
                  onChange={(selected) =>
                    setFormData((prevData) => ({
                      ...prevData,
                      sub_category_3: selected,
                    }))
                  }
                />
              </label>
              <div className="flex gap-2 justify-end  mt-[1em]">
                <Button
                  style={{ borderColor: "#000", color: "black" }}
                  onClick={prevStep}
                  variant="outlined"
                >
                  Back
                </Button>
                <Button
                  onClick={nextStep}
                  style={{ backgroundColor: "#8c52ff", color: "white" }}
                >
                  Next
                </Button>
              </div>
            </>
          )}

          {currentStep === 3 && (
            <>
              <label
                htmlFor=""
                className="flex flex-col lg:flex-row justify-between md:mt-10 mt-[1em]"
              >
                <p className="text-base">Select your state</p>
                <Autocomplete
                  value={formData.state ? formData.state : ""}
                  disablePortal
                  id="state-autocomplete"
                  options={state}
                  onChange={(event, value) =>
                    handleStateChange({
                      event,
                      value,
                      setFormData,
                      setCities,
                      setLoadingCities,
                    })
                  }
                  size="small"
                  sx={{
                    width: 235,
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
              <label
                htmlFor=""
                className="flex flex-col lg:flex-row  justify-between"
              >
                <p className="text-base">Select your city</p>
                <Autocomplete
                  disablePortal
                  value={formData.city ? formData.city : ""}
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
                    width: 235,
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

              <label className="flex flex-col lg:flex-row justify-between mt-1">
                <p className="text-base">Upload Logo</p>
                <input
                  type="file"
                  name="logo"
                  onChange={handleLogoChange}
                  style={{ borderRadius: "5px", border: "solid 0.3px" }}
                  className="w-[235px] px-2 text-[14px]"
                  required
                />
              </label>
              {logoPreview && (
                <div className="relative flex items-center justify-center">
                  {typeof logoPreview === "string" && (
                    <div className="relative">
                      <img
                        src={logoPreview}
                        alt="Logo Preview"
                        className="w-[100px] h-auto mt-2"
                        style={{ borderRadius: "5px", border: "solid 0.3px" }}
                      />
                      <div
                        style={{
                          position: "absolute",
                          top: 0,
                          right: 0,
                          background: "red",
                          color: "white",
                          borderRadius: "100%",
                          width: "15px",
                          height: "15px",
                          border: "none",
                          cursor: "pointer",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <Button
                          onClick={handleDeleteLogo}
                          style={{
                            color: "white",
                          }}
                        >
                          &times;
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              )}
              <div className="flex gap-2 justify-end mt-[1em]">
                <Button
                  variant="outlined"
                  onClick={prevStep}
                  style={{ borderColor: "#000", color: "black" }}
                >
                  Back
                </Button>

                <Button
                  variant="outlined"
                  onClick={nextStep}
                  style={{ backgroundColor: "#8c52ff", color: "white" }}
                >
                  Next
                </Button>
              </div>
            </>
          )}
          {currentStep === 4 && (
            <>
              <div className="flex flex-col gap-2 mt-[1em]">
                <label className="flex flex-col lg:flex-row text-[16px] justify-between">
                  <p>
                    <Instagram className="text-red" /> Instagram
                  </p>
                  <input
                    type="url"
                    style={{ borderRadius: "5px", border: "solid 0.3px" }}
                    name="instagram"
                    className="w-[235px] px-2 h-[40px]"
                    value={formData.social?.instagram}
                    onChange={handleSocialChange}
                  />
                </label>
                <label className="flex flex-col lg:flex-row text-[16px] justify-between mt-[1em]">
                  <p>
                    <Facebook className="text-purple" /> Facebook
                  </p>
                  <input
                    type="url"
                    style={{ borderRadius: "5px", border: "solid 0.3px" }}
                    name="facebook"
                    className="w-[235px] px-2 h-[40px]"
                    value={formData.social?.facebook}
                    onChange={handleSocialChange}
                  />
                </label>
                <label className="flex flex-col lg:flex-row text-[16px] justify-between mt-[1em]">
                  <p>
                    <OpenInNew className="text-black" /> Website
                  </p>
                  <input
                    type="url"
                    style={{ borderRadius: "5px", border: "solid 0.3px" }}
                    name="website"
                    className="w-[235px] px-2 h-[40px]"
                    value={formData.social?.website}
                    onChange={handleSocialChange}
                  />
                </label>
              </div>

              <div className="flex gap-2 justify-end mt-[1em]">
                <Button
                  variant="outlined"
                  style={{ borderColor: "#000", color: "black" }}
                  onClick={prevStep}
                >
                  Back
                </Button>

                <LoadingButton
                  variant="outlined"
                  type="submit"
                  style={{
                    backgroundColor: "#8c52ff",
                    color: "white",
                    width: "85px",
                    height: "36px",
                  }}
                  loading={loading}
                >
                  {loading ? "" : "Submit"}
                </LoadingButton>
              </div>
            </>
          )}
        </form>
      </div>
    </div>
  );
};

export default InteriorDesignerOnboarding;
