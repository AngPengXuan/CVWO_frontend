import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ThumbDownIcon from "@mui/icons-material/ThumbDown";
import React, { useEffect, useState } from "react";
import { sendRequest } from "./Functions";
import { backendLinks } from "../utils/BackendConfig";
import { Button } from "@mui/material";
import ThumbUpOutlinedIcon from "@mui/icons-material/ThumbUpOutlined";
import ThumbDownOutlinedIcon from "@mui/icons-material/ThumbDownOutlined";
import { CommentInterface } from "./Interfaces";

type Props = {
  comment: CommentInterface;
  getRes: () => void;
};

type Ratings = {
  rating: number;
};

const RatingItem: React.FC<Props> = ({ comment, getRes }) => {
  const [resp, setResp] = useState();
  const [rating, setRating] = useState(0);
  const [userRating, setUserRating] = useState(0);
  const token = localStorage.getItem("token");
  const commentId = comment.id;
  const onThumbUpClick = (rating: number) => {
    return () => {
      if (token == null) {
        alert("You must be logged in to vote!");
        return;
      }
      const updatedBody = {
        comment_rating: {
          user_token: token,
          comment_id: commentId,
          rating: rating,
        },
      };
      sendRequest(backendLinks.update_comment_rating, "PATCH", updatedBody)
        .then((response) => {
          console.log(response);
          setResp(response);
          setUserRating(response.rating);
          getRes();
        })
        .catch((error) => console.log(error.message));
    };
  };

  const onThumbDownClick = (rating: number) => {
    return () => {
      if (token == null) {
        alert("You must be logged in to vote!");
        return;
      }
      const updatedBody = {
        comment_rating: {
          user_token: token,
          comment_id: commentId,
          rating: rating,
        },
      };
      sendRequest(backendLinks.update_comment_rating, "PATCH", updatedBody)
        .then((response) => {
          console.log(response);
          setResp(response);
          setUserRating(response.rating);
          getRes();
        })
        .catch((error) => console.log(error.message));
    };
  };

  useEffect(() => {
    //possibility of null token
    const updatedBody = {
      comment_rating: {
        user_token: token,
        comment_id: commentId,
      },
    };
    sendRequest(backendLinks.show_comment_rating, "POST", updatedBody)
      .then((response) => {
        console.log(response);
        const sumOfRatings: number = response.comment_ratings.reduce(
          (accumulator: number, currentValue: Ratings) =>
            accumulator + currentValue.rating,
          0
        );
        setRating(sumOfRatings);
        if (response.user_rating != null) {
          setUserRating(response.user_rating.rating);
        } else {
          setUserRating(0);
        }
      })
      .catch((error) => console.log(error.message));
  }, [resp, comment]);

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
