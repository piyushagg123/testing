import * as React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import { AuthContext } from "../context/Login";
import data from "../assets/data.json";
import { Link } from "react-router-dom";
import {
  Autocomplete,
  Button,
  CircularProgress,
  TextField,
} from "@mui/material";
import axios from "axios";
import constants from "../constants";
import { StateContext } from "../context/State";

const Banner = () => {
  const authContext = React.useContext(AuthContext);
  const stateContext = React.useContext(StateContext);
  if (stateContext === undefined || authContext === undefined) {
    throw new Error("StateContext must be used within a StateProvider");
  }

  const { state } = stateContext;

  const [cities, setCities] = React.useState<string[]>([]);
  const [selectedState, setSelectedState] = React.useState<string>("");
  const [loadingCities, setLoadingCities] = React.useState<boolean>(false);

  const handleStateChange = async (_event: any, value: string | null) => {
    setSelectedState(value ?? "");

    if (value) {
      setLoadingCities(true);
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
      setCities([]);
    }
  };

  if (authContext === undefined) {
    return;
  }
  return (
    <div className="mt-16">
      <div className="flex flex-col mb-28">
        <div className="bg-[#f0f0f0] w-[100%] m-auto flex flex-col items-center p-10">
          <h1 className="font-bold text-lg" style={{ color: "#576375" }}>
            FIND THE MOST SUITABLE INTERIOR DESIGNER NEAR YOU
          </h1>
          <p className="text-black text-m pt-2 pb-6">
            Answer a few questions to get a list of Interior Designers suitable
            for your needs
          </p>
          <div className="flex flex-col md:flex-row gap-2 items-center md:items-end">
            <label htmlFor="" className="text-text text-sm">
              Select your state
              <Autocomplete
                size="small"
                disablePortal
                id="state-autocomplete"
                options={state}
                onChange={(_event, value) => handleStateChange(_event, value)}
                sx={{
                  width: 225,
                  color: "white",
                  background: "white",
                  borderRadius: "4px",
                }}
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
            <label htmlFor="" className="text-text text-sm">
              Select your city
              <Autocomplete
                size="small"
                disablePortal
                id="city-autocomplete"
                options={selectedState ? cities : ["Select a state first"]}
                loading={loadingCities}
                disabled={!selectedState}
                sx={{
                  width: 225,
                  color: "white",
                  background: "white",
                  borderRadius: "4px",
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label={!selectedState ? "Select a state first" : ""}
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
            <Button
              variant="outlined"
              style={{
                backgroundColor: "#8c52ff",
                color: "white",
                height: "40px",
              }}
            >
              Get started
            </Button>
          </div>
        </div>
      </div>
      <div className="flex justify-center flex-wrap gap-6">
        {data.map((item, ind) => (
          <Link to={item.route}>
            <Card
              sx={{
                maxWidth: 345,
                maxHeight: 200,
                marginBottom: 0,
                paddingBottom: 0,
              }}
              key={ind}
            >
              <CardMedia sx={{ height: 140 }} image={item.image} />
              <CardContent sx={{ marginBottom: 0, paddingBottom: 0 }}>
                <Typography gutterBottom variant="h5">
                  {item.name}
                </Typography>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Banner;
