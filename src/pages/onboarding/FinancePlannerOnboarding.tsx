import React, { FormEvent, useContext, useState, ChangeEvent } from "react";
import axios from "axios";
import MultipleSelect from "../../components/MultipleSelect";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import CircularProgress from "@mui/material/CircularProgress";
import { StateContext } from "../../context/State";
import constants from "../../constants";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import { useNavigate } from "react-router-dom";
import { Alert, Button } from "@mui/material";

interface SocialLinks {
  instagram: string;
  facebook: string;
  website: string;
}

interface FormData {
  business_name: string;
  sebi_registered: boolean;
  started_in: string;
  number_of_employees: number;
  address: string;
  city: string;
  state: string;
  description: string;
  aum_handled: number;
  minimum_investment: number;
  number_of_clients: number;
  fees: number;
  deals: string[];
  investment_ideology: string[];

  fees_type: string[];
  social: SocialLinks;
}

const FinancePlannerOnboarding = () => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [cities, setCities] = useState<string[]>([]);
  const [loadingCities, setLoadingCities] = useState<boolean>(false);
  const [error, setError] = useState("");
  const stateContext = useContext(StateContext);

  if (stateContext === undefined) {
    return;
  }
  const { state } = stateContext;

  const [formData, setFormData] = useState<FormData>({
    business_name: "",
    sebi_registered: false,
    started_in: "",
    number_of_employees: -1,
    address: "",
    city: "",
    state: "",
    description: "",
    aum_handled: -1,
    minimum_investment: -1,
    number_of_clients: -1,
    fees: 0,
    deals: [],
    investment_ideology: [],
    fees_type: [],
    social: {
      instagram: "",
      facebook: "",
      website: "",
    },
  });

  const navigate = useNavigate();

  const [logoPreview, setLogoPreview] = useState<string | ArrayBuffer | null>(
    null
  );

  const [logoFile, setLogoFile] = useState<File | null>(null);

  const handleStateChange = async (
    _event: React.SyntheticEvent,
    value: string | null,
    _reason: any,
    _details?: any
  ) => {
    setFormData((prevData) => ({
      ...prevData,
      state: value?.toString() ?? "",
      city: "",
    }));
    setCities([]);
    setLoadingCities(true);
    if (value) {
      try {
        const response = await axios.get(
          `${constants.apiBaseUrl}/location/cities?state=${value}`
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

    const processedFormData = {
      ...formData,
      deals: formData.deals.join(","),
      investment_ideology: formData.investment_ideology.join(","),
      fees_type: formData.fees_type.join(","),
      aum_handled: parseFloat(formData.aum_handled.toString()),
      minimum_investment: parseFloat(formData.minimum_investment.toString()),
      number_of_clients: parseInt(formData.number_of_clients.toString(), 10),
      number_of_employees: parseInt(
        formData.number_of_employees.toString(),
        10
      ),
      fees: parseInt(formData.fees.toString(), 10),
    };

    try {
      await axios.post(
        `${constants.apiBaseUrl}/financial-advisor/create`,
        processedFormData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (logoFile) {
        const formData = new FormData();
        formData.append("logo", logoFile);

        await axios.post(
          `${constants.apiBaseUrl}/image-upload/logo`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );
      }
    } catch (error) {}
    window.location.reload();
    navigate("/finance-planners");
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

      if (!formData.number_of_employees) {
        setError("Please enter the number of employees working with you ");
        return;
      }
      if (!formData.aum_handled) {
        setError("Please enter average value of your projects ");
        return;
      }

      if (!formData.minimum_investment) {
        setError("Please enter the minimum investment required");
        return;
      }
      if (!formData.number_of_clients) {
        setError("Please enter the number of your clients");
        return;
      }
      if (!formData.description) {
        setError("Please enter your business description ");
        return;
      }
    }

    if (currentStep === 2) {
      if (formData.deals.length === 0) {
        setError("please select your theme");
        return;
      }
      if (formData.investment_ideology.length === 0) {
        setError("please select your specialized spaces");
        return;
      }
      if (formData.fees_type.length === 0) {
        setError("please select your type of execution");
        return;
      }
      if (!formData.fees) {
        setError("Please enter your fees");
        return;
      }
    }

    if (currentStep === 3) {
      if (!formData.address) {
        setError("Please enter your address ");
        return;
      }
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
    window.scrollTo(0, 0);
    setError("");
  };
  const prevStep = () => {
    setCurrentStep((prevStep) => prevStep - 1);
    window.scrollTo(0, 0);
  };
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
                    className="w-[235px] px-2"
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
                    className="w-[235px] px-2"
                    value={formData.started_in}
                    onChange={handleChange}
                    required
                  />
                </label>
              </div>

              <div className="flex flex-col lg:flex-row gap-3">
                <label className="flex flex-col text-[16px]">
                  Aum handled (in lakhs)
                  <div className="flex items-center border border-black rounded w-[235px]">
                    <span className="px-2">₹</span>
                    <input
                      type="number"
                      name="aum_handled"
                      className="w-[235px] px-2 outline-none"
                      value={
                        formData.aum_handled === -1 ? "" : formData.aum_handled
                      }
                      onChange={handleChange}
                      required
                      style={{ borderRadius: "5px", border: "none" }}
                    />
                  </div>
                </label>
                <label className="flex flex-col text-[16px]">
                  Number of Employees
                  <input
                    type="number"
                    style={{ borderRadius: "5px", border: "solid 0.3px" }}
                    name="number_of_employees"
                    className="w-[235px] px-2"
                    value={
                      formData.number_of_employees === -1
                        ? ""
                        : formData.number_of_employees
                    }
                    onChange={handleChange}
                    required
                  />
                </label>
              </div>
              <div className="flex flex-col lg:flex-row gap-3">
                <label className="flex flex-col text-[16px]">
                  Minimum investment
                  <div className="flex items-center border border-black rounded w-[235px]">
                    <span className="px-2">₹</span>
                    <input
                      type="number"
                      name="minimum_investment"
                      className="w-full px-2 outline-none"
                      value={
                        formData.minimum_investment === -1
                          ? ""
                          : formData.minimum_investment
                      }
                      onChange={handleChange}
                      required
                      style={{
                        borderRadius: "5px",
                        border: "none",
                      }}
                    />
                  </div>
                </label>

                <label className="flex flex-col text-[16px]">
                  Number of clients
                  <input
                    type="number"
                    name="number_of_clients"
                    className="w-[235px] px-2"
                    value={
                      formData.number_of_clients === -1
                        ? ""
                        : formData.number_of_clients
                    }
                    onChange={handleChange}
                    required
                    style={{ borderRadius: "5px", border: "solid 0.3px" }}
                  />
                </label>
              </div>
              <div className="flex flex-col lg:flex-row gap-3">
                <label className="flex flex-row text-[16px] items-center justify-center">
                  Sebi registered
                  <input
                    type="checkbox"
                    name="sebi_registered"
                    className="ml-4"
                    checked={formData.sebi_registered}
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
                <p className="text-base ">Deals</p>
                <MultipleSelect
                  apiEndpoint={`${constants.apiBaseUrl}/financial-advisor/deals`}
                  maxSelection={3}
                  selectedValue={formData.deals ? formData.deals : []}
                  onChange={(selected) => {
                    setFormData((prevData) => ({
                      ...prevData,
                      deals: selected,
                    }));
                  }}
                />
              </label>

              <label
                htmlFor=""
                className="flex flex-col lg:flex-row   justify-start lg:justify-between"
              >
                <p className="text-base">Investment ideology</p>
                <MultipleSelect
                  apiEndpoint={`${constants.apiBaseUrl}/financial-advisor/investment-ideology`}
                  maxSelection={3}
                  selectedValue={
                    formData.investment_ideology
                      ? formData.investment_ideology
                      : []
                  }
                  onChange={(selected) =>
                    setFormData((prevData) => ({
                      ...prevData,
                      investment_ideology: selected,
                    }))
                  }
                />
              </label>

              <label
                htmlFor=""
                className="flex flex-col lg:flex-row justify-start lg:justify-between"
              >
                <p className="text-base">Fees type</p>
                <MultipleSelect
                  apiEndpoint={`${constants.apiBaseUrl}/financial-advisor/fees-type`}
                  maxSelection={1}
                  selectedValue={formData.fees_type ? formData.fees_type : []}
                  onChange={(selected) =>
                    setFormData((prevData) => ({
                      ...prevData,
                      fees_type: selected,
                    }))
                  }
                />
              </label>
              <label className="flex flex-col lg:flex-row justify-start lg:justify-between">
                <p className="text-base">Fees</p>
                <div className="w-[206.67px] h-[40px] flex items-center border border-black rounded">
                  {formData.fees_type[0] === "FIXED" && (
                    <span className="ml-1">₹</span>
                  )}{" "}
                  {/* Currency symbol */}
                  <input
                    type="number"
                    name="fees"
                    className="w-full px-2 border-none outline-none"
                    value={formData.fees === -1 ? "" : formData.fees}
                    onChange={handleChange}
                    required
                  />
                  {formData.fees_type[0] === "PERCENTAGE" && (
                    <span className="mr-1">%</span>
                  )}{" "}
                  {/* Percentage symbol */}
                </div>
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
              <label className="flex flex-col lg:flex-row justify-between md:mt-10 mt-[1em]">
                Address
                <input
                  type="text"
                  style={{ borderRadius: "5px", border: "solid 1px" }}
                  name="address"
                  className="w-[235px] h-[40px] px-2"
                  value={formData.address}
                  onChange={handleChange}
                  required
                />
              </label>
              <label
                htmlFor=""
                className="flex flex-col lg:flex-row justify-between"
              >
                <p className="text-base">Select your state</p>
                <Autocomplete
                  value={formData.state ? formData.state : ""}
                  disablePortal
                  id="state-autocomplete"
                  options={state}
                  onChange={handleStateChange}
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
                    <InstagramIcon className="text-red" /> Instagram
                  </p>
                  <input
                    type="url"
                    style={{ borderRadius: "5px", border: "solid 0.3px" }}
                    name="instagram"
                    className="w-[235px] px-2"
                    value={formData.social.instagram}
                    onChange={handleSocialChange}
                  />
                </label>
                <label className="flex flex-col lg:flex-row text-[16px] justify-between mt-[1em]">
                  <p>
                    <FacebookIcon className="text-purple" /> Facebook
                  </p>
                  <input
                    type="url"
                    style={{ borderRadius: "5px", border: "solid 0.3px" }}
                    name="facebook"
                    className="w-[235px] px-2"
                    value={formData.social.facebook}
                    onChange={handleSocialChange}
                  />
                </label>
                <label className="flex flex-col lg:flex-row text-[16px] justify-between mt-[1em]">
                  <p>
                    <OpenInNewIcon className="text-darkgrey" /> Website
                  </p>
                  <input
                    type="url"
                    style={{ borderRadius: "5px", border: "solid 0.3px" }}
                    name="website"
                    className="w-[235px] px-2"
                    value={formData.social.website}
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

                <Button
                  variant="outlined"
                  type="submit"
                  style={{ backgroundColor: "#8c52ff", color: "white" }}
                >
                  Submit
                </Button>
              </div>
            </>
          )}
        </form>
      </div>
    </div>
  );
};

export default FinancePlannerOnboarding;
