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
} from "@mui/material";
import PlaceIcon from "@mui/icons-material/Place";
import config from "../config";
import ImageList from "@mui/material/ImageList";
import ImageListItem from "@mui/material/ImageListItem";
import NoProjectImage from "../assets/noImageinProject.jpg";

const truncateText = (text: string, wordLimit: number): string => {
  if (text.length > wordLimit) {
    return text.slice(0, wordLimit) + "...";
  }
  return text;
};

interface ImageCarouselProps {
  title: string;
  theme: string;
  city: string;
  state: string;
  imageObj: Record<string, string[]>;
  flag: boolean;
}
interface ItemProps {
  item: string;
}

const ImageCarousel: React.FC<ImageCarouselProps> = ({
  title,
  theme,
  city,
  imageObj,
  flag = true,
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
          src={`${config.apiImageUrl}/${item}`}
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

  if (title) title = truncateText(title, 20);
  const dynamicHeight = keysArray.length > 3 ? "520px" : "auto";

  return (
    <>
      {flag ? (
        <Card sx={{ height: 340, width: "355px" }}>
          <CardActionArea>
            <Box sx={{ width: "100%" }}>
              <WovenImageList items={arr} />
            </Box>
            <CardContent sx={{ padding: "0px 5px" }}>
              <br />
              <Typography
                gutterBottom
                variant="h5"
                component="div"
                className="flex items-center justify-between"
              >
                <p className="font-bold text-base text-darkgrey">{title}</p>
                <p className="text-[10px] flex items-center text-sec">
                  <PlaceIcon sx={{ fontSize: "15px" }} />
                  {city}
                </p>
              </Typography>
              <Typography variant="body2">
                <p className="flex gap-2 items-center">
                  <span className="font-bold">Theme: </span>
                  {themeArray.map((item, ind) => (
                    <Chip
                      label={item}
                      variant="outlined"
                      key={ind}
                      sx={{ height: "25px" }}
                    />
                  ))}
                </p>
              </Typography>
            </CardContent>
          </CardActionArea>
        </Card>
      ) : (
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
          <Grid item xs={10} sx={{ position: "relative", top: "-78px" }}>
            <Box>
              <Carousel
                animation="slide"
                cycleNavigation={true}
                IndicatorIcon={funct(imageObj[selectedSpace])}
              >
                {imageObj[selectedSpace]?.map((img, i) => (
                  <>
                    <Item key={i} item={img} />
                    <br />
                  </>
                ))}
              </Carousel>
            </Box>
          </Grid>
        </Grid>
      )}
    </>
  );
};

const Item: React.FC<ItemProps> = ({ item }) => {
  return (
    <Paper sx={{ display: "flex", justifyContent: "center" }}>
      <img
        src={`${config.apiImageUrl}/${item}`}
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
          width: "100%",
          height: 250,
          scrollbarWidth: "none",
          scrollbarColor: "black",
        }}
        variant="standard"
        cols={numberOfImages}
        gap={1}
      >
        {items.length !== 0 ? (
          <>
            {items?.map((item, ind: number) => (
              <ImageListItem key={ind}>
                <img src={`${config.apiImageUrl}/${item}`} loading="lazy" />
              </ImageListItem>
            ))}
          </>
        ) : (
          <>
            <ImageListItem>
              <img
                src={NoProjectImage}
                loading="lazy"
                style={{ height: "250px" }}
              />
            </ImageListItem>
          </>
        )}
      </ImageList>
    </>
  );
};

export default ImageCarousel;
