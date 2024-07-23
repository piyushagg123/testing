import Carousel from "react-material-ui-carousel";
import { Paper, Typography } from "@mui/material";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import { CardActionArea } from "@mui/material";
import PlaceIcon from "@mui/icons-material/Place";
import Box from "@mui/material/Box";
import config from "../config";

const ImageCarousel = ({
  title,
  desc,
  theme,
  spaces,
  city,
  state,
  imageObj,
}) => {
  const keysArray = Object.keys(imageObj);
  const arr = [];
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
            {/* <p>{desc}</p> */}
            <p>
              <span className="font-bold">Theme:</span> {theme}
            </p>
            {/* <p className="overflow-x-clip">
              <span className="font-bold">Spaces:</span> {spaces}
            </p> */}
            {/* <p>
              {city},{state}
            </p> */}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

const Item = ({ item }) => {
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
