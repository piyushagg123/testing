import * as React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import DialogContent from "@mui/material/DialogContent";
import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import PropTypes from "prop-types";
import { Input as BaseInput } from "@mui/base/Input";
import { styled } from "@mui/system";
import axios from "axios";
import CryptoJS from "crypto-js";
import constants from "../constants";
import { Alert, LoadingButton } from "@mui/lab";
import { StepContent, useTheme, useMediaQuery } from "@mui/material";

interface OTPProps {
  separator: React.ReactNode;
  length: number;
  value: string;
  onChange: (value: string) => void;
}
function OTP({ separator, length, value, onChange }: OTPProps) {
  const inputRefs = React.useRef<HTMLInputElement[]>(
    new Array(length).fill(null)
  );

  const focusInput = (targetIndex: number) => {
    const targetInput = inputRefs.current[targetIndex];
    targetInput.focus();
  };

  const selectInput = (targetIndex: number) => {
    const targetInput = inputRefs.current[targetIndex];
    targetInput.select();
  };

  const handleKeyDown = (
    event: React.KeyboardEvent<HTMLInputElement>,
    currentIndex: number
  ) => {
    switch (event.key) {
      case "ArrowUp":
      case "ArrowDown":
      case " ":
        event.preventDefault();
        break;
      case "ArrowLeft":
        event.preventDefault();
        if (currentIndex > 0) {
          focusInput(currentIndex - 1);
          selectInput(currentIndex - 1);
        }
        break;
      case "ArrowRight":
        event.preventDefault();
        if (currentIndex < length - 1) {
          focusInput(currentIndex + 1);
          selectInput(currentIndex + 1);
        }
        break;
      case "Delete":
        event.preventDefault();
        onChange(value.slice(0, currentIndex) + value.slice(currentIndex + 1));
        break;

      case "Backspace":
        event.preventDefault();
        if (currentIndex > 0) {
          focusInput(currentIndex - 1);
          selectInput(currentIndex - 1);
        }

        onChange(value.slice(0, currentIndex) + value.slice(currentIndex + 1));
        break;

      default:
        break;
    }
  };

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    currentIndex: number
  ) => {
    const currentValue = event.target.value;
    let indexToEnter = 0;

    while (indexToEnter <= currentIndex) {
      if (
        inputRefs.current[indexToEnter]?.value &&
        indexToEnter < currentIndex
      ) {
        indexToEnter += 1;
      } else {
        break;
      }
    }

    const otpArray = value.split("");
    const lastValue = currentValue[currentValue.length - 1];
    otpArray[indexToEnter] = lastValue;

    onChange(otpArray.join(""));

    if (currentValue !== "" && currentIndex < length - 1) {
      focusInput(currentIndex + 1);
    }
  };

  const handleClick = (
    _event: React.MouseEvent<HTMLInputElement>,
    currentIndex: number
  ) => {
    selectInput(currentIndex);
  };

  const handlePaste = (
    event: React.ClipboardEvent<HTMLInputElement>,
    currentIndex: number
  ) => {
    event.preventDefault();
    const clipboardData = event.clipboardData;

    if (clipboardData.types.includes("text/plain")) {
      let pastedText = clipboardData.getData("text/plain");
      pastedText = pastedText.substring(0, length).trim();
      let indexToEnter = 0;

      while (indexToEnter <= currentIndex) {
        if (
          inputRefs.current[indexToEnter].value &&
          indexToEnter < currentIndex
        ) {
          indexToEnter += 1;
        } else {
          break;
        }
      }

      const otpArray = value.split("");

      for (let i = indexToEnter; i < length; i += 1) {
        const lastValue = pastedText[i - indexToEnter] ?? " ";
        otpArray[i] = lastValue;
      }

      onChange(otpArray.join(""));
    }
  };
  return (
    <Box
      sx={{
        display: "flex",
        flexWrap: "wrap",
        gap: "4px",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
      }}
    >
      {new Array(length).fill(null).map((_, index) => (
        <React.Fragment key={index}>
          <BaseInput
            slots={{
              input: InputElement,
            }}
            aria-label={`Digit ${index + 1} of OTP`}
            slotProps={{
              input: {
                ref: (ele: HTMLInputElement) => {
                  inputRefs.current[index] = ele;
                },
                onKeyDown: (event) => handleKeyDown(event, index),
                onChange: (event) => handleChange(event, index),
                onClick: (event) => handleClick(event, index),
                onPaste: (event) => handlePaste(event, index),
                value: value[index] ?? "",
              },
            }}
          />
          {index === length - 1 ? null : separator}
        </React.Fragment>
      ))}
    </Box>
  );
}

