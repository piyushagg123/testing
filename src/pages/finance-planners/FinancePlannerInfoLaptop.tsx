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
  Dialog,
  DialogContent,
  Button,
  Snackbar,
  useMediaQuery,
  useTheme,
  DialogTitle,
  Alert,
  TextField,
  DialogActions,
  IconButton,
  Tooltip,
  CircularProgress,
  Autocomplete,
  styled,
  Popper,
} from "@mui/material";
import { useParams } from "react-router-dom";
import { useQuery } from "react-query";
import constants from "../../constants";
import { AuthContext, StateContext } from "../../context/index";
import { LoadingButton } from "@mui/lab";
import { ProfessionalInfoProps, VendorData } from "./Types";
import {
  removeUnderscoresAndFirstLetterCapital,
  truncateText,
} from "../../helpers/StringHelpers";
import { MultipleSelect, ReviewDialog, Reviews } from "../../components";
import {
  fetchFinancialAdvisorDetails,
  updateFinancePlanner,
} from "../../controllers/finance-planners/VendorController";
import { submitFinancePlannerReview } from "../../controllers/ReviewController";
import axios from "axios";

const CustomPopper = styled(Popper)(() => ({
  "& .MuiAutocomplete-listbox": {
    maxHeight: "120px",
    overflowY: "auto",
  },
}));

