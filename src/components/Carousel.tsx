// import React from "react";
// import Carousel from "react-material-ui-carousel";
// import {
//   Paper,
//   Typography,
//   Card,
//   CardContent,
//   CardActionArea,
//   Box,
// } from "@mui/material";
// import PlaceIcon from "@mui/icons-material/Place";
// import config from "../config";

// import EmptyProjectImage from "../assets/background.jpg";

// interface ImageCarouselProps {
//   title: string;
//   theme: string;
//   city: string;
//   state: string;
//   imageObj: Record<string, string[]>;
// }

// interface ItemProps {
//   item: string;
// }

// const ImageCarousel: React.FC<ImageCarouselProps> = ({
//   title,
//   theme,
//   city,
//   imageObj,
// }) => {
//   const keysArray = Object.keys(imageObj);
//   const arr: string[] = [];
//   keysArray.forEach((key) => {
//     imageObj[key].forEach((img) => arr.push(img));
//   });

//   return (
//     <Card sx={{ height: 290, width: "47%" }}>
//       <CardActionArea>
//         <Box sx={{ width: "100%" }}>
//           {arr.length !== 0 ? (
//             <>
//               <Carousel
//                 autoPlay={true}
//                 animation="slide"
//                 cycleNavigation={true}
//                 interval={2000}
//                 indicatorIconButtonProps={{
//                   style: {
//                     display: "none",
//                   },
//                 }}
//               >
//                 {arr.map((item, i) => (
//                   <Item key={i} item={item} />
//                 ))}
//               </Carousel>
//             </>
//           ) : (
//             <>
//               <img
//                 src={EmptyProjectImage}
//                 alt=""
//                 style={{ width: "100%", height: "200px" }}
//               />
//             </>
//           )}
//         </Box>
//         <CardContent sx={{ padding: "0px 5px" }}>
//           <div className="flex flex-row items-center justify-between">
//             <p className="text-bold text-base">{title}</p>
//             <span
//               className=" text-sm flex items-center text-sec"
//               style={{ fontSize: "0.75rem" }}
//             >
//               <PlaceIcon style={{ fontSize: "1rem" }} />
//               {city}
//             </span>
//           </div>

//           <Typography variant="body2">
//             <p>
//               <span className="font-bold">Theme:</span> {theme}
//             </p>
//           </Typography>
//         </CardContent>
//       </CardActionArea>
//     </Card>
//   );
// };

// const Item: React.FC<ItemProps> = ({ item }) => {
//   return (
//     <Paper>
//       <img
//         src={`${config.apiImageUrl}/${item}`}
//         alt="Carousel Item"
//         style={{ width: "100%", height: "200px" }}
//       />
//     </Paper>
//   );
// };

// export default ImageCarousel;

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
import WovenImageList from "./Test";

const truncateText = (text: string, wordLimit: number): string => {
  if (text.length > wordLimit) {
    return text.slice(0, wordLimit) + "...";
  }
  return text;
};

const ImageCarousel = ({
  title,
  desc,
  theme,
  spaces,
  city,
  state,
  imageObj,
  flag = true,
}) => {
  const keysArray = Object.keys(imageObj);
  const arr = [];
  keysArray.forEach((key) => {
    imageObj[key].forEach((img) => arr.push(img));
  });

  const themeArray = theme?.split(",");

  const [selectedSpace, setSelectedSpace] = useState(keysArray[0]);

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setSelectedSpace(newValue);
  };

  if (title) title = truncateText(title, 10);
  return (
    <>
      {flag ? (
        <Card sx={{ height: 290, width: "355px" }}>
          <CardActionArea>
            <Box sx={{ width: "100%" }}>
              {/* <Carousel
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
              </Carousel> */}
              <WovenImageList img={arr} />
            </Box>
            <CardContent sx={{ padding: "0px 5px" }}>
              <Typography
                gutterBottom
                variant="h5"
                component="div"
                className="flex items-center justify-between"
              >
                <p>{title}</p>
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
              sx={{ width: "100%", textAlign: "center", rotate: "180deg" }}
              TabIndicatorProps={{
                sx: { display: "none" },
              }}
            >
              {keysArray.map((key) => (
                <Tab
                  label={
                    <span style={{ writingMode: "vertical-rl" }}>{key}</span>
                  }
                  value={key}
                  key={key}
                />
              ))}
            </Tabs>
          </Grid>
          <Grid item xs={10}>
            <Box>
              {imageObj[selectedSpace].map((img, i) => (
                <>
                  <Item key={i} item={img} />
                  <br />
                </>
              ))}
            </Box>
          </Grid>
        </Grid>
      )}
    </>
  );
};

const Item = ({ item }) => {
  return (
    <Paper>
      <img
        src={`https://designmatch-s3-bucket.s3.ap-south-1.amazonaws.com/${item}`}
        alt="Carousel Item"
        style={{ height: "400px" }}
      />
    </Paper>
  );
};

export default ImageCarousel;
