import ThumbUpAltIcon from "@mui/icons-material/ThumbUp";
import ThumbDownIcon from "@mui/icons-material/ThumbDown";

const RatingItem = () => {
  const onThumbUpClick = () => {};

  const onThumbDownClick = () => {};

  return (
    <div>
      <button onClick={onThumbUpClick}>
        <ThumbUpAltIcon />
      </button>
      <button onClick={onThumbDownClick}>
        <ThumbDownIcon />
      </button>
    </div>
  );
};

export default RatingItem;
