// import { Button, Chip } from "@mui/material";
// import { useState } from "react";
// import OpenInNewIcon from "@mui/icons-material/OpenInNew";
// import FacebookIcon from "@mui/icons-material/Facebook";
// import InstagramIcon from "@mui/icons-material/Instagram";
// import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
// import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";

// const Section = ({ vendorData, selectedProject }) => {
//   const formatCategory = (str: string) => {
//     let formattedStr = str.replace(/_/g, " ");
//     formattedStr = formattedStr
//       .toLowerCase()
//       .split(" ")
//       .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
//       .join(" ");

//     return formattedStr;
//   };
//   const [expandedDetails, setExpandedDetails] = useState(false);
//   const handleExpandDetailsClick = () => {
//     setExpandedDetails(!expandedDetails);
//   };

//   const isMobile = window.innerWidth <= 768;
//   return (
//     <div className="w-[250px] text-lg  md:ml-10 md:mt-10">
//       <div className=" ">
//         <p className="font-bold text-base text-darkgrey">Contact Number</p>
//         <p className="text-[16px]">{vendorData?.mobile ?? "N/A"}</p>
//       </div>
//       <div className="mt-[1em] ">
//         <p className="font-bold text-base text-darkgrey">Email</p>
//         <p className="text-[16px]">{vendorData?.email ?? "N/A"}</p>
//       </div>
//       <div className="flex flex-col justify-evenly mt-[1em] gap-6">
//         {selectedProject ? (
//           <>
//             <div>
//               <p className="font-bold text-base text-purple">Project details</p>
//               <p className="font-bold text-base text-darkgrey">Title</p>
//               <p className="text-[16px] max-w-[300px]">
//                 {selectedProject.title}
//               </p>
//             </div>
//             <div>
//               <p className="font-bold text-base text-darkgrey">Description</p>
//               <p className="text-[16px] max-w-[300px]">
//                 {selectedProject.description}
//               </p>
//             </div>
//             <div>
//               <p className="font-bold text-base text-darkgrey">City</p>
//               <p className="text-[16px] max-w-[300px]">
//                 {selectedProject.city}
//               </p>
//             </div>
//             <div>
//               <p className="font-bold text-base text-darkgrey">State</p>
//               <p className="text-[16px] max-w-[300px]">
//                 {selectedProject.state}
//               </p>
//             </div>
//             <div>
//               <p className="font-bold text-base text-darkgrey">Spaces</p>
//               <p className="text-[16px]">
//                 {formatCategory(selectedProject.sub_category_2)
//                   .split(",")
//                   .map((item, ind) => (
//                     <>
//                       <Chip
//                         label={item}
//                         variant="outlined"
//                         key={ind}
//                         sx={{ height: "25px" }}
//                         style={{
//                           color: "linear-gradient(#ff5757,#8c52ff)",
//                         }}
//                       />
//                     </>
//                   ))}
//               </p>
//             </div>
//             <div>
//               <p className="font-bold text-base text-darkgrey">Theme</p>
//               <p className="text-[16px]">
//                 {formatCategory(selectedProject.sub_category_1)
//                   .split(",")
//                   .map((item, ind) => (
//                     <>
//                       <Chip
//                         label={item}
//                         variant="outlined"
//                         key={ind}
//                         sx={{ height: "25px" }}
//                         style={{
//                           color: "linear-gradient(#ff5757,#8c52ff)",
//                         }}
//                       />
//                     </>
//                   ))}
//               </p>
//             </div>
//             <div>
//               <p className="font-bold text-base text-darkgrey">Start Date</p>
//               <p className="text-[16px] max-w-[300px]">
//                 {selectedProject.start_date}
//               </p>
//             </div>
//             <div>
//               <p className="font-bold text-base text-darkgrey">End date</p>
//               <p className="text-[16px] max-w-[300px]">
//                 {selectedProject.end_date}
//               </p>
//             </div>
//           </>
//         ) : (
//           <>
//             {expandedDetails || !isMobile ? (
//               <>
//                 <div>
//                   <p className="font-bold text-base text-darkgrey">
//                     Typical Job Cost
//                   </p>
//                   <p className="text-[16px]">
//                     {vendorData?.average_project_value ?? "N/A"}
//                   </p>
//                 </div>

