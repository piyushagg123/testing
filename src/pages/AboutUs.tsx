import { Card, CardContent, Typography } from "@mui/material";

const AboutUs = () => {
  return (
    <div className="min-h-screen mt-20 text-lg px-20">
      <p>
        At Pickele, we’re creating a unique platform that aims to connect
        interior designers with customers. Why join us?
      </p>
      <br />
      {/* <ul>
        <li>
          <span className="font-bold text-purple">Completely Free: </span>No
          cost to join or use the platform.
        </li>
        <li>
          <span className="font-bold text-purple">Showcase Your Work: </span>A
          free space to display your portfolio.
        </li>
        <li>
          <span className="font-bold text-purple">Increased Visibility: </span>
          Gain higher visibility and free advertising.
        </li>
        <li>
          <span className="font-bold text-purple">
            More Business Inquiries:{" "}
          </span>
          Attract more potential clients and grow your business.
        </li>
        <li>
          <span className="font-bold text-purple">New features: </span>Regular
          updates to the website almost daily.
        </li>
      </ul> */}
      <div className="flex flex-wrap justify-center gap-9">
        <Card
          sx={{
            minWidth: 275,
            height: 200,
            backgroundColor: "rgba(140, 82, 255,0.1)",
          }}
        >
          <CardContent
            sx={{
              height: "100%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              gap: "20px",
            }}
          >
            <Typography
              variant="h5"
              component="div"
              sx={{ color: "#8c52ff", fontWeight: "bold" }}
            >
              Completely Free
            </Typography>
            <Typography variant="body2">
              No cost to join or use the platform
            </Typography>
          </CardContent>
        </Card>
        <Card
          sx={{
            minWidth: 275,
            height: 200,
            backgroundColor: "rgba(140, 82, 255,0.1)",
          }}
        >
          <CardContent
            sx={{
              height: "100%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              gap: "20px",
            }}
          >
            <Typography
              variant="h5"
              component="div"
              sx={{ color: "#8c52ff", fontWeight: "bold" }}
            >
              Showcase Your Work
            </Typography>
            <Typography variant="body2">
              A free space to display your portfolio.
            </Typography>
          </CardContent>
        </Card>
        <Card
          sx={{
            minWidth: 275,
            height: 200,
            backgroundColor: "rgba(140, 82, 255,0.1)",
          }}
        >
          <CardContent
            sx={{
              height: "100%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              gap: "20px",
            }}
          >
            <Typography
              variant="h5"
              component="div"
              sx={{ color: "#8c52ff", fontWeight: "bold" }}
            >
              Increased Visibility
            </Typography>
            <Typography variant="body2">
              Gain higher visibility and free advertising.
            </Typography>
          </CardContent>
        </Card>
        <Card
          sx={{
            minWidth: 275,
            height: 200,
            backgroundColor: "rgba(140, 82, 255,0.1)",
          }}
        >
          <CardContent
            sx={{
              height: "100%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              gap: "20px",
            }}
          >
            <Typography
              variant="h5"
              component="div"
              sx={{ color: "#8c52ff", fontWeight: "bold" }}
            >
              More Business Inquiries
            </Typography>
            <Typography variant="body2">
              Attract more potential clients and grow your business.
            </Typography>
          </CardContent>
        </Card>
        <Card
          sx={{
            minWidth: 275,
            height: 200,
            backgroundColor: "rgba(140, 82, 255,0.1)",
          }}
        >
          <CardContent
            sx={{
              height: "100%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              gap: "20px",
            }}
          >
            <Typography
              variant="h5"
              component="div"
              sx={{ color: "#8c52ff", fontWeight: "bold" }}
            >
              New features
            </Typography>
            <Typography variant="body2">
              Regular updates to the website almost daily.
            </Typography>
          </CardContent>
        </Card>
      </div>
      <br />
      <p>
        Where to view? The best experience for website is currently on web. We
        are building the mobile experience and shipping it to you soon!
      </p>
    </div>
  );
};

export default AboutUs;
