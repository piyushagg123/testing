import Carousel from "react-material-ui-carousel";
import { Paper, Typography } from "@mui/material";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import { CardActionArea } from "@mui/material";

import Box from "@mui/material/Box";

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
    <Card sx={{ maxWidth: 355, height: 500 }}>
      <CardActionArea>
        <Box sx={{ width: 355 }}>
          <Carousel
            autoPlay={true}
            animation="slide"
            cycleNavigation={true}
            interval={2000}
          >
            {arr.map((item, i) => (
              <Item key={i} item={item} />
            ))}
          </Carousel>
        </Box>
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            {title}
          </Typography>
          <Typography variant="body2">
            <p>{desc}</p>
            <p>
              <span className="font-bold">Theme:</span> {theme}
            </p>
            <p>
              <span className="font-bold">Spaces:</span> {spaces}
            </p>
            <p>
              {city},{state}
            </p>
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
        src={`https://designmatch-s3-bucket.s3.ap-south-1.amazonaws.com/${item}`}
        alt="Carousel Item"
        style={{ width: "100%", height: "312px" }}
      />
    </Paper>
  );
};

export default ImageCarousel;
