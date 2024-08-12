import StarIcon from "@mui/icons-material/Star";
import { styled } from "@mui/material/styles";
import LinearProgress, {
  linearProgressClasses,
} from "@mui/material/LinearProgress";

const Reviews = () => {
  const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
    height: 5,
    borderRadius: 5,
    [`&.${linearProgressClasses.colorPrimary}`]: {
      backgroundColor:
        theme.palette.grey[theme.palette.mode === "light" ? 200 : 800],
    },
    [`& .${linearProgressClasses.bar}`]: {
      borderRadius: 5,
      backgroundColor: theme.palette.mode === "light" ? "#8c52ff" : "#8c52ff",
    },
  }));
  return (
    <>
      <p className="mt-5"></p>
      <div className="flex  justify-around">
        <div>
          <div className="flex flex-col gap-3">
            <div>
              <p className="flex items-center gap-2">
                <span className="text-[25px]">4 </span>
                <StarIcon />
              </p>
            </div>

            <div>
              <p className="flex items-center gap-3">
                <p className="flex items-center">
                  {" "}
                  5 <StarIcon sx={{ fontSize: "15px" }} />
                </p>
                <BorderLinearProgress
                  variant="determinate"
                  value={90}
                  sx={{ width: "200px" }}
                />
                <p className="text-[10px]">100</p>
              </p>
              <p className="flex items-center gap-3">
                <p className="flex items-center">
                  {" "}
                  4 <StarIcon sx={{ fontSize: "15px" }} />
                </p>
                <BorderLinearProgress
                  variant="determinate"
                  value={90}
                  sx={{ width: "200px" }}
                />
                <p className="text-[10px]">100</p>
              </p>
              <p className="flex items-center gap-3">
                <p className="flex items-center">
                  {" "}
                  3 <StarIcon sx={{ fontSize: "15px" }} />
                </p>
                <BorderLinearProgress
                  variant="determinate"
                  value={90}
                  sx={{ width: "200px" }}
                />
                <p className="text-[10px]">100</p>
              </p>
              <p className="flex items-center gap-3">
                <p className="flex items-center">
                  {" "}
                  2 <StarIcon sx={{ fontSize: "15px" }} />
                </p>
                <BorderLinearProgress
                  variant="determinate"
                  value={90}
                  sx={{ width: "200px" }}
                />
                <p className="text-[10px]">100</p>
              </p>
              <p className="flex items-center gap-3">
                <p className="flex items-center">
                  {" "}
                  1 <StarIcon sx={{ fontSize: "15px" }} />
                </p>
                <BorderLinearProgress
                  variant="determinate"
                  value={90}
                  sx={{ width: "200px" }}
                />
                <p className="text-[10px]">100</p>
              </p>
            </div>
          </div>
        </div>
        <div className="flex flex-col w-max">
          <br />
          <p>What our customers said</p>
          <br />
          <p className="flex items-center gap-3 justify-between">
            <p className="flex items-center text-sm"> Work Quality</p>
            <BorderLinearProgress
              variant="determinate"
              value={90}
              sx={{ width: "200px" }}
            />
          </p>
          <p className="flex items-center gap-3 justify-between">
            <p className="flex items-center text-sm"> Communication</p>
            <BorderLinearProgress
              variant="determinate"
              value={90}
              sx={{ width: "200px" }}
            />
          </p>
          <p className="flex items-center gap-3 justify-between">
            <p className="flex items-center text-sm">Value</p>
            <BorderLinearProgress
              variant="determinate"
              value={90}
              sx={{ width: "200px" }}
            />
          </p>
        </div>

        <br />
      </div>
      <br />
      <br />
      <div className="flex flex-col gap-9">
        <div className="flex items-start gap-2">
          <p className="flex items-center gap-1 bg-purple p-[2px] text-white">
            4<StarIcon sx={{ fontSize: "13px" }} />
          </p>
          <div>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipisicing elit.
              Voluptatibus nesciunt eligendi, velit est distinctio animi
              corporis laudantium iure autem accusantium libero mollitia, hic
              fuga vel. Molestiae iure natus excepturi praesentium?
            </p>
            <p className="text-sm text-darkgrey">Piyush | 20/6/2024</p>
          </div>
        </div>
        <div className="flex items-start gap-2">
          <p className="flex items-center gap-1 bg-purple p-[2px] text-white">
            4<StarIcon sx={{ fontSize: "13px" }} />
          </p>
          <div>
            <p>
              Lorem ipsum dolor, sit amet consectetur adipisicing elit. Sunt
              autem, sapiente quaerat officia labore itaque hic explicabo
              blanditiis expedita nam aliquid, nostrum iste? Nihil
              necessitatibus consectetur amet earum ea iusto.
            </p>
            <p className="text-sm text-darkgrey">Piyush | 20/6/2024</p>
          </div>
        </div>
        <div className="flex items-start gap-2">
          <p className="flex items-center gap-1 bg-purple p-[2px] text-white">
            4<StarIcon sx={{ fontSize: "13px" }} />
          </p>
          <div>
            <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Placeat,
              consequatur perferendis! Sint sit rerum voluptatum nihil!
              Voluptate reprehenderit ratione, necessitatibus, mollitia aliquam
              pariatur culpa soluta iste explicabo debitis aspernatur officia!
            </p>
            <p className="text-sm text-darkgrey">Piyush | 20/6/2024</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Reviews;
