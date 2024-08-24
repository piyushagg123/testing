import * as React from "react";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import CloseIcon from "@mui/icons-material/Close";
import { AuthContext } from "../context/Login";
import data from "../assets/data.json";

const Banner = () => {
  const authContext = React.useContext(AuthContext);

  if (authContext === undefined) {
    return;
  }
  const { setShowBanner } = authContext;
  return (
    <div>
      <div className="flex justify-end">
        <CloseIcon
          onClick={() => setShowBanner(false)}
          sx={{ cursor: "pointer" }}
        />
      </div>
      <div className="flex justify-center flex-wrap gap-6">
        {data.map((item, ind) => (
          <Card sx={{ maxWidth: 345 }} key={ind}>
            <CardMedia
              sx={{ height: 140 }}
              image={item.image}
              title="green iguana"
            />
            <CardContent>
              <Typography gutterBottom variant="h5" component="div">
                {item.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {item.body}
              </Typography>
            </CardContent>
            <CardActions>
              <Button size="small">Learn More</Button>
            </CardActions>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Banner;
