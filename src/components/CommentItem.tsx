import {
  Button,
  Card,
  CardContent,
  Grid,
  IconButton,
  Menu,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import React, { useEffect, useState } from "react";
import { CommentInterface } from "./Interfaces";
import MoreVertSharpIcon from "@mui/icons-material/MoreVertSharp";
import { onChange, sendRequest, stripHtmlEntities } from "./Functions";
import { useNavigate } from "react-router-dom";
import { backendLinks } from "../utils/BackendConfig";
import RatingItem from "./CommentRating";

// Sets the style for comment card
const useStyles = makeStyles(() => ({
  commentBody: {
    fontSize: 16,
    whiteSpace: "pre-wrap",
    paddingBottom: "1em",
  },
  commentCard: {
    margin: "auto",
    display: "flex",
    flexDirection: "column",
  },
  metadata: {
    fontSize: 14,
  },
}));

// Interface for Comment properties, takes in values and functions from Thread.tsx
type Props = {
  comment: CommentInterface;
  searchValue: string;
  getRes: () => void;
};

// CommentItem component
const CommentItem: React.FC<Props> = ({ comment, getRes, searchValue }) => {
  // Sets all the states required
  const [editableComment, setEditableComment] = useState(false);
  const [editedContentComment, setEditedContentComment] = useState("");
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const navigate = useNavigate();
  const [highlightedContent, setHighlightedContent] = useState<JSX.Element>();

  // Handle setting (the 3 dots on the right)
  const handleSettingClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleSettingClose = () => {
    setAnchorEl(null);
  };

  // Handles Editing and Saving of a comment
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

  // Handles deletion of comment
  const deleteComment = (index: number) => {
    return () => {
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

  // Highlights and sorts the searched content whenever anything is typed in search bar
  useEffect(() => {
    if (!searchValue) {
      setHighlightedContent(undefined);
      return;
    }
    const lowercaseSearch = searchValue.toLowerCase();
    const highlightedComments = comment.content.split(
      new RegExp(`(${lowercaseSearch})`, "i")
    );
    const highlightedContent = (
      <>
        {highlightedComments.map((part, index) =>
          part.toLowerCase() === lowercaseSearch ? (
            <span
              key={index}
              style={{ fontWeight: "bold", backgroundColor: "yellow" }}
            >
              {part}
            </span>
          ) : (
            part
          )
        )}
      </>
    );
    setHighlightedContent(highlightedContent);
  }, [searchValue]);

  // Comment component
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
          {editableComment ? (
            <TextField
              id="commentContent"
              name="content"
              minRows={3}
              required
              value={editedContentComment}
              onChange={(event) => onChange(event, setEditedContentComment)}
              style={{ width: "100%", resize: "vertical" }}
              sx={{ pb: 2 }}
            />
          ) : (
            <Typography variant="body2" component="p">
              {highlightedContent || comment.content}
            </Typography>
          )}

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
        </CardContent>
        <RatingItem comment={comment} getRes={getRes} />
      </Card>
    </Grid>
  );
};

export default CommentItem;
