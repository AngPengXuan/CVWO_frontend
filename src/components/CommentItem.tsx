import {
  Button,
  Card,
  CardContent,
  Grid,
  IconButton,
  Menu,
  MenuItem,
  Typography,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import React, { useState } from "react";
import { CommentInterface } from "./Interfaces";
import MoreVertSharpIcon from "@mui/icons-material/MoreVertSharp";
import { onChange, sendRequest, stripHtmlEntities } from "./Functions";
import { useNavigate } from "react-router-dom";
import { backendLinks } from "../utils/BackendConfig";
import RatingItem from "./Rating";

const useStyles = makeStyles(() => ({
  commentBody: {
    fontSize: 16,
    whiteSpace: "pre-wrap",
    paddingBottom: "1em",
  },
  commentCard: {
    // width: "40vw",
    // textAlign: "center",
    margin: "auto",
    display: "flex",
    flexDirection: "column",
  },
  metadata: {
    fontSize: 14,
  },
}));

type Props = {
  comment: CommentInterface;
  getRes: () => void;
};

const CommentItem: React.FC<Props> = ({ comment, getRes }) => {
  const [editableComment, setEditableComment] = useState(false);
  const [editedContentComment, setEditedContentComment] = useState("");
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const navigate = useNavigate();

  const handleSettingClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleSettingClose = () => {
    setAnchorEl(null);
  };

  const toggleEditComment = () => {
    handleSettingClose();
    setEditableComment(!editableComment);
    setEditedContentComment(comment.content);
  };

  const saveChangesComment = () => {
    const updatedBody = {
      token: localStorage.getItem("token"),
      comment: {
        content: stripHtmlEntities(editedContentComment),
        id: comment.id,
      },
    };
    sendRequest(backendLinks.update_comment, "PATCH", updatedBody)
      .then((response) => {
        setEditableComment(false);
        getRes();
        navigate(`/post/${response.id}`);
      })
      .catch((error) => console.log(error.message));
  };

  const deleteComment = (index: number) => {
    return () => {
      console.log("delete");
      handleSettingClose();
      const commentBody = {
        token: localStorage.getItem("token"),
        comment: {
          id: index,
        },
      };
      sendRequest(backendLinks.delete_comment, "DELETE", commentBody)
        .then(() => {
          getRes();
        })
        .catch((error) => console.log(error.message));
    };
  };

  return (
    <Grid item xs={6} sx={{ mb: 1 }}>
      <Card className={classes.commentCard}>
        {comment.is_owner && (
          <>
            <div
              style={{
                alignSelf: "flex-end",
              }}
            >
              <IconButton onClick={handleSettingClick}>
                <MoreVertSharpIcon />
              </IconButton>
            </div>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleSettingClose}
            >
              <MenuItem onClick={deleteComment(comment.id)}>Delete</MenuItem>
              <MenuItem onClick={toggleEditComment}>Edit</MenuItem>
            </Menu>{" "}
          </>
        )}
        <CardContent>
          <Typography variant="body2" component="p">
            {editableComment ? (
              <textarea
                name="content"
                value={editedContentComment}
                onChange={(e) => {
                  onChange(e, setEditedContentComment);
                }}
              />
            ) : (
              <span>{comment.content}</span>
            )}
          </Typography>
          <Typography
            color="textSecondary"
            className={classes.metadata}
            gutterBottom
          >
            {"posted by " +
              comment.username +
              " on " +
              comment.created_at.toLocaleString()}
          </Typography>
          {editableComment && (
            <Button onClick={saveChangesComment}>Save</Button>
          )}
          <RatingItem />
        </CardContent>
      </Card>
    </Grid>
  );
};

export default CommentItem;
