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
//         <p className="font-bold  text-darkgrey">Contact Number</p>
//         <p className="">{vendorData?.mobile ?? "N/A"}</p>
//       </div>
//       <div className="mt-[1em] ">
//         <p className="font-bold  text-darkgrey">Email</p>
//         <p className="">{vendorData?.email ?? "N/A"}</p>
//       </div>
//       <div className="flex flex-col justify-evenly mt-[1em] gap-6">
//         {selectedProject ? (
//           <>
//             <div>
//               <p className="font-bold  text-purple">Project details</p>
//               <p className="font-bold  text-darkgrey">Title</p>
//               <p className=" max-w-[300px]">
//                 {selectedProject.title}
//               </p>
//             </div>
//             <div>
//               <p className="font-bold  text-darkgrey">Description</p>
//               <p className=" max-w-[300px]">
//                 {selectedProject.description}
//               </p>
//             </div>
//             <div>
//               <p className="font-bold  text-darkgrey">City</p>
//               <p className=" max-w-[300px]">
//                 {selectedProject.city}
//               </p>
//             </div>
//             <div>
//               <p className="font-bold  text-darkgrey">State</p>
//               <p className=" max-w-[300px]">
//                 {selectedProject.state}
//               </p>
//             </div>
//             <div>
//               <p className="font-bold  text-darkgrey">Spaces</p>
//               <p className="">
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
//               <p className="font-bold  text-darkgrey">Theme</p>
//               <p className="">
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
//               <p className="font-bold  text-darkgrey">Start Date</p>
//               <p className=" max-w-[300px]">
//                 {selectedProject.start_date}
//               </p>
//             </div>
//             <div>
//               <p className="font-bold  text-darkgrey">End date</p>
//               <p className=" max-w-[300px]">
//                 {selectedProject.end_date}
//               </p>
//             </div>
//           </>
//         ) : (
//           <>
//             {expandedDetails || !isMobile ? (
//               <>
//                 <div>
//                   <p className="font-bold  text-darkgrey">
//                     Typical Job Cost
//                   </p>
//                   <p className="">
//                     {vendorData?.average_project_value ?? "N/A"}
//                   </p>
//                 </div>

//                 <div>
//                   <p className="font-bold  text-darkgrey">
//                     Number of Employees
//                   </p>
//                   <p className="">
//                     {vendorData?.number_of_employees ?? "N/A"}
//                   </p>
//                 </div>

//                 <div>
//                   <p className="font-bold  text-darkgrey">
//                     Projects Completed
//                   </p>
//                   <p className="">
//                     {vendorData?.projects_completed ?? "N/A"}
//                   </p>
//                 </div>

//                 <div>
//                   <p className="font-bold  text-darkgrey">Location</p>
//                   <p className="">{vendorData?.city ?? "N/A"}</p>
//                 </div>

//                 {/* Social Links */}
//                 {(vendorData?.social?.facebook ||
//                   vendorData?.social?.instagram ||
//                   vendorData?.social?.website) && (
//                   <div>
//                     <p className="font-bold  text-darkgrey">Socials</p>
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
import { Chip } from "@mui/material";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import { useMediaQuery } from "@mui/material";

interface VendorData {
  logo?: string;
  category: string;
  sub_category_1: string;
  sub_category_2: string;
  sub_category_3: string;
  description: string;
  business_name: string;
  average_project_value: string;
  number_of_employees: number;
  projects_completed: number;
  mobile: string;
  email: string;
  city: string;
  social?: {
    facebook?: string;
    instagram?: string;
    website?: string;
  };
}

interface ProjectData {
  images: Record<string, string[]>;
  title: string;
  description: string;
  city: string;
  state: string;
  sub_category_1: string;
  sub_category_2: string;
  start_date: string;
  end_date: string;
}

interface SectionProps {
  vendorData: VendorData | undefined;
  selectedProject: ProjectData | undefined;
}

