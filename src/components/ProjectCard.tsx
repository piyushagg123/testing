import React, { useState } from "react";
import Carousel from "react-material-ui-carousel";
import {
  Chip,
  Paper,
  Typography,
  Box,
  Tabs,
  Tab,
  Card,
  CardContent,
  CardActionArea,
  Grid,
  useTheme,
  Tooltip,
  Button,
  useMediaQuery,
} from "@mui/material";
import PlaceIcon from "@mui/icons-material/Place";
import constants from "../constants";
import ImageList from "@mui/material/ImageList";
import ImageListItem from "@mui/material/ImageListItem";
import NoProjectImage from "../assets/noImageinProject.jpg";
import { truncateText } from "../utils";

interface ImageCarouselProps {
  title: string;
  theme: string;
  city: string;
  state: string;
  imageObj: Record<string, string[]>;
  showProjectDetails: boolean;
}
interface ItemProps {
  item: string;
}

const ImageCarousel: React.FC<ImageCarouselProps> = ({
  title,
  theme,
  city,
  imageObj,
  showProjectDetails = true,
}) => {
  const keysArray = Object.keys(imageObj);
  const arr: string[] = [];
  keysArray.forEach((key) => {
    imageObj[key].forEach((img) => arr.push(img));
  });

  const themeArray = theme?.split(",");

  const [selectedSpace, setSelectedSpace] = useState(keysArray[0]);

  const handleChange = (_event: React.SyntheticEvent, newValue: string) => {
    setSelectedSpace(newValue);
  };

  const funct = (ar: any) => {
    if (ar) {
      return ar.map((item: any) => (
        <img
          src={`${constants.apiImageUrl}/${item}`}
          className="h-10 ml-2"
          alt="indicator"
        />
      ));
    } else return;
  };

  const formatString = (str: string) => {
    const formattedStr = str.toLowerCase().replace(/_/g, " ");
    return formattedStr.charAt(0).toUpperCase() + formattedStr.slice(1);
  };
  const dynamicHeight = keysArray.length > 3 ? "520px" : "auto";
  const themes = useTheme();
  const matches = useMediaQuery(themes.breakpoints.up("md"));

  return (
    <>
      {showProjectDetails ? (
        <Card
          sx={{
            width: "355px",
            [themes.breakpoints.down("md")]: {
              width: "130px",
              border: "none",
              boxShadow: "none",
            },
          }}
        >
          <CardActionArea>
            <Box sx={{ width: "100%" }}>
              <WovenImageList items={arr} />
            </Box>
            <CardContent sx={{ padding: "0px 5px" }}>
              <Typography
                gutterBottom
                variant="h5"
                component="div"
                className={
                  matches ? "flex items-center justify-between mt-[1em]" : ""
                }
              >
                {title && (
                  <p className="font-bold text-base text-black">
                    <Tooltip title={title} placement="top-start">
                      <Button
                        sx={{
                          fontWeight: "700",
                          color: "black",
                          textTransform: "none",
                          justifyContent: "flex-start",
                          paddingX: 0,
                        }}
                      >
                        {truncateText(title, 15)}
                      </Button>
                    </Tooltip>
                  </p>
                )}

                <p className="text-[10px] flex items-center  text-sec">
                  <PlaceIcon sx={{ fontSize: "10px" }} />
                  {city}
                </p>
              </Typography>
              <Typography variant="body2">
                <p className={`flex gap-1 pb-1 lg:justify-start`}>
                  {matches ? (
                    <>
                      {themeArray.map(
                        (item, ind) =>
                          ind < 2 && (
                            <Chip
                              label={item}
                              variant="outlined"
                              key={ind}
                              sx={{ height: "25px" }}
                            />
                          )
                      )}
                    </>
                  ) : (
                    <>
                      {themeArray.map(
                        (item, ind) =>
                          ind < 1 && (
                            <div className="flex flex-col w-[120px]">
                              <div>
                                <div className="flex gap-1">
                                  <p className="text-[10px] text-text">
                                    {" "}
                                    {item}
                                  </p>
                                  {themeArray.length > 1 && (
                                    <span className="text-[10px] text-text">
                                      +{themeArray.length - 1}
                                    </span>
                                  )}
                                </div>
                              </div>
                              <div className="flex justify-center items-center mt-1">
                                <Button
                                  sx={{
                                    padding: 0,
                                    width: "100%",
                                    border: "solid red 0.3px",
                                    color: "red",
                                    textTransform: "none",
                                  }}
                                >
                                  View details
                                </Button>
                              </div>
                            </div>
                          )
                      )}
                    </>
                  )}
                  {matches ? (
                    <>
                      {themeArray.length > 2 && (
                        <span>+{themeArray.length - 2}</span>
                      )}
                    </>
                  ) : (
                    <></>
                  )}
                </p>
              </Typography>
            </CardContent>
          </CardActionArea>
        </Card>
      ) : keysArray.length > 0 ? (
        <Grid container spacing={2}>
          <Grid item xs={2}>
            <Tabs
              value={selectedSpace}
              onChange={handleChange}
              aria-label="Spaces tabs"
              orientation="vertical"
              variant={keysArray.length <= 3 ? "standard" : "scrollable"}
              sx={{
                textAlign: "center",
                rotate: "180deg",
                marginRight: "60px",
                height: dynamicHeight,

                "& .MuiTabs-indicator": {
                  transition: "none",
                },
                "& .MuiTab-root": {
                  transition: "none",
                },
                "& .MuiSvgIcon-root": {
                  marginLeft: "38px",
                },
                "& .MuiButtonBase-root": {
                  transition: "none",
                  animation: "none",
                },
              }}
              TabIndicatorProps={{
                sx: { display: "none" },
              }}
            >
              {keysArray.map((key) => (
                <Tab
                  label={
                    <span style={{ writingMode: "vertical-rl" }}>
                      {formatString(key)}
                    </span>
                  }
                  value={key}
                  key={key}
                  sx={{
                    transition: "none",
                    color: selectedSpace === key ? "black" : "grey",
                    "&.Mui-selected": {
                      color: "black",
                    },
                  }}
                />
              ))}
            </Tabs>
          </Grid>
          <Grid item xs={10} sx={{ position: "relative", top: "-60px" }}>
            <Box>
              <Carousel
                animation="slide"
                cycleNavigation={true}
                IndicatorIcon={funct(imageObj[selectedSpace])}
              >
                {imageObj[selectedSpace]?.map((img, i) => (
                  <>
                    <Item key={i} item={img} />
                  </>
                ))}
              </Carousel>
            </Box>
          </Grid>
        </Grid>
      ) : (
        <>
          <p className="text-center top-[-78px] relative">
            No images uploaded by the designer
          </p>
        </>
      )}
    </>
  );
};

