import { FormEvent, useContext, useEffect, useState } from "react";
import { NoLogoUploaded } from "../../assets";
import {
  OpenInNew,
  StarBorder,
  Facebook,
  Instagram,
  SaveOutlined,
  Edit,
} from "@mui/icons-material";
import {
  Chip,
  Button,
  Snackbar,
  Tooltip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  Autocomplete,
  TextField,
  CircularProgress,
  DialogActions,
  Popper,
  styled,
} from "@mui/material";
import { useParams } from "react-router-dom";
import { useQuery } from "react-query";
import constants from "../../constants";
import { AuthContext } from "../../context/Login";
import { MultipleSelect, ReviewDialog, Reviews } from "../../components";
import { ProfessionalInfoProps, VendorData } from "./Types";
import {
  removeUnderscoresAndFirstLetterCapital,
  truncateText,
} from "../../helpers/StringHelpers";
import axios from "axios";
import { StateContext } from "../../context";

const CustomPopper = styled(Popper)(() => ({
  "& .MuiAutocomplete-listbox": {
    maxHeight: "120px",
    overflowY: "auto",
  },
}));
import {
  fetchFinancialAdvisorDetails,
  updateFinancePlanner,
} from "../../controllers/finance-planners/VendorController";
import { submitFinancePlannerReview } from "../../controllers/ReviewController";

