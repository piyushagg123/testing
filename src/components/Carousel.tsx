import React from "react";
import Carousel from "react-material-ui-carousel";
import {
  Paper,
  Typography,
  Card,
  CardContent,
  CardActionArea,
  Box,
} from "@mui/material";
import PlaceIcon from "@mui/icons-material/Place";
import config from "../config";

import EmptyProjectImage from "../assets/background.jpg";

interface ImageCarouselProps {
  title: string;
  theme: string;
  city: string;
  state: string;
  imageObj: Record<string, string[]>;
}

interface ItemProps {
  item: string;
}

const ImageCarousel: React.FC<ImageCarouselProps> = ({
  title,
  theme,
  city,
  imageObj,
}) => {
  const keysArray = Object.keys(imageObj);
  const arr: string[] = [];
  keysArray.forEach((key) => {
    imageObj[key].forEach((img) => arr.push(img));
  });

  return (
    <Card sx={{ height: 290, width: "47%" }}>
      <CardActionArea>
        <Box sx={{ width: "100%" }}>
          {arr.length !== 0 ? (
            <>
              <Carousel
                autoPlay={true}
                animation="slide"
                cycleNavigation={true}
                interval={2000}
                indicatorIconButtonProps={{
                  style: {
                    display: "none",
                  },
                }}
              >
                {arr.map((item, i) => (
                  <Item key={i} item={item} />
                ))}
              </Carousel>
            </>
          ) : (
            <>
              <img
                src={EmptyProjectImage}
                alt=""
                style={{ width: "100%", height: "200px" }}
              />
            </>
          )}
        </Box>
        <CardContent sx={{ padding: "0px 5px" }}>
          <div className="flex flex-row items-center justify-between">
            <p className="text-bold text-base">{title}</p>
            <span
              className=" text-sm flex items-center text-sec"
              style={{ fontSize: "0.75rem" }}
            >
              <PlaceIcon style={{ fontSize: "1rem" }} />
              {city}
            </span>
          </div>

          <Typography variant="body2">
            <p>
              <span className="font-bold">Theme:</span> {theme}
            </p>
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

const Item: React.FC<ItemProps> = ({ item }) => {
  return (
    <Paper>
      <img
        src={`${config.apiImageUrl}/${item}`}
        alt="Carousel Item"
        style={{ width: "100%", height: "200px" }}
      />
    </Paper>
  );
};

export default ImageCarousel;
