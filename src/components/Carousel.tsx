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
  state,
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
        </Box>
        <CardContent sx={{ padding: "0px 5px" }}>
          <Typography
            gutterBottom
            variant="h5"
            component="div"
            className="flex items-center justify-between"
          >
            <p>{title}</p>
            <p className="text-sm flex items-center">
              <PlaceIcon />
              {city},{state}
            </p>
          </Typography>
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
