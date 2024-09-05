import { Card, CardContent, Typography } from "@mui/material";

const AboutUs = () => {
  return (
    <div className="min-h-screen mt-18 pt-20 text-lg px-20 bg-[#f7f8fa]">
      <h1 className="text-center  p-3 ">About us</h1>
      <div>
        <div className="bg-white  text-darkgrey">
          <p className="text-center">
            At Pickele, we’re creating a unique platform that aims to connect
            interior designers with customers. Why join us?
          </p>
          <br />
          <ul className="flex flex-wrap gap-14 items-center justify-center p-10">
            <li className="flex flex-col items-center justify-center">
              <p className="font-bold  text-xl">Completely Free </p>
              <p className="text-sm">No cost to join or use the platform.</p>
            </li>
            <li className="flex flex-col items-center justify-center  text-xl">
              <p className="font-bold ">Showcase Your Work</p>
              <p className="text-sm">A free space to display your portfolio.</p>
            </li>
            <li className="flex flex-col items-center justify-center text-xl">
              <p className="font-bold ">Increased Visibility </p>
              <p className="text-sm">
                Gain higher visibility and free advertising.
              </p>
            </li>
            <li className="flex flex-col items-center justify-center text-xl">
              <p className="font-bold ">More Business Inquiries </p>
              <p className="text-sm">
                Attract more potential clients and grow your business.
              </p>
            </li>
            <li className="flex flex-col items-center justify-center text-xl">
              <p className="font-bold ">New features</p>
              <p className="text-sm">
                Regular updates to the website almost daily.
              </p>
            </li>
          </ul>
          {/* <div className="flex flex-wrap justify-center gap-9">
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
          </div> */}
        </div>
        <br />
        <p>
          Where to view? The best experience for website is currently on web. We
          are building the mobile experience and shipping it to you soon!
        </p>
      </div>
    </div>
  );
};

export default AboutUs;
