import React, { FormEvent, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ResponseInterface,
  CommentInterface,
} from "../../components/Interfaces";
import {
  onChange,
  sendRequest,
  stripHtmlEntities,
} from "../../components/Functions";
import {
  Button,
  Card,
  CardContent,
  Menu,
  MenuItem,
  IconButton,
  Typography,
  Box,
  TextField,
} from "@mui/material";
import MoreVertSharpIcon from "@mui/icons-material/MoreVertSharp";
import CommentItem from "../../components/CommentItem";
import { backendLinks } from "../../utils/BackendConfig";
import RatingItem from "../../components/ThreadRating";

// Interface for Post/Thread properties
interface PostProps {
  searchValue: string;
  sortOption: string;
  sortOptions: Array<string>;
}

// Post/Thread component, to create a single post/thread with comments
const Post: React.FC<PostProps> = ({
  searchValue,
  sortOption,
  sortOptions,
}) => {
  // Sets all the states required
  const params = useParams();
  const navigate = useNavigate();
  const [res, setRes] = useState<ResponseInterface>();
  const [editable, setEditable] = useState(false);
  const [editedTitle, setEditedTitle] = useState("");
  const [editedContent, setEditedContent] = useState("");
  const [editedCategory, setEditedCategory] = useState("");
  const [content, setContent] = useState("");
  const [comments, setComments] = useState<CommentInterface[]>();
  const [sortedComments, setSortedComments] = useState<CommentInterface[]>();
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  // Handle setting (the 3 dots on the right)
  const handleSettingClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleSettingClose = () => {
    setAnchorEl(null);
  };

  // Makes the thread editable
  const toggleEdit = () => {
    handleSettingClose();
    setEditable(!editable);
  };

  // Get the token from local storage (for authentication)
  const body = {
    token: localStorage.getItem("token"),
  };

  // Get Response function that sends POST request to obtain comments and post/thread
  const getRes = () => {
    const url = backendLinks.show_post + params.id;
    sendRequest(url, "POST", body)
      .then((res) => {
        res.post.created_at = new Date(res.post.created_at);
        res.comments.map((postInfo: CommentInterface) => {
          postInfo.created_at = new Date(postInfo.created_at);
        });
        setRes(res);
      })
      .catch(() => navigate("/threads"));
  };

  //Get the thread and comments when the parameter id changes
  useEffect(() => {
    getRes();
  }, [params.id]);

  // Sets the comment and thread data when there are changes
  useEffect(() => {
    if (res && res.post) {
      sortComments(res.comments);
      setEditedTitle(res.post.title);
      setEditedContent(res.post.content);
      setEditedCategory(res.post.category);
      setComments(res.comments);
      sortComments(res.comments);
    }
  }, [res]);

  // Sorts the comments based on date or rating
  const sortComments = (comments: Array<CommentInterface>) => {
    const sortedPosts = comments
      ?.slice()
      .sort(
        (commentInfoA: CommentInterface, commentInfoB: CommentInterface) => {
          const dateA = new Date(commentInfoA.created_at);
          const dateB = new Date(commentInfoB.created_at);

          // Compare the dates
          if (sortOption == sortOptions[0]) {
            return dateB.getTime() - dateA.getTime();
          } else if (sortOption == sortOptions[1]) {
            return dateA.getTime() - dateB.getTime();
          } else if (sortOption == sortOptions[2]) {
            return (
              commentInfoB.comment_ratings.reduce(
                (accumulator, currVal) => accumulator + currVal.rating,
                0
              ) -
              commentInfoA.comment_ratings.reduce(
                (accumulator, currVal) => accumulator + currVal.rating,
                0
              )
            );
          } else if (sortOption == sortOptions[3]) {
            return (
              commentInfoA.comment_ratings.reduce(
                (accumulator, currVal) => accumulator + currVal.rating,
                0
              ) -
              commentInfoB.comment_ratings.reduce(
                (accumulator, currVal) => accumulator + currVal.rating,
                0
              )
            );
          }
          return 0;
        }
      );
    setSortedComments(sortedPosts);
  };

  // sort the comments whenever the sort option is changed
  useEffect(() => {
    const url = backendLinks.show_post + params.id;
    sendRequest(url, "POST", body).then((res) => {
      res.post.created_at = new Date(res.post.created_at);
      res.comments.map((postInfo: CommentInterface) => {
        postInfo.created_at = new Date(postInfo.created_at);
      });
      sortComments(res.comments);
    });
  }, [sortOption]);

  // Search for relevant words whenever anything is typed in search bar
  useEffect(() => {
    if (!searchValue) {
      setComments(comments);
      return;
    }
    if (comments == undefined) {
      return;
    }
    const lowercaseSearch = searchValue.toLowerCase();
    const matchingComments = comments.filter((comment) =>
      comment.content.toLowerCase().includes(lowercaseSearch)
    );
    const nonMatchingComments = comments.filter(
      (comment) => !comment.content.toLowerCase().includes(lowercaseSearch)
    );
    const updatedComments = [...matchingComments, ...nonMatchingComments];
    setComments(updatedComments);
  }, [searchValue]);

  // Add back HTML entities that were removed
  const addHtmlEntities = (str: string) => {
    return String(str).replace(/&lt;/g, "<").replace(/&gt;/g, ">");
  };

  // Handles deletion of post/thread
  const deletePost = () => {
    const url = backendLinks.destroy_post + params.id;
    sendRequest(url, "DELETE", body)
      .then(() => navigate("/threads"))
      .catch((error) => console.log(error.message));
  };

  // Handles Updating of post/thread
  const saveChanges = () => {
    const url = backendLinks.update_post + params.id;
    const updatedBody = {
      token: localStorage.getItem("token"),
      post: {
        title: editedTitle,
        category: editedCategory,
        content: stripHtmlEntities(editedContent),
      },
    };
    sendRequest(url, "PATCH", updatedBody)
      .then((response) => {
        setEditable(false);
        getRes();
        navigate(`/thread/${response.id}`);
      })
      .catch((error) => console.log(error.message));
  };

  const postContent = res && addHtmlEntities(res.post.content);

  // Creation of comments
  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (content.length == 0) return;

    const commentBody = {
      token: localStorage.getItem("token"),
      comment: {
        content: stripHtmlEntities(content),
        post_id: params.id,
      },
    };

    sendRequest(backendLinks.create_comment, "POST", commentBody)
      .then(() => {
        setContent("");
        getRes();
      })
      .catch((error) => console.log(error));
  };

  // Thread/Post page
  return (
    <Box sx={{ px: 5 }}>
      <Card
        style={{
          margin: "auto",
          display: "flex",
          flexDirection: "column",
          marginBottom: "20px",
        }}
      >
        {res?.is_owner && (
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
              <MenuItem onClick={deletePost}>Delete</MenuItem>
              <MenuItem onClick={toggleEdit}>Edit</MenuItem>
            </Menu>
          </>
        )}
        <CardContent>
          <Typography component="p">{"Viewing thread:"}</Typography>
          <Typography variant="h4" component="h4">
            {editable ? (
              <>
                {"Title:"}
                <br />
                <TextField
                  id="postTitle"
                  name="title"
                  minRows={3}
                  required
                  value={editedTitle}
                  onChange={(event) => onChange(event, setEditedTitle)}
                  style={{ width: "100%", resize: "vertical" }}
                  sx={{ pb: 2 }}
                />
              </>
            ) : (
              <span>Title: {res && res.post.title}</span>
            )}
          </Typography>

          {editable ? (
            <>
              {"Category:"}
              <br />
              <TextField
                id="postCategory"
                name="category"
                minRows={3}
                required
                value={editedCategory}
                onChange={(event) => onChange(event, setEditedCategory)}
                style={{ width: "100%", resize: "vertical" }}
                sx={{ pb: 2 }}
              />
            </>
          ) : (
            <Typography variant="body1" component="p">
              category: {res && res.post.category}
            </Typography>
          )}

          {editable ? (
            <>
              {"Content:"}
              <br />
              <TextField
                id="postContent"
                name="content"
                minRows={3}
                required
                value={editedContent}
                onChange={(event) => onChange(event, setEditedContent)}
                style={{ width: "100%", resize: "vertical" }}
                sx={{ pb: 2 }}
              />
            </>
          ) : (
            <span
              dangerouslySetInnerHTML={{
                __html: `${postContent}`,
              }}
            />
          )}
          <Typography color="textSecondary" gutterBottom>
            {"Posted by " +
              res?.post.username +
              " on " +
              res?.post.created_at.toLocaleString()}
          </Typography>
        </CardContent>
        {editable && (
          <Button onClick={saveChanges} variant="contained" color="success">
            Save Changes
          </Button>
        )}
        <RatingItem post_id={res?.post.id} posts={null} />
      </Card>
      <div>
        {sortedComments?.map((comment, index) => (
          <CommentItem
            comment={comment}
            getRes={getRes}
            key={index}
            searchValue={searchValue}
          ></CommentItem>
        ))}
      </div>
      {localStorage.hasOwnProperty("token") && (
        <Box component="div">
          <form onSubmit={onSubmit}>
            <TextField
              id="postcontent"
              name="content"
              minRows={3}
              required
              value={content}
              onChange={(event) => onChange(event, setContent)}
              style={{ width: "100%", resize: "vertical" }}
              sx={{ pb: 2 }}
            />
            <Button type="submit" variant="contained" color="primary">
              Reply
            </Button>
          </form>
        </Box>
      )}
    </Box>
  );
};

export default Post;