const FinancePlannerInfo: React.FC<ProfessionalInfoProps> = ({
  renderProfessionalInfoView,
  vendor_id,
}) => {
  const authContext = useContext(AuthContext);

  const stateContext = useContext(StateContext);

  if (authContext === undefined || stateContext === undefined) {
    return;
  }
  const { login, userDetails } = authContext;
  const { state } = stateContext;
  const { professionalId } = useParams();

  const {
    data: vendorData,
    isLoading: isVendorLoading,
    refetch: refetchFinancePlannerDetails,
  } = useQuery(["vendorDetails", professionalId], () =>
    fetchFinancialAdvisorDetails(
      vendor_id ? vendor_id.toString() : professionalId!
    )
  );

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
  const [reviewError, setReviewError] = useState("");
  const [loading, setLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const [updateVendorSnackbarOpen, setUpdateVendorSnackbarOpen] =
    useState(false);
  const [edit, setEdit] = useState(false);
  const [formData, setFormData] = useState<VendorData>();
  const [cities, setCities] = useState<string[]>([]);
  const [loadingCities, setLoadingCities] = useState(false);
  const [locationChangeDialogOpen, setLocationChangeDialogOpen] =
    useState(false);
  const [feesChangeDialogOpen, setFeesChangeDialogOpen] = useState(false);
  const [updateMessage, setUpdateMessage] = useState("");

  const handleReviewDialogOpen = () => {
    setReviewDialogOpen(true);
  };

  const handleStateChange = async (value: string | undefined) => {
    if (!value) return;
    setLoadingCities(true);
    if (value) {
      try {
        const response = await axios.get(
          `${constants.apiBaseUrl}/location/cities?state=${value}`
        );
        setCities(response.data.data);
      } catch (error) {}
    }
    setLoadingCities(false);
  };

  const handleUpdate = async (data: VendorData) => {
    if (data.state) {
      if (!data.city) {
        setUpdateMessage("Please select a city as well to update the state");
        setFormData(undefined);
        return;
      }
    }
    try {
      await updateFinancePlanner(data);
      setUpdateMessage("vendor updated successfully!");
    } catch (error) {}
    setFormData(undefined);
  };

  const handleDialogClose = (
    _?: React.SyntheticEvent<Element, Event>,
    reason?: "backdropClick" | "escapeKeyDown"
  ) => {
    if (reason && (reason === "backdropClick" || reason === "escapeKeyDown")) {
      return;
    }
    setLocationChangeDialogOpen(false);
    setFeesChangeDialogOpen(false);
    setReviewError("");
  };

  const handleEditButtonClick = async () => {
    if (edit) {
      await handleUpdate({
        ...formData,
        investment_ideology: Array.isArray(formData?.investment_ideology)
          ? formData.investment_ideology.toString()
          : vendorData?.investment_ideology?.toString(),
        deals: Array.isArray(formData?.deals)
          ? formData.deals.toString()
          : vendorData?.deals?.toString(),
        fees_type: Array.isArray(formData?.fees_type)
          ? formData.fees_type.toString()
          : vendorData?.fees_type?.toString(),
      });
      refetchFinancePlannerDetails();
      setUpdateVendorSnackbarOpen(true);
    }

    setEdit((prevEdit) => !prevEdit);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
    setUpdateVendorSnackbarOpen(false);
  };

  const handleReviewSubmit = async (event: FormEvent<HTMLFormElement>) => {
    setLoading(true);
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    submitFinancePlannerReview(
      formData,
      professionalId!,
      () => {
        setReviewDialogOpen(false);
        setSnackbarOpen(true);
      },
      (errorMessage) => {
        setReviewError(errorMessage);
      }
    );
    setLoading(false);
    window.location.reload();
  };

  const [expanded, setExpanded] = useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const isMobile = window.innerWidth < 1024;
  const maxVisibleLength = 100;

  const contentPreview =
    isMobile && !expanded
      ? truncateText(vendorData?.description!, maxVisibleLength)
      : vendorData?.description;
  const professionalCard = (
    <div className=" text-[12px] md:text-[16px]  lg:ml-6 lg:mt-7 flex-col flex lg:block gap-4 items-center p-2">
      <div className="flex flex-row lg:flex-col w-full">
        <div className="mt-[1em] lg:mt-0 w-1/2 lg:w-fit">
          <p className="font-bold  text-black">AUM handled</p>
          {edit ? (
            <input
              type="number"
              name="aum_handled"
              className="h-[40px] w-[70%] px-2 text-lg border-gray-400 rounded"
              defaultValue={vendorData?.aum_handled}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  aum_handled: Number(e.target.value),
                }))
              }
            />
          ) : (
            <p className="">
              {" "}
              <span className="mr-1">{"₹"}</span>
              {vendorData?.aum_handled ?? "N/A"}
            </p>
          )}
        </div>
        <div className="mt-[1em] w-1/2 lg:w-fit">
          <p className="font-bold  text-black">Sebi registered</p>

          <p className="">{vendorData?.sebi_registered?.toString() ?? "N/A"}</p>
        </div>
      </div>
      <div className="flex  w-full flex-row lg:flex-col ">
        <div className=" w-1/2 lg:w-fit mt-[1em]">
          <p className="font-bold  text-black">Fees</p>
          {edit ? (
            <button
              onClick={() => setFeesChangeDialogOpen(true)}
              className="border h-[40px] text-lg w-[70%] rounded border-gray-400 flex justify-start items-center px-2"
            >
              {formData?.fees ? formData.fees : vendorData?.fees}
            </button>
          ) : (
            <p className="flex">
              {vendorData?.fees_type && vendorData.fees_type[0] === "FIXED" && (
                <p className="mr-1">{"₹"}</p>
              )}
              {vendorData?.fees ?? "N/A"}

              {vendorData?.fees_type &&
                vendorData.fees_type[0] === "PERCENTAGE" && (
                  <p className="ml-1">{"%"}</p>
                )}
            </p>
          )}
        </div>
        <div className="w-1/2 lg:w-fit mt-[1em]">
          <p className="font-bold  text-black">Minimum investment</p>
          {edit ? (
            <input
              type="text"
              name="minimum_investment"
              className="h-[40px] w-[70%] px-2 text-lg border-gray-400 rounded"
              defaultValue={vendorData?.minimum_investment}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  minimum_investment: Number(e.target.value),
                }))
              }
            />
          ) : (
            <p className="">
              {" "}
              <span className="mr-1">{"₹"}</span>
              {vendorData?.minimum_investment ?? "N/A"}
            </p>
          )}
        </div>
      </div>
      <div className="flex  w-full flex-row lg:flex-col ">
        <div className=" w-1/2 lg:w-fit mt-[1em]">
          <p className="font-bold  text-black">Number of employees</p>

          {edit ? (
            <input
              type="text"
              name="number_of_employees"
              className="h-[40px] w-[70%] px-2 text-lg border-gray-400 rounded"
              defaultValue={vendorData?.number_of_employees}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  number_of_employees: Number(e.target.value),
                }))
              }
            />
          ) : (
            <p className="">{vendorData?.number_of_employees ?? "N/A"}</p>
          )}
        </div>
        <div className="w-1/2 lg:w-fit mt-[1em]">
          <p className="font-bold  text-black">Number of clients</p>
          {edit ? (
            <input
              type="text"
              name="number_of_clients"
              className="h-[40px] w-[70%] px-2 text-lg border-gray-400 rounded"
              defaultValue={vendorData?.number_of_clients}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  number_of_clients: Number(e.target.value),
                }))
              }
            />
          ) : (
            <p className="">{vendorData?.number_of_clients ?? "N/A"}</p>
          )}
        </div>
      </div>
      <div className="flex  w-full flex-row lg:flex-col ">
        <div className=" w-1/2 lg:w-fit mt-[1em]">
          <p className="font-bold  text-black">Location</p>
          {edit ? (
            <button
              onClick={() => setLocationChangeDialogOpen(true)}
              className="border h-[40px] w-[70%] rounded text-lg border-gray-400 flex justify-start items-center px-2"
            >
              {formData?.city ? formData.city : vendorData?.city}
            </button>
          ) : (
            <p className="">{vendorData?.city ?? "N/A"}</p>
          )}
        </div>
        <div className="w-1/2 lg:w-fit">
          <p className="font-bold text-black mt-[1em]">Contact Number</p>
          <p className="">{vendorData?.mobile ?? "N/A"}</p>
        </div>
      </div>
      <div className="flex flex-row lg:flex-col  w-full">
        {(vendorData?.social?.facebook ||
          vendorData?.social?.instagram ||
          vendorData?.social?.website) && (
          <div className="w-1/2 mt-[1em]">
            <p className="font-bold  text-black">Socials</p>
            {vendorData.social.facebook && (
              <a
                href={vendorData.social.facebook}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Facebook className="text-purple" />
              </a>
            )}
            {vendorData.social.instagram && (
              <a
                href={vendorData.social.instagram}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Instagram className="text-red" />
              </a>
            )}
            {vendorData.social.website && (
              <a
                href={vendorData.social.website}
                target="_blank"
                rel="noopener noreferrer"
              >
                <OpenInNew className="text-black" />
              </a>
            )}
          </div>
        )}
      </div>
      <div className="w-full mt-[1em]">
        <p className="font-bold  text-black">Email</p>
        <p className="">{vendorData?.email ?? "N/A"}</p>
      </div>
      <div className="lg:hidden w-full ">
        <p className="font-bold  text-black">About</p>

        {edit ? (
          <input
            type="text"
            name="description"
            className="h-[40px] w-[100%] px-2 text-lg  border-gray-400 rounded"
            defaultValue={vendorData?.description}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                description: e.target.value,
              }))
            }
          />
        ) : (
          <p className=" text-justify mb-[1em] rounded-md">
            {contentPreview}
            {isMobile &&
              vendorData?.description?.length! > maxVisibleLength && (
                <button
                  onClick={handleExpandClick}
                  className="text-blue-500 hover:text-blue-700 font-medium"
                >
                  {expanded ? "Read less" : "Read More"}
                </button>
              )}
          </p>
        )}
      </div>
    </div>
  );

  const professionalHeader = (
    <div className="flex flex-col md:flex-row md:items-center md:justify-center lg:justify-start   lg:items-start gap-3 md:mt-[2em] mb-[1em] w-[93vw] md:w-auto mx-auto">
      <div className="m-auto md:m-0 flex flex-col md:justify-center items-center">
        {vendorData?.logo ? (
          <img
            src={`${constants.apiImageUrl}/${vendorData.logo}`}
            alt="Vendor Logo"
            className="w-[80px] h-[80px] lg:w-[100px] lg:h-[100px] rounded-full"
          />
        ) : (
          <img
            src={NoLogoUploaded}
            alt=""
            className="w-[80px] h-[80px] lg:w-[100px] lg:h-[100px] rounded-full"
          />
        )}
        <div className="flex gap-1 items-center md:hidden">
          {edit ? (
            <input
              type="text"
              name="business_name"
              className="h-[40px] mt-2 px-2 text-lg border-gray-400 rounded"
              defaultValue={vendorData?.business_name}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  business_name: e.target.value,
                }))
              }
            />
          ) : (
            <p className="font-semibold text-base text-black text-center md:text-left mx-3 md:hidden">
              {removeUnderscoresAndFirstLetterCapital(
                vendorData?.business_name ?? "Unknown Business"
              )}
            </p>
          )}
          {(vendor_id || Number(professionalId) == userDetails.vendor_id) && (
            <button
              onClick={handleEditButtonClick}
              className="flex items-center justify-center"
            >
              {edit ? (
                <Tooltip
                  title="Save changes"
                  slotProps={{
                    popper: {
                      modifiers: [
                        {
                          name: "offset",
                          options: {
                            offset: [0, -14],
                          },
                        },
                      ],
                    },
                  }}
                >
                  <IconButton>
                    <SaveOutlined sx={{ fontSize: "20px" }} />
                  </IconButton>
                </Tooltip>
              ) : (
                <Tooltip
                  title="Edit profile"
                  slotProps={{
                    popper: {
                      modifiers: [
                        {
                          name: "offset",
                          options: {
                            offset: [0, -14],
                          },
                        },
                      ],
                    },
                  }}
                >
                  <IconButton>
                    <Edit sx={{ fontSize: "20px" }} />
                  </IconButton>
                </Tooltip>
              )}
            </button>
          )}
        </div>
      </div>
      <div className="w-[93vw] md:w-auto">
        <div className=" gap-2 items-center hidden md:flex">
          {edit ? (
            <input
              type="text"
              name="business_name"
              className="h-[40px] mt-2 px-2 text-lg  border-gray-400 rounded"
              defaultValue={vendorData?.business_name}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  business_name: e.target.value,
                }))
              }
            />
          ) : (
            <p className="font-semibold text-base text-black text-center md:text-left hidden md:block">
              {removeUnderscoresAndFirstLetterCapital(
                vendorData?.business_name ?? "Unknown Business"
              )}
            </p>
          )}

          {(vendor_id || Number(professionalId) == userDetails.vendor_id) && (
            <button
              onClick={handleEditButtonClick}
              className="flex items-center justify-center"
            >
              {edit ? (
                <Tooltip
                  title="Save changes"
                  slotProps={{
                    popper: {
                      modifiers: [
                        {
                          name: "offset",
                          options: {
                            offset: [0, -14],
                          },
                        },
                      ],
                    },
                  }}
                >
                  <IconButton>
                    <SaveOutlined sx={{ fontSize: "20px" }} />
                  </IconButton>
                </Tooltip>
              ) : (
                <Tooltip
                  title="Edit profile"
                  slotProps={{
                    popper: {
                      modifiers: [
                        {
                          name: "offset",
                          options: {
                            offset: [0, -14],
                          },
                        },
                      ],
                    },
                  }}
                >
                  <IconButton>
                    <Edit sx={{ fontSize: "20px" }} />
                  </IconButton>
                </Tooltip>
              )}
            </button>
          )}
        </div>
        <div className="mb-2 mt-2 flex flex-col md:flex-row gap-2 items-start md:items-center">
          <span className="font-bold text-[11px] md:text-sm text-black">
            DEALS :
          </span>{" "}
          {edit ? (
            <>
              <MultipleSelect
                apiEndpoint={`${constants.apiBaseUrl}/financial-advisor/deals`}
                onChange={(selected) => {
                  setFormData((prevData) => ({
                    ...prevData,
                    deals: selected,
                  }));
                }}
                maxSelection={3}
                selectedValue={
                  Array.isArray(vendorData?.deals)
                    ? vendorData?.deals
                    : vendorData?.deals?.split(",") || []
                }
              />
            </>
          ) : (
            <div className="flex flex-wrap gap-1">
              {vendorData?.deals &&
                Array.isArray(vendorData.deals) &&
                vendorData.deals.map((item, ind) => (
                  <Chip
                    label={removeUnderscoresAndFirstLetterCapital(item)}
                    variant="outlined"
                    key={ind}
                    sx={{ height: "20px", fontSize: "11px" }}
                  />
                ))}
            </div>
          )}
        </div>

        <div className="flex flex-col md:flex-row gap-2 items-start md:items-center mb-2">
          <span className="font-bold text-[11px] md:text-sm text-black">
            INVESTMENT IDEOLOGY :
          </span>
          {edit ? (
            <>
              <MultipleSelect
                apiEndpoint={`${constants.apiBaseUrl}/financial-advisor/investment-ideology`}
                onChange={(selected) => {
                  setFormData((prevData) => ({
                    ...prevData,
                    investment_ideology: selected,
                  }));
                }}
                maxSelection={3}
                selectedValue={
                  Array.isArray(vendorData?.investment_ideology)
                    ? vendorData?.investment_ideology
                    : vendorData?.investment_ideology?.split(",") || []
                }
              />
            </>
          ) : (
            <div className="flex flex-wrap gap-1">
              {vendorData?.investment_ideology &&
                Array.isArray(vendorData.investment_ideology) &&
                vendorData.investment_ideology.map((item, ind) => (
                  <Chip
                    label={removeUnderscoresAndFirstLetterCapital(item)}
                    variant="outlined"
                    key={ind}
                    sx={{ height: "20px", fontSize: "11px" }}
                  />
                ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  if (isVendorLoading) return <div className="min-h-screen">Loading...</div>;
  return (
    <>
      <div className="mt-[70px] text-text flex flex-col lg:flex-row  justify-center  min-h-screen">
        <div className="text-[10px] md:text-[16px] flex flex-col gap-7 md:gap-0">
          <div className=" md:w-max m-auto lg:m-0 my-[2em]">
            {professionalHeader}

            <div className="lg:hidden flex justify-center">
              {isMobile ? (
                <div className="border border-1 rounded-md border-[#d3d8e0] w-[93vw]">
                  {professionalCard}
                </div>
              ) : (
                <div className="">{professionalCard}</div>
              )}
            </div>

            {login && userDetails?.vendor_id !== Number(professionalId) && (
              <div className=" gap-3 mt-2 ml-[8px] md:flex mb-[2em]">
                <div>
                  {renderProfessionalInfoView && (
                    <Button
                      variant="outlined"
                      style={{ backgroundColor: "#8c52ff", color: "white" }}
                      onClick={handleReviewDialogOpen}
                    >
                      <StarBorder /> <p>Write a Review</p>
                    </Button>
                  )}
                </div>
              </div>
            )}
            <div id="reviews" className="mt-[20px] mb-[10px] w-[98vw] m-auto">
              <div className=" lg:w-[750px] flex justify-center flex-col items-center px-2">
                {
                  <Reviews
                    id={professionalId ? Number(professionalId) : Number(-1)}
                  />
                }
              </div>
            </div>
          </div>
        </div>

        <ReviewDialog
          handleReviewDialogClose={handleDialogClose}
          handleReviewSubmit={handleReviewSubmit}
          loading={loading}
          reviewDialogOpen={reviewDialogOpen}
          reviewError={reviewError}
          professional="financePlanner"
        />
      </div>

      <Snackbar
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        open={snackbarOpen}
        onClose={handleSnackbarClose}
        message="Review submitted successfully!"
        key="bottom-center"
        autoHideDuration={3000}
      />

      <Dialog open={locationChangeDialogOpen} onClose={() => handleDialogClose}>
        <DialogTitle>Edit the location</DialogTitle>

        <DialogContent className="flex flex-col gap-4  items-center w-fit justify-between">
          <div className="flex flex-col gap-2 ">
            <div className="flex flex-col">
              <p className="text-sm">Select your state</p>
              <Autocomplete
                disablePortal
                value={formData?.state ? formData?.state : vendorData?.state}
                size="small"
                id="city-autocomplete"
                options={state}
                onChange={(_event, value) => {
                  setFormData((prevData) => ({
                    ...prevData,
                    state: value ?? "",
                  }));
                }}
                sx={{
                  borderRadius: "5px",
                  border: "solid 0.3px",
                  width: "200px",
                }}
                PopperComponent={CustomPopper}
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
            </div>
            <div className="flex flex-col">
              <p className="text-sm">Select your city</p>
              <Autocomplete
                onFocus={() =>
                  handleStateChange(
                    formData?.state ? formData.state : vendorData?.state
                  )
                }
                disablePortal
                value={formData?.city ? formData?.city : vendorData?.city}
                size="small"
                id="city-autocomplete"
                options={cities}
                onChange={(_event, value) => {
                  setFormData((prevData) => ({
                    ...prevData,
                    city: value ?? "",
                  }));
                }}
                sx={{
                  borderRadius: "5px",
                  border: "solid 0.3px",
                  width: "200px",
                }}
                PopperComponent={CustomPopper}
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
            </div>
          </div>

          <DialogActions
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              gap: "10px",
              padding: 0,
              width: 200,
            }}
          >
            <Button
              onClick={handleDialogClose}
              variant="outlined"
              style={{ borderColor: "#000", color: "#000" }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              style={{
                background: "#8c52ff",
                height: "36px",
                width: "85px",
              }}
              onClick={() => setLocationChangeDialogOpen(false)}
            >
              Submit
            </Button>
          </DialogActions>
        </DialogContent>
      </Dialog>

      <Dialog open={feesChangeDialogOpen} onClose={() => handleDialogClose}>
        <DialogTitle>Edit the fees and its type</DialogTitle>

        <DialogContent className="flex flex-col gap-4  items-center w-fit justify-between">
          <div className="flex flex-col gap-2 ">
            <div className="flex flex-col">
              <p className="text-sm">Select your fees type</p>
              <MultipleSelect
                apiEndpoint={`${constants.apiBaseUrl}/financial-advisor/fees-type`}
                onChange={(selected) => {
                  setFormData((prevData) => ({
                    ...prevData,
                    fees_type: selected,
                  }));
                }}
                maxSelection={1}
                selectedValue={
                  Array.isArray(vendorData?.fees_type)
                    ? vendorData?.fees_type
                    : vendorData?.fees_type?.split(",") || []
                }
              />
            </div>
            <div className="flex flex-col">
              <p className="text-sm">Select your fees</p>
              <input
                type="text"
                name="fees"
                className="h-[40px] px-2 text-lg border-gray-400 rounded w-[206.67px]"
                defaultValue={vendorData?.fees}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    fees: Number(e.target.value),
                  }))
                }
              />
            </div>
          </div>

          <DialogActions
            sx={{
              display: "flex",
              justifyContent: "space-between",
              gap: "10px",
              padding: 0,
              width: 206.67,
            }}
          >
            <Button
              onClick={handleDialogClose}
              variant="outlined"
              style={{ borderColor: "#000", color: "#000" }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              style={{
                background: "#8c52ff",
                height: "36px",
                width: "85px",
              }}
              onClick={() => setFeesChangeDialogOpen(false)}
            >
              Submit
            </Button>
          </DialogActions>
        </DialogContent>
      </Dialog>

      <Snackbar
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        open={updateVendorSnackbarOpen}
        onClose={handleSnackbarClose}
        message={updateMessage}
        key="bottom-center"
        autoHideDuration={3000}
      />
    </>
  );
};

export default FinancePlannerInfo;
