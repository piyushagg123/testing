import ImageList from "@mui/material/ImageList";
import ImageListItem from "@mui/material/ImageListItem";

interface ItemProps {
  items: string[];
}
const WovenImageList: React.FC<ItemProps> = ({ items }) => {
  let numberOfImages: number = 0;
  if (items.length === 1 || items.length === 2) {
    numberOfImages = 1;
  } else {
    numberOfImages = 2;
  }

  return (
    <>
      {items.length > 0 ? (
        <>
          <ImageList
            sx={{
              width: "100%",
              height: 250,
              scrollbarWidth: "none",
              scrollbarColor: "black",
            }}
            variant="standard"
            cols={numberOfImages}
            gap={1}
          >
            {items?.map((item, ind: number) => (
              <ImageListItem key={ind}>
                <img
                  src={`https://designmatch-s3-bucket.s3.ap-south-1.amazonaws.com/${item}`}
                  loading="lazy"
                />
              </ImageListItem>
            ))}
          </ImageList>
        </>
      ) : (
        <></>
      )}
    </>
  );
};

export default WovenImageList;