const Item: React.FC<ItemProps> = ({ item }) => {
  return (
    <Paper
      sx={{ display: "flex", justifyContent: "center", marginBottom: "1em" }}
    >
      <img
        src={`${constants.apiImageUrl}/${item}`}
        alt="Carousel Item"
        style={{ height: "400px" }}
      />
    </Paper>
  );
};

interface ItemProp {
  items: string[];
}
const WovenImageList: React.FC<ItemProp> = ({ items }) => {
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.up("md"));
  let numberOfImages: number = 0;
  if (items.length <= 2) {
    numberOfImages = 1;
  } else {
    numberOfImages = 2;
  }

  return (
    <>
      <ImageList
        sx={{
          height: matches ? 250 : 180,
          width: matches ? "100% " : "130px",
          scrollbarWidth: "none",
          scrollbarColor: "black",
          padding: matches ? 0 : "10px",
          border: matches ? "none" : "solid #e5e7eb 0.2px",
          borderRadius: matches ? 0 : "10px",
        }}
        variant="standard"
        cols={matches ? numberOfImages : 1}
        gap={1}
      >
        {items.length !== 0 ? (
          <>
            {items?.map((item, ind: number) => (
              <>
                {matches ? (
                  <ImageListItem key={ind}>
                    <img
                      src={`${constants.apiImageUrl}/${item}`}
                      loading="lazy"
                    />
                  </ImageListItem>
                ) : (
                  <>
                    {ind < 1 && (
                      <ImageListItem key={ind}>
                        <img
                          src={`${constants.apiImageUrl}/${item}`}
                          loading="lazy"
                          style={{ height: matches ? "250px" : "128.67px" }}
                        />
                      </ImageListItem>
                    )}
                  </>
                )}
              </>
            ))}
          </>
        ) : (
          <>
            <ImageListItem>
              <img
                src={NoProjectImage}
                loading="lazy"
                style={{ height: matches ? "250px" : "128.67px" }}
              />
            </ImageListItem>
          </>
        )}
      </ImageList>
    </>
  );
};

export default ImageCarousel;