const Section: React.FC<SectionProps> = ({ vendorData, selectedProject }) => {
  const isMobile = useMediaQuery("(max-width:768px)");

  const formatCategory = (str: string) => {
    let formattedStr = str.replace(/_/g, " ");
    return formattedStr
      .toLowerCase()
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const content = (
    <div className=" text-[12px] md:text-[16px]  md:ml-10 md:mt-10 flex-col flex md:block gap-4 items-center p-2">
      <>
        {/* <div>
          <p className="font-bold text-darkgrey">Contact Number</p>
          <p className="">{vendorData?.mobile ?? "N/A"}</p>
        </div>

       
        <div className="">
          <p className="font-bold  text-darkgrey">Email</p>
          <p className="">{vendorData?.email ?? "N/A"}</p>
        </div> */}

        <>
          {selectedProject ? (
            <>
              {/* Project Details */}
              <div>
                <p className="font-bold  text-purple">Project Details</p>
                <p className="font-bold  text-darkgrey">Title</p>
                <p className=" max-w-[300px]">{selectedProject.title}</p>
              </div>
              <div>
                <p className="font-bold  text-darkgrey">Description</p>
                <p className=" max-w-[300px]">{selectedProject.description}</p>
              </div>
              <div>
                <p className="font-bold  text-darkgrey">City</p>
                <p className=" max-w-[300px]">{selectedProject.city}</p>
              </div>
              <div>
                <p className="font-bold  text-darkgrey">State</p>
                <p className=" max-w-[300px]">{selectedProject.state}</p>
              </div>
              <div>
                <p className="font-bold  text-darkgrey">Spaces</p>
                <p className="">
                  {formatCategory(selectedProject.sub_category_2)
                    .split(",")
                    .map((item: any, ind: number) => (
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
                <p className="font-bold  text-darkgrey">Theme</p>
                <p className="">
                  {formatCategory(selectedProject.sub_category_1)
                    .split(",")
                    .map((item: any, ind: number) => (
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

              <div className="flex flex-row md:flex-col w-full">
                <div className="mt-[1em] w-1/2 md:w-fit">
                  <p className="font-bold  text-black">Typical Job Cost</p>
                  <p className="">
                    {vendorData?.average_project_value ?? "N/A"}
                  </p>
                </div>
                <div className="mt-[1em] w-1/2 md:w-fit">
                  <p className="font-bold  text-black">Number of Employees</p>
                  <p className="">{vendorData?.number_of_employees ?? "N/A"}</p>
                </div>
              </div>
              <div className="flex  w-full flex-row md:flex-col mt-[1em]">
                <div className="w-1/2 md:w-fit">
                  <p className="font-bold  text-black">Projects Completed</p>
                  <p className="">{vendorData?.projects_completed ?? "N/A"}</p>
                </div>
                <div className=" w-1/2 md:w-fit">
                  <p className="font-bold  text-black">Location</p>
                  <p className="">{vendorData?.city ?? "N/A"}</p>
                </div>
              </div>

              {/* Social Links */}
              <div className="flex  w-full mt-[1em]">
                {(vendorData?.social?.facebook ||
                  vendorData?.social?.instagram ||
                  vendorData?.social?.website) && (
                  <div className="w-1/2">
                    <p className="font-bold  text-black">Socials</p>
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
                <div className="w-1/2 md:w-fit">
                  <p className="font-bold text-black">Contact Number</p>
                  <p className="">{vendorData?.mobile ?? "N/A"}</p>
                </div>
              </div>
              <div className="w-full mt-[1em]">
                <p className="font-bold  text-black">Email</p>
                <p className="">{vendorData?.email ?? "N/A"}</p>
              </div>
            </>
          )}

          {/* Collapse Button */}
        </>
      </>
    </div>
  );

  return isMobile ? (
    // <Card sx={{ maxWidth: "90vw", mt: 2, mx: "auto", background: "#8080800a" }}>
    //   <CardContent>{content}</CardContent>
    // </Card>
    <div className="border border-1 m-3 rounded-md border-[#d3d8e0] w-[90vw]">
      {content}
    </div>
  ) : (
    // <Test />
    <div>{content}</div>
  );
};

export default Section;
