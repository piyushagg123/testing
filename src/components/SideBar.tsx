import { Chip } from "@mui/material";
import { formatCategory } from "../utils";
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";

const SideBar = ({ vendorData, selectedProject }) => {
  return (
    <div className="w-[250px] text-lg ml-10">
      <br />
      <br />
      <div className=" ">
        <p className="font-bold text-base text-darkgrey">Contact Number</p>
        <p className="text-[16px]">{vendorData?.mobile ?? "N/A"}</p>
      </div>
      <br />
      <div className=" ">
        <p className="font-bold text-base text-darkgrey">Email</p>
        <p className="text-[16px]">{vendorData?.email ?? "N/A"}</p>
      </div>
      <br />
      <div className="flex flex-col justify-evenly gap-6">
        {selectedProject ? (
          <>
            <div>
              <p className="font-bold text-base text-purple">Project details</p>
              <p className="font-bold text-base text-darkgrey">Title</p>
              <p className="text-[16px] max-w-[300px]">
                {selectedProject.title}
              </p>
            </div>
            <div>
              <p className="font-bold text-base text-darkgrey">Description</p>
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
                    <>
                      <Chip
                        label={item}
                        variant="outlined"
                        key={ind}
                        sx={{ height: "25px" }}
                        style={{
                          color: "linear-gradient(#ff5757,#8c52ff)",
                        }}
                      />
                    </>
                  ))}
              </p>
            </div>
            <div>
              <p className="font-bold text-base text-darkgrey">Theme</p>
              <p className="text-[16px]">
                {formatCategory(selectedProject.sub_category_1)
                  .split(",")
                  .map((item, ind) => (
                    <>
                      <Chip
                        label={item}
                        variant="outlined"
                        key={ind}
                        sx={{ height: "25px" }}
                        style={{
                          color: "linear-gradient(#ff5757,#8c52ff)",
                        }}
                      />
                    </>
                  ))}
              </p>
            </div>
            <div>
              <p className="font-bold text-base text-darkgrey">Start Date</p>
              <p className="text-[16px] max-w-[300px]">
                {selectedProject.start_date}
              </p>
            </div>
            <div>
              <p className="font-bold text-base text-darkgrey">End date</p>
              <p className="text-[16px] max-w-[300px]">
                {selectedProject.end_date}
              </p>
            </div>
          </>
        ) : (
          <>
            <div>
              <p className="font-bold text-base text-darkgrey">
                Typical Job Cost
              </p>
              <p className="text-[16px]">
                {vendorData?.average_project_value ?? "N/A"}
              </p>
            </div>
            <div className=" ">
              <p className="font-bold text-base text-darkgrey">
                Number of employees
              </p>
              <p className="text-[16px]">
                {vendorData?.number_of_employees ?? "N/A"}
              </p>
            </div>
            <div className=" ">
              <p className="font-bold text-base text-darkgrey">
                Projects Completed
              </p>
              <p className="text-[16px]">
                {vendorData?.projects_completed ?? "N/A"}
              </p>
            </div>

            <div className=" ">
              <p className="font-bold text-base text-darkgrey">Location</p>
              <p className="text-[16px]">{vendorData?.city ?? "N/A"}</p>
            </div>
            {vendorData?.social ? (
              <>
                <div>
                  <p className="font-bold text-base text-darkgrey">Socials</p>
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
              </>
            ) : null}
          </>
        )}
      </div>
    </div>
  );
};

export default SideBar;