const blue = {
  100: "#DAECFF",
  200: "#80BFFF",
  400: "#3399FF",
  500: "#007FFF",
  600: "#0072E5",
  700: "#0059B2",
};

const grey = {
  50: "#F3F6F9",
  100: "#E5EAF2",
  200: "#DAE2ED",
  300: "#C7D0DD",
  400: "#B0B8C4",
  500: "#9DA8B7",
  600: "#6B7A90",
  700: "#434D5B",
  800: "#303740",
  900: "#1C2025",
};

const InputElement = styled("input")(
  ({ theme }) => `
    width: 40px;
    font-family: 'IBM Plex Sans', sans-serif;
    font-size: 0.875rem;
    font-weight: 400;
    line-height: 1.5;
    padding: 8px 0px;
    border-radius: 8px;
    text-align: center;
    color: ${theme.palette.mode === "dark" ? grey[300] : grey[900]};
    background: ${theme.palette.mode === "dark" ? grey[900] : "#fff"};
    border: 1px solid ${theme.palette.mode === "dark" ? grey[700] : grey[200]};
    box-shadow: 0px 2px 4px ${
      theme.palette.mode === "dark" ? "rgba(0,0,0, 0.5)" : "rgba(0,0,0, 0.05)"
    };

    &:hover {
      border-color: ${blue[400]};
    }

    &:focus {
      border-color: ${blue[400]};
      box-shadow: 0 0 0 3px ${
        theme.palette.mode === "dark" ? blue[600] : blue[200]
      };
    }

    &:focus-visible {
      outline: 0;
    }
  `
);

OTP.propTypes = {
  length: PropTypes.number.isRequired,
  onChange: PropTypes.func.isRequired,
  separator: PropTypes.node,
  value: PropTypes.string.isRequired,
};

