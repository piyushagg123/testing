import { useState, useCallback, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/Login";

const ProjectImages = ({ subCategories, handleClose }) => {
  const { projectId, accessToken } = useContext(AuthContext);
  const [spaceTypes, setSpaceTypes] = useState(
    subCategories.map((subCategory) => ({
      subCategory,
      images: [null, null, null],
      previews: [null, null, null],
      imageNames: [null, null, null],
    }))
  );

  const handleImageChange = useCallback(
    async (spaceIndex, imageIndex, e) => {
      const file = e.target.files[0];
      if (!file) {
        console.error("No file selected");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setSpaceTypes((prevSpaceTypes) => {
          const updatedSpaces = [...prevSpaceTypes];
          updatedSpaces[spaceIndex].images[imageIndex] = file;
          updatedSpaces[spaceIndex].previews[imageIndex] = reader.result;
          return updatedSpaces;
        });
      };
      reader.readAsDataURL(file);

      const formData = new FormData();
      formData.append("image", file);

      try {
        const response = await axios.post(
          `https://designmatch.ddns.net/image-upload/project?project_id=${projectId}&category=INTERIOR_DESIGNER&sub_category_2=${subCategories[spaceIndex]}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${sessionStorage.getItem("token")}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );
        const imageName = response.data.data;

        setSpaceTypes((prevSpaceTypes) => {
          const updatedSpaces = [...prevSpaceTypes];
          updatedSpaces[spaceIndex].imageNames[imageIndex] = imageName;
          return updatedSpaces;
        });
      } catch (error) {
        console.error(
          `Error uploading image for ${subCategories[spaceIndex]}:`,
          error
        );
      }
    },
    [subCategories, projectId, accessToken]
  );

  const handleDeleteImage = useCallback(
    async (spaceIndex, imageIndex) => {
      const imageName = spaceTypes[spaceIndex].imageNames[imageIndex];
      if (!imageName) {
        console.error("No image to delete");
        return;
      }

      try {
        await axios.delete(
          `https://designmatch.ddns.net/image-upload/project?project_id=${projectId}&key=${imageName}&category=INTERIOR_DESIGNER&sub_category_2=${subCategories[spaceIndex]}`,
          {
            headers: {
              Authorization: `Bearer ${sessionStorage.getItem("token")}`,
            },
          }
        );

        setSpaceTypes((prevSpaceTypes) => {
          const updatedSpaces = [...prevSpaceTypes];
          updatedSpaces[spaceIndex].images[imageIndex] = null;
          updatedSpaces[spaceIndex].previews[imageIndex] = null;
          updatedSpaces[spaceIndex].imageNames[imageIndex] = null;
          return updatedSpaces;
        });
      } catch (error) {
        console.error(
          `Error deleting image for ${subCategories[spaceIndex]}:`,
          error
        );
      }
    },
    [spaceTypes, subCategories, projectId, accessToken]
  );

  return (
    <div className="pl-3 h-full pb-6 flex flex-col items-center justify-center">
      <h1 className="text-3xl font-bold text-text">Upload Project Images</h1>
      <div>
        {spaceTypes.map((spaceType, spaceIndex) => (
          <div
            key={spaceIndex}
            className="mt-4 flex flex-col md:flex-row justify-between items-center gap-3"
          >
            <div className="w-full md:w-auto">
              <label className="text-sm w-full md:w-auto">
                {spaceType.subCategory}
              </label>
            </div>
            <div className="flex flex-col md:flex-row items-center w-full md:w-auto">
              {spaceType.previews.map((preview, imageIndex) => (
                <div
                  key={imageIndex}
                  className="relative flex flex-col items-center mx-1"
                >
                  {preview ? (
                    <>
                      <img
                        src={preview}
                        alt={`preview ${imageIndex}`}
                        style={{
                          width: "40px",
                          height: "40px",
                          objectFit: "cover",
                          margin: "10px",
                          borderRadius: "5px",
                          border: "solid 0.3px",
                        }}
                      />
                      <button
                        type="button"
                        onClick={() =>
                          handleDeleteImage(spaceIndex, imageIndex)
                        }
                        style={{
                          position: "absolute",
                          top: 0,
                          right: 0,
                          background: "red",
                          color: "white",
                          borderRadius: "50%",
                          width: "20px",
                          height: "20px",
                          border: "none",
                          cursor: "pointer",
                        }}
                        className="flex justify-center items-end"
                      >
                        &times;
                      </button>
                    </>
                  ) : (
                    <div
                      style={{
                        width: "40px",
                        height: "40px",
                        backgroundColor: "#e0e0e0",
                        display: "flex",
                        alignItems: "flex-start",
                        justifyContent: "center",
                        margin: "10px ",
                        borderRadius: "5px",
                        border: "solid 0.3px",
                      }}
                    >
                      <button
                        type="button"
                        onClick={() =>
                          document
                            .getElementById(
                              `file-input-${spaceIndex}-${imageIndex}`
                            )
                            .click()
                        }
                        style={{ fontSize: "24px", cursor: "pointer" }}
                      >
                        +
                      </button>
                      <input
                        id={`file-input-${spaceIndex}-${imageIndex}`}
                        style={{ display: "none" }}
                        type="file"
                        accept="image/*"
                        onChange={(e) =>
                          handleImageChange(spaceIndex, imageIndex, e)
                        }
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProjectImages;