//                 <div>
//                   <p className="font-bold text-base text-darkgrey">
//                     Number of Employees
//                   </p>
//                   <p className="text-[16px]">
//                     {vendorData?.number_of_employees ?? "N/A"}
//                   </p>
//                 </div>

//                 <div>
//                   <p className="font-bold text-base text-darkgrey">
//                     Projects Completed
//                   </p>
//                   <p className="text-[16px]">
//                     {vendorData?.projects_completed ?? "N/A"}
//                   </p>
//                 </div>

//                 <div>
//                   <p className="font-bold text-base text-darkgrey">Location</p>
//                   <p className="text-[16px]">{vendorData?.city ?? "N/A"}</p>
//                 </div>

//                 {/* Social Links */}
//                 {(vendorData?.social?.facebook ||
//                   vendorData?.social?.instagram ||
//                   vendorData?.social?.website) && (
//                   <div>
//                     <p className="font-bold text-base text-darkgrey">Socials</p>
//                     {vendorData.social.facebook && (
//                       <a
//                         href={vendorData.social.facebook}
//                         target="_blank"
//                         rel="noopener noreferrer"
//                       >
//                         <FacebookIcon />
//                       </a>
//                     )}
//                     {vendorData.social.instagram && (
//                       <a
//                         href={vendorData.social.instagram}
//                         target="_blank"
//                         rel="noopener noreferrer"
//                       >
//                         <InstagramIcon />
//                       </a>
//                     )}
//                     {vendorData.social.website && (
//                       <a
//                         href={vendorData.social.website}
//                         target="_blank"
//                         rel="noopener noreferrer"
//                       >
//                         <OpenInNewIcon />
//                       </a>
//                     )}
//                   </div>
//                 )}
//               </>
//             ) : (
//               <Button
//                 variant="text"
//                 onClick={handleExpandDetailsClick}
//                 sx={{
//                   fontWeight: "medium",
//                   textTransform: "none",
//                 }}
//               >
//                 <KeyboardArrowDownIcon />
//               </Button>
//             )}

//             {expandedDetails && (
//               <Button
//                 variant="text"
//                 onClick={handleExpandDetailsClick}
//                 sx={{
//                   fontWeight: "medium",
//                   textTransform: "none",
//                 }}
//               >
//                 <KeyboardArrowUpIcon />
//               </Button>
//             )}
//           </>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Section;
import { Button, Card, CardContent, Chip } from "@mui/material";
import { useState } from "react";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { useMediaQuery } from "@mui/material";

