import { useState, useCallback, ChangeEvent } from "react";
import axios from "axios";
import constants from "../constants";

interface ProjectImagesProps {
  subCategories: string[];
  projectId: number;
}

interface SpaceType {
  subCategory: string;
  images: (File | null)[];
  previews: (string | null)[];
  imageNames: (string | null)[];
}

const ProjectImages: React.FC<ProjectImagesProps> = ({
  subCategories,
  projectId,
}) => {
  const [spaceTypes, setSpaceTypes] = useState<SpaceType[]>(
    subCategories.map((subCategory) => ({
      subCategory,
      images: [null, null, null],
      previews: [null, null, null],
      imageNames: [null, null, null],
    }))
  );

  const handleImageChange = useCallback(
    async (
      spaceIndex: number,
      imageIndex: number,
      event: ChangeEvent<HTMLInputElement>
    ) => {
      const file = event.target.files?.[0];
      if (!file) {
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setSpaceTypes((prevSpaceTypes) => {
          const updatedSpaces = [...prevSpaceTypes];
          updatedSpaces[spaceIndex].images[imageIndex] = file;
          updatedSpaces[spaceIndex].previews[imageIndex] =
            reader.result as string;
          return updatedSpaces;
        });
      };
      reader.readAsDataURL(file);

      const formData = new FormData();
      formData.append("image", file);

      try {
        const response = await axios.post(
          `${constants.apiBaseUrl}/image-upload/project?project_id=${projectId}&category=INTERIOR_DESIGNER&sub_category_2=${subCategories[spaceIndex]}`,
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
      } catch (error) {}
    },
    [subCategories, projectId]
  );

  const handleDeleteImage = useCallback(
    async (spaceIndex: number, imageIndex: number) => {
      const imageName = spaceTypes[spaceIndex].imageNames[imageIndex];
      if (!imageName) {
        return;
      }

      try {
        await axios.delete(
          `${constants.apiBaseUrl}/image-upload/project?project_id=${projectId}&key=${imageName}&category=INTERIOR_DESIGNER&sub_category_2=${subCategories[spaceIndex]}`,
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
      } catch (error) {}
    },
    [spaceTypes, subCategories, projectId]
  );

  return (
    <div className="pl-3 h-full pb-6 flex flex-col items-center justify-center">
      <h1 className="text-xl md:text-3xl font-bold text-text">
        Upload Project Images
      </h1>
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
            <div className="flex md:flex-row items-center w-full md:w-auto">
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
                          borderRadius: "5px",
                          border: "solid 0.3px",
                          margin: 10,
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
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "flex-end",
                        }}
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
                        onClick={() => {
                          const inputElement = document.getElementById(
                            `file-input-${spaceIndex}-${imageIndex}`
                          ) as HTMLInputElement | null;
                          inputElement?.click();
                        }}
                        style={{ fontSize: "24px", cursor: "pointer" }}
                      >
                        +
                      </button>
                      <input
                        id={`file-input-${spaceIndex}-${imageIndex}`}
                        style={{ display: "none" }}
                        type="file"
                        accept="image/*"
                        onChange={(event) =>
                          handleImageChange(spaceIndex, imageIndex, event)
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