const FinancePlannerInfoLaptop: React.FC<ProfessionalInfoProps> = ({
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
  const [courseDialogOpen, setCourseDialogOpen] = useState(false);
  const [serviceDialogOpen, setServiceDialogOpen] = useState(false);
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

  const handleReviewDialogOpen = () => {
    setReviewDialogOpen(true);
  };

  const handleDialogClose = (
    _?: React.SyntheticEvent<Element, Event>,
    reason?: "backdropClick" | "escapeKeyDown"
  ) => {
    if (reason && (reason === "backdropClick" || reason === "escapeKeyDown")) {
      return;
    }
    setCourseDialogOpen(false);
    setServiceDialogOpen(false);
    setLocationChangeDialogOpen(false);
    setFeesChangeDialogOpen(false);
    setReviewError("");
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

  const maxVisibleLength = 100;

  const contentPreview = !expanded
    ? truncateText(vendorData?.description!, maxVisibleLength)
    : vendorData?.description;
  const professionalCard = (
    <div className=" text-[12px] md:text-[16px]  lg:ml-6 lg:mt-7 flex-col flex lg:block gap-4 items-center p-2 lg:border lg:rounded-md">
      <div className="flex flex-row w-full mt-[1em] ">
        <div className=" w-1/2 ">
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
            <p className="">₹{vendorData?.aum_handled ?? "N/A"}</p>
          )}
        </div>
        <div className="w-1/2 ">
          <p className="font-bold  text-black">Sebi registered</p>
          <p className="">{vendorData?.sebi_registered?.toString() ?? "N/A"}</p>
        </div>
      </div>
      <div className="flex  w-full flex-row mt-[1em] ">
        <div className=" w-1/2">
          <p className="font-bold  text-black"> Fees</p>
          {edit ? (
            <button
              onClick={() => setFeesChangeDialogOpen(true)}
              className="border h-[40px] w-[70%] rounded border-gray-400 flex justify-start items-center px-2"
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
        <div className="w-1/2">
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
            <p className="">₹{vendorData?.minimum_investment ?? "N/A"}</p>
          )}
        </div>
      </div>
      <div className="flex  w-full flex-row mt-[1em] ">
        <div className=" w-1/2">
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
        <div className="w-1/2 ">
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
      <div className="flex  w-full flex-row mt-[1em] ">
        <div className=" w-1/2 ">
          <p className="font-bold  text-black">Location</p>
          {edit ? (
            <button
              onClick={() => setLocationChangeDialogOpen(true)}
              className="border h-[40px] w-[70%] rounded border-gray-400 flex justify-start items-center px-2"
            >
              {formData?.city ? formData.city : vendorData?.city}
            </button>
          ) : (
            <p className="">{vendorData?.city ?? "N/A"}</p>
          )}
        </div>
        <div className="w-1/2 ">
          <p className="font-bold text-black ">Contact Number</p>
          <p className="">{vendorData?.mobile ?? "N/A"}</p>
        </div>
      </div>
      <div className="flex flex-row  w-full mt-[1em] ">
        {(vendorData?.social?.facebook ||
          vendorData?.social?.instagram ||
          vendorData?.social?.website) && (
          <div className="w-1/2">
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
      <div className="w-full mt-[1em] ">
        <p className="font-bold  text-black">Email</p>
        <p className="">{vendorData?.email ?? "N/A"}</p>
      </div>
      <div className=" w-full mt-[1em]">
        <p className="font-bold  text-black">About</p>

        {edit ? (
          <input
            type="text"
            name="number_of_clients"
            className="h-[40px] w-full px-2 text-lg border-gray-400 rounded"
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
            {vendorData?.description?.length! > maxVisibleLength && (
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
      </div>
      <div className="w-[93vw] md:w-auto">
        <div className="flex gap-1 items-center">
          {edit ? (
            <input
              type="text"
              name="business_name"
              className="h-[40px] px-2 text-lg border-gray-400 rounded"
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
  const theme = useTheme();

  // device-width > 900px
  const isLargeDevice = useMediaQuery(theme.breakpoints.up("md"));
  const isFullScreen = useMediaQuery(theme.breakpoints.down("sm"));
  if (isVendorLoading) return <div className="min-h-screen">Loading...</div>;
  return (
    <>
      <div className="mt-16 px-16 flex">
        <div className="w-[60%]">
          {professionalHeader}
          <div className=" md:w-max m-auto lg:m-0 my-[2em]">
            {login && userDetails?.vendor_id !== Number(professionalId) && (
              <div className=" gap-3 hidden md:flex mb-[2em]">
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
          </div>
          <br />
        </div>

        <div className="h-fit w-[40%] flex flex-col">
          {professionalCard}
          <br />

          <div id="reviews" className=" mb-[10px]  m-auto ml-6">
            <div className=" flex justify-center border rounded-md w-full flex-col items-center px-2   py-[1em]">
              {<Reviews id={Number(professionalId)} />}
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

      <Dialog open={locationChangeDialogOpen} onClose={() => handleDialogClose}>
        <DialogTitle sx={{ width: "450px" }}>Edit the location</DialogTitle>

        <DialogContent
          className="flex flex-col gap-4  items-center w-fit justify-between"
          sx={{ height: "190px" }}
        >
          <div className="flex gap-2 ">
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
              width: "408px",
              display: "flex",
              justifyContent: "flex-end",
              gap: "10px",
              padding: 0,
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
        <DialogTitle sx={{ width: "450px" }}>
          Edit the fees and its type
        </DialogTitle>

        <DialogContent
          className="flex flex-col gap-4  items-center w-fit justify-between"
          sx={{ height: "190px" }}
        >
          <div className="flex gap-2 ">
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
                className="h-[40px] px-2 text-lg border-gray-400 rounded"
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
              width: "435.33px",
              display: "flex",
              justifyContent: "flex-end",
              gap: "10px",
              padding: 0,
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

      <Snackbar
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        open={snackbarOpen}
        onClose={handleSnackbarClose}
        message="Review submitted successfully!"
        key="bottom-center"
        autoHideDuration={3000}
      />

      <Dialog
        open={courseDialogOpen}
        onClose={() => handleDialogClose}
        fullScreen={isFullScreen}
      >
        <form>
          <DialogTitle sx={{ width: isLargeDevice ? "524px" : "70vw" }}>
            Add a course
          </DialogTitle>

          <DialogContent className="flex flex-col gap-4 justify-center items-center">
            {reviewError && (
              <Alert
                severity="error"
                sx={{ width: isLargeDevice ? "524px" : "70vw" }}
              >
                {reviewError}
              </Alert>
            )}
            <TextField
              id="outlined-basic"
              label="Title"
              variant="outlined"
              size="small"
              name="title"
              fullWidth
              sx={{
                width: isLargeDevice ? "524px" : "70vw",
                marginTop: "10px",
                color: "black",
                borderRadius: "4px",
              }}
            />

            <div className="flex justify-between w-[524px]">
              <TextField
                id="outlined-basic"
                label="Duration"
                variant="outlined"
                size="small"
                name="title"
                fullWidth
                sx={{
                  width: isLargeDevice ? "245px" : "70vw",
                  marginTop: "10px",
                  color: "black",
                  borderRadius: "4px",
                }}
              />
              <TextField
                id="outlined-basic"
                label="Cost"
                variant="outlined"
                size="small"
                name="title"
                fullWidth
                sx={{
                  width: isLargeDevice ? "245px" : "70vw",
                  marginTop: "10px",
                  color: "black",
                  borderRadius: "4px",
                }}
              />
            </div>
            <TextField
              id="outlined-multiline-static"
              label="Description"
              name="body"
              multiline
              rows={4}
              sx={{
                width: isLargeDevice ? "524px" : "70vw",
                color: "black",
                borderRadius: "4px",
              }}
              fullWidth
            />

            <DialogActions
              sx={{
                width: isLargeDevice ? "524px" : "70vw",
                display: "flex",
                justifyContent: "flex-end",
                gap: "10px",
                padding: 0,
              }}
            >
              <Button
                onClick={handleDialogClose}
                variant="outlined"
                style={{ borderColor: "#000", color: "#000" }}
              >
                Cancel
              </Button>
              <LoadingButton
                type="submit"
                variant="contained"
                style={{ background: "#8c52ff", height: "36px", width: "85px" }}
                loading={loading}
              >
                {loading ? "" : <>Submit</>}
              </LoadingButton>
            </DialogActions>
          </DialogContent>
        </form>
      </Dialog>

      <Dialog
        open={serviceDialogOpen}
        onClose={() => handleDialogClose}
        fullScreen={isFullScreen}
      >
        <form>
          <DialogTitle sx={{ width: isLargeDevice ? "524px" : "70vw" }}>
            Add a service
          </DialogTitle>

          <DialogContent className="flex flex-col gap-4 justify-center items-center">
            {reviewError && (
              <Alert
                severity="error"
                sx={{ width: isLargeDevice ? "524px" : "70vw" }}
              >
                {reviewError}
              </Alert>
            )}
            <TextField
              id="outlined-basic"
              label="Title"
              variant="outlined"
              size="small"
              name="title"
              fullWidth
              sx={{
                width: isLargeDevice ? "524px" : "70vw",
                marginTop: "10px",
                color: "black",
                borderRadius: "4px",
              }}
            />

            <div className="flex justify-between w-[524px]">
              <TextField
                id="outlined-basic"
                label="Duration"
                variant="outlined"
                size="small"
                name="title"
                fullWidth
                sx={{
                  width: isLargeDevice ? "245px" : "70vw",
                  marginTop: "10px",
                  color: "black",
                  borderRadius: "4px",
                }}
              />
              <TextField
                id="outlined-basic"
                label="Cost"
                variant="outlined"
                size="small"
                name="title"
                fullWidth
                sx={{
                  width: isLargeDevice ? "245px" : "70vw",
                  marginTop: "10px",
                  color: "black",
                  borderRadius: "4px",
                }}
              />
            </div>
            <TextField
              id="outlined-multiline-static"
              label="Description"
              name="body"
              multiline
              rows={4}
              sx={{
                width: isLargeDevice ? "524px" : "70vw",
                color: "black",
                borderRadius: "4px",
              }}
              fullWidth
            />

            <DialogActions
              sx={{
                width: isLargeDevice ? "524px" : "70vw",
                display: "flex",
                justifyContent: "flex-end",
                gap: "10px",
                padding: 0,
              }}
            >
              <Button
                onClick={handleDialogClose}
                variant="outlined"
                style={{ borderColor: "#000", color: "#000" }}
              >
                Cancel
              </Button>
              <LoadingButton
                type="submit"
                variant="contained"
                style={{ background: "#8c52ff", height: "36px", width: "85px" }}
                loading={loading}
              >
                {loading ? "" : <>Submit</>}
              </LoadingButton>
            </DialogActions>
          </DialogContent>
        </form>
      </Dialog>
    </>
  );
};

export default FinancePlannerInfoLaptop;