const Section = ({ vendorData, selectedProject }) => {
  const isMobile = useMediaQuery("(max-width:768px)");
  const [expandedDetails, setExpandedDetails] = useState(false);
  const [openInfo, setOpenInfo] = useState(true);

  const handleExpandDetailsClick = () => {
    setExpandedDetails(!expandedDetails);
  };

  const formatCategory = (str) => {
    let formattedStr = str.replace(/_/g, " ");
    return formattedStr
      .toLowerCase()
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const content = (
    <div className=" text-lg  md:ml-10 md:mt-10">
      {/* Contact Number */}
      <div className="flex justify-between md:hidden">
        <p>Contact Information</p>
        <div>
          <button onClick={() => setOpenInfo((pre) => !pre)}>
            {openInfo ? <KeyboardArrowDownIcon /> : <KeyboardArrowUpIcon />}
          </button>
        </div>
      </div>
      {openInfo && (
        <>
          <div>
            <p className="font-bold text-base text-darkgrey">Contact Number</p>
            <p className="text-[16px]">{vendorData?.mobile ?? "N/A"}</p>
          </div>

          {/* Email */}
          <div className="mt-[1em]">
            <p className="font-bold text-base text-darkgrey">Email</p>
            <p className="text-[16px]">{vendorData?.email ?? "N/A"}</p>
          </div>

          {expandedDetails || !isMobile ? (
            <>
              {selectedProject ? (
                <>
                  {/* Project Details */}
                  <div>
                    <p className="font-bold text-base text-purple">
                      Project Details
                    </p>
                    <p className="font-bold text-base text-darkgrey">Title</p>
                    <p className="text-[16px] max-w-[300px]">
                      {selectedProject.title}
                    </p>
                  </div>
                  <div>
                    <p className="font-bold text-base text-darkgrey">
                      Description
                    </p>
                    <p className="text-[16px] max-w-[300px]">
                      {selectedProject.description}
                    </p>
                  </div>
                  <div>
                    <p className="font-bold text-base text-darkgrey">City</p>
                    <p className="text-[16px] max-w-[300px]">
                      {selectedProject.city}
                    </p>
                  </div>
                  <div>
                    <p className="font-bold text-base text-darkgrey">State</p>
                    <p className="text-[16px] max-w-[300px]">
                      {selectedProject.state}
                    </p>
                  </div>
                  <div>
                    <p className="font-bold text-base text-darkgrey">Spaces</p>
                    <p className="text-[16px]">
                      {formatCategory(selectedProject.sub_category_2)
                        .split(",")
                        .map((item, ind) => (
                          <Chip
                            label={item}
                            variant="outlined"
                            key={ind}
                            sx={{ height: "25px" }}
                            style={{
                              color: "linear-gradient(#ff5757,#8c52ff)",
                            }}
                          />
                        ))}
                    </p>
                  </div>
                  <div>
                    <p className="font-bold text-base text-darkgrey">Theme</p>
                    <p className="text-[16px]">
                      {formatCategory(selectedProject.sub_category_1)
                        .split(",")
                        .map((item, ind) => (
                          <Chip
                            label={item}
                            variant="outlined"
                            key={ind}
                            sx={{ height: "25px" }}
                            style={{
                              color: "linear-gradient(#ff5757,#8c52ff)",
                            }}
                          />
                        ))}
                    </p>
                  </div>
                </>
              ) : (
                <>
                  {/* Vendor Details */}
                  <div className="mt-[1em]">
                    <p className="font-bold text-base text-darkgrey">
                      Typical Job Cost
                    </p>
                    <p className="text-[16px]">
                      {vendorData?.average_project_value ?? "N/A"}
                    </p>
                  </div>
                  <div className="mt-[1em]">
                    <p className="font-bold text-base text-darkgrey">
                      Number of Employees
                    </p>
                    <p className="text-[16px]">
                      {vendorData?.number_of_employees ?? "N/A"}
                    </p>
                  </div>
                  <div className="mt-[1em]">
                    <p className="font-bold text-base text-darkgrey">
                      Projects Completed
                    </p>
                    <p className="text-[16px]">
                      {vendorData?.projects_completed ?? "N/A"}
                    </p>
                  </div>
                  <div className="mt-[1em]">
                    <p className="font-bold text-base text-darkgrey">
                      Location
                    </p>
                    <p className="text-[16px]">{vendorData?.city ?? "N/A"}</p>
                  </div>

                  {/* Social Links */}
                  {(vendorData?.social?.facebook ||
                    vendorData?.social?.instagram ||
                    vendorData?.social?.website) && (
                    <div className="mt-[1em]">
                      <p className="font-bold text-base text-darkgrey">
                        Socials
                      </p>
                      {vendorData.social.facebook && (
                        <a
                          href={vendorData.social.facebook}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <FacebookIcon />
                        </a>
                      )}
                      {vendorData.social.instagram && (
                        <a
                          href={vendorData.social.instagram}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <InstagramIcon />
                        </a>
                      )}
                      {vendorData.social.website && (
                        <a
                          href={vendorData.social.website}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <OpenInNewIcon />
                        </a>
                      )}
                    </div>
                  )}
                </>
              )}

              {/* Collapse Button */}
              {expandedDetails && (
                <Button
                  variant="text"
                  onClick={handleExpandDetailsClick}
                  sx={{
                    fontWeight: "medium",
                    textTransform: "none",
                    padding: 0,
                  }}
                >
                  Show Less
                </Button>
              )}
            </>
          ) : (
            /* Expand Button */
            <Button
              variant="text"
              onClick={handleExpandDetailsClick}
              sx={{
                fontWeight: "medium",
                textTransform: "none",
                padding: 0,
              }}
            >
              Show More
            </Button>
          )}
        </>
      )}
    </div>
  );

  return isMobile ? (
    <Card sx={{ maxWidth: "90vw", mt: 2, mx: "auto", background: "#8080800a" }}>
      <CardContent>{content}</CardContent>
    </Card>
  ) : (
    <div>{content}</div>
  );
};

export default Section;