const ForgotPassword = () => {
  const [otp, setOtp] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const steps = [
    "Enter your email address",
    "Enter the OTP",
    "Enter the new password",
  ];
  const [activeStep, setActiveStep] = React.useState(0);
  const [accessToken, setAccessToken] = React.useState("");
  const [error, setError] = React.useState("");
  const [success, setSuccess] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  const theme = useTheme();

  // device-width > 1200px
  const isLargeDevice = useMediaQuery(theme.breakpoints.up("lg"));

  const handleNext = async () => {
    setError("");
    setSuccess("");
    setLoading(true);
    try {
      if (activeStep === 0) {
        const response = await axios.get(
          `${constants.apiBaseUrl}/user/password-reset/otp?email=${email}`
        );
        if (response) {
          setActiveStep((prevActiveStep) => prevActiveStep + 1);
          setError("");
        }
      } else if (activeStep === 1) {
        const response = await axios.get(
          `${constants.apiBaseUrl}/user/password-reset/validate-otp?otp=${otp}&email=${email}`
        );
        if (response) {
          setActiveStep((prevActiveStep) => prevActiveStep + 1);
          setAccessToken(response.data.otp_access_token);
          setError("");
        }
      } else if (activeStep === 2) {
        const newPass = CryptoJS.SHA1(password).toString();
        const response = await axios.post(
          `${constants.apiBaseUrl}/user/password-reset/update`,
          { password: newPass },
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        if (response.data.success) {
          setActiveStep((prevActiveStep) => prevActiveStep + 1);
          setError("");
          setSuccess("Password updated successfully");
        }
        handleReset();
      }
    } catch (error: any) {
      setError(error.response.data.debug_info);
    }
    setLoading(false);
  };

  const handleReset = () => {
    if (activeStep === 2) setSuccess("Password updated successfully");
    setActiveStep(0);
    setEmail("");
    setOtp("");
    setPassword("");
  };

  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Enter") {
        event.preventDefault();

        handleNext();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [activeStep, handleNext]);

  return (
    <div className="text-black lg:w-[70%] m-auto">
      {!success && (
        <div className="flex justify-center">
          <p className="text-2xl md:text-3xl text-center font-bold text-purple">
            Forget your password
          </p>
        </div>
      )}

      <DialogContent className="bg-prim text-black" style={{ padding: "15px" }}>
        <Box sx={{ width: "100%" }}>
          <div className="w-full flex justify-center mb-[1em]">
            {error && <Alert severity="error">{error}</Alert>}
            {success && (
              <Alert severity="success" sx={{ textAlign: "center" }}>
                {success}
              </Alert>
            )}
          </div>
          {!success && (
            <Stepper activeStep={activeStep} orientation="vertical">
              {steps.map((label, index) => (
                <Step key={index}>
                  <StepLabel>{label}</StepLabel>
                  <StepContent sx={{ paddingLeft: "8px", paddingRight: 0 }}>
                    {activeStep === steps.length ? (
                      <React.Fragment>
                        <Box
                          sx={{ display: "flex", flexDirection: "row", pt: 2 }}
                        >
                          <Box sx={{ flex: "1 1 auto" }} />
                          <Button onClick={handleReset}>Reset</Button>
                        </Box>
                      </React.Fragment>
                    ) : (
                      <React.Fragment>
                        <div className="mt-2 mb-1 pl-0">
                          {activeStep === 0 ? (
                            <Box
                              component="form"
                              sx={{
                                "& > :not(style)": {},
                                paddingLeft: 0,
                              }}
                              noValidate
                              autoComplete="off"
                            >
                              <TextField
                                id="standard-basic"
                                label="Enter your registered email ID"
                                variant="standard"
                                value={email}
                                onChange={(event) =>
                                  setEmail(event.target.value)
                                }
                                sx={{ width: "100%" }}
                              />
                            </Box>
                          ) : activeStep === 1 ? (
                            <Box
                              sx={{
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "center",
                                gap: 2,
                                marginTop: 3,
                                width: "100%",
                              }}
                            >
                              <OTP
                                separator={
                                  isLargeDevice ? <span> - </span> : ""
                                }
                                value={otp}
                                onChange={setOtp}
                                length={6}
                              />
                            </Box>
                          ) : (
                            <Box
                              component="form"
                              sx={{
                                "& > :not(style)": { width: "100%" },
                              }}
                              noValidate
                              autoComplete="off"
                            >
                              <TextField
                                id="standard-basic"
                                label="Enter your new password"
                                variant="standard"
                                type="password"
                                value={password}
                                onChange={(event) =>
                                  setPassword(event.target.value)
                                }
                              />
                            </Box>
                          )}
                        </div>

                        <Box
                          sx={{
                            display: "flex",
                            flexDirection: "row",
                            pt: 2,
                            justifyContent: "flex-end",
                            gap: "10px",
                            width: "100%",
                          }}
                        >
                          {activeStep === 1 ? (
                            <>
                              <Button
                                onClick={() => setActiveStep(0)}
                                variant="outlined"
                                style={{ color: "black", borderColor: "black" }}
                              >
                                Back
                              </Button>
                            </>
                          ) : (
                            <></>
                          )}
                          <LoadingButton
                            onClick={handleNext}
                            loading={loading}
                            variant="outlined"
                            style={{
                              color: "black",
                              borderColor: "black",
                              height: "36px",
                            }}
                          >
                            {loading ? (
                              ""
                            ) : (
                              <>
                                {activeStep === steps.length - 1
                                  ? "Submit"
                                  : "Next"}
                              </>
                            )}
                          </LoadingButton>
                        </Box>
                      </React.Fragment>
                    )}
                  </StepContent>
                </Step>
              ))}
            </Stepper>
          )}
        </Box>
      </DialogContent>
    </div>
  );
};

export default ForgotPassword;
