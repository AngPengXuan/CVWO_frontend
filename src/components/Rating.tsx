import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ThumbDownIcon from "@mui/icons-material/ThumbDown";
import React, { useEffect, useState } from "react";
import { sendRequest } from "./Functions";
import { backendLinks } from "../utils/BackendConfig";
import { useParams } from "react-router-dom";
import { Button } from "@mui/material";
import ThumbUpOutlinedIcon from "@mui/icons-material/ThumbUpOutlined";
import ThumbDownOutlinedIcon from "@mui/icons-material/ThumbDownOutlined";

type Props = {
  post_id: number | undefined;
};

type Ratings = {
  rating: number;
};

const RatingItem: React.FC<Props> = ({ post_id }) => {
  const [resp, setResp] = useState();
  const [rating, setRating] = useState(0);
  const [userRating, setUserRating] = useState(0);
  const params = useParams();
  const token = localStorage.getItem("token");
  const postId = post_id || Number(params.id);
  const onThumbUpClick = (rating: number) => {
    return () => {
      const updatedBody = {
        post_rating: {
          user_token: token,
          post_id: postId,
          rating: rating,
        },
      };
      sendRequest(backendLinks.update_post_rating, "PATCH", updatedBody)
        .then((response) => {
          console.log(response);
          setResp(response);
          setUserRating(response.rating);
        })
        .catch((error) => console.log(error.message));
    };
  };

  const onThumbDownClick = (rating: number) => {
    return () => {
      const updatedBody = {
        post_rating: {
          user_token: token,
          post_id: postId,
          rating: rating,
        },
      };
      sendRequest(backendLinks.update_post_rating, "PATCH", updatedBody)
        .then((response) => {
          console.log(response);
          setResp(response);
          setUserRating(response.rating);
        })
        .catch((error) => console.log(error.message));
    };
  };

  useEffect(() => {
    const updatedBody = {
      post_rating: {
        user_token: token,
        post_id: postId,
      },
    };
    sendRequest(backendLinks.show_post_rating, "POST", updatedBody)
      .then((response) => {
        console.log(response);
        const sumOfRatings: number = response.post_ratings.reduce(
          (accumulator: number, currentValue: Ratings) =>
            accumulator + currentValue.rating,
          0
        );
        setRating(sumOfRatings);
        setUserRating(response.user_rating.rating);
      })
      .catch((error) => console.log(error.message));
  }, [resp]);

  return (
    <div>
      {userRating == 1 ? (
        <Button onClick={onThumbUpClick(0)}>
          <ThumbUpIcon />
        </Button>
      ) : (
        <Button onClick={onThumbUpClick(1)}>
          <ThumbUpOutlinedIcon />
        </Button>
      )}

      {rating}
      {userRating == -1 ? (
        <Button onClick={onThumbDownClick(0)}>
          <ThumbDownIcon />
        </Button>
      ) : (
        <Button onClick={onThumbDownClick(-1)}>
          <ThumbDownOutlinedIcon />
        </Button>
      )}
    </div>
  );
};

export default RatingItem;
