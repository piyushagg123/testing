import React, { useEffect, useState } from "react";
import Carousel from "react-material-ui-carousel";
import {
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  CardActionArea,
  Tooltip,
  Button,
  useTheme,
  useMediaQuery,
  ImageList,
  ImageListItem,
} from "@mui/material";
import PlaceIcon from "@mui/icons-material/Place";
import constants from "../constants";
import { NoLogoUploaded } from "../assets";
import {
  removeUnderscoresAndFirstLetterCapital,
  truncateText,
} from "../helpers/StringHelpers";

interface ImageCarouselProps {
  title: string;
  theme: string;
  city: string;
  state: string;
  imageObj: Record<string, string[]>;
  showProjectDetails: boolean;
  isSelected?: boolean;
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
  isSelected,
}) => {
  const keysArray = Object.keys(imageObj);
  const arr: string[] = [];
  keysArray.forEach((key) => {
    imageObj[key].forEach((img) => arr.push(img));
  });

  const [showImages, setShowImages] = useState(false);

  useEffect(() => {
    let imagesExist = keysArray.some((key) => imageObj[key].length > 0);
    setShowImages(imagesExist);
  }, [imageObj, keysArray]);
  const themeArray = theme?.split(",");

  const maxChipCount = 1;

  return (
    <>
      {showProjectDetails ? (
        <Card
          sx={{
            width: "130px",
            border: "none",
            boxShadow: "none",
            background: isSelected ? "#f2f2f2" : "",
          }}
        >
          <CardActionArea>
            <Box sx={{ width: "100%" }}>
              <WovenImageList items={arr} />
            </Box>
            <CardContent sx={{ padding: "0px 5px" }}>
              <Typography gutterBottom variant="h5" component="div">
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
                <p className={`flex gap-1 pb-1`}>
                  {themeArray.map(
                    (item, ind) =>
                      ind < maxChipCount && (
                        <div className="flex flex-col w-[120px]">
                          <div>
                            <div className="flex gap-1">
                              <p className="text-[10px] text-black"> {item}</p>
                              {themeArray.length > 1 && (
                                <span className="text-[10px] text-black">
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
                              {isSelected ? "Hide details" : "View details"}
                            </Button>
                          </div>
                        </div>
                      )
                  )}
                </p>
              </Typography>
            </CardContent>
          </CardActionArea>
        </Card>
      ) : keysArray.length > 0 ? (
        <Box sx={{ boxShadow: "none" }}>
          {showImages ? (
            keysArray.map((key) => (
              <>
                <p className="text-base font-bold">
                  {removeUnderscoresAndFirstLetterCapital(key)}
                </p>
                <Carousel
                  animation="slide"
                  cycleNavigation={false}
                  sx={{ boxShadow: "none" }}
                >
                  {imageObj[key]?.map((img, i) => (
                    <>
                      <Item key={i} item={img} />
                    </>
                  ))}
                </Carousel>
              </>
            ))
          ) : (
            <p className="text-center  ">No images uploaded by the designer</p>
          )}
        </Box>
      ) : (
        <>
          <p className="text-center ">No images uploaded by the designer</p>
        </>
      )}
    </>
  );
};

const Item: React.FC<ItemProps> = ({ item }) => {
  const theme = useTheme();
  //device-width > 900px
  const isLargeDevice = useMediaQuery(theme.breakpoints.up("md"));
  return (
    <Paper
      sx={{
        display: "flex",
        justifyContent: "center",
        marginBottom: "1em",
        boxShadow: "none",
      }}
    >
      <img
        src={`${constants.apiImageUrl}/${item}`}
        alt="Carousel Item"
        style={{ height: isLargeDevice ? "400px" : "200px" }}
      />
    </Paper>
  );
};

interface ItemProp {
  items: string[];
}
const WovenImageList: React.FC<ItemProp> = ({ items }) => {
  return (
    <>
      <ImageList
        sx={{
          height: 180,
          width: "130px",
          scrollbarWidth: "none",
          scrollbarColor: "black",
          padding: "10px",
          border: "solid #e5e7eb 0.2px",
          borderRadius: "10px",
        }}
        variant="standard"
        cols={1}
        gap={1}
      >
        {items.length !== 0 ? (
          <>
            {items?.map((item, ind: number) => (
              <>
                {ind < 1 && (
                  <ImageListItem key={ind}>
                    <img
                      src={`${constants.apiImageUrl}/${item}`}
                      loading="lazy"
                      style={{
                        height: "128.67px",
                      }}
                    />
                  </ImageListItem>
                )}
              </>
            ))}
          </>
        ) : (
          <>
            <ImageListItem>
              <img
                src={NoLogoUploaded}
                loading="lazy"
                style={{ height: "128.67px" }}
              />
            </ImageListItem>
          </>
        )}
      </ImageList>
    </>
  );
};

export default ImageCarousel;
