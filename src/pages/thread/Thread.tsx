import React, { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ResponseInterface,
  CommentInterface,
} from "../../components/Interfaces";
import { sendRequest, stripHtmlEntities } from "../../components/Functions";
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
import RatingItem from "../../components/Rating";

interface PostProps {
  searchValue: string;
  sortOption: string;
  sortOptions: Array<string>;
}

const Post: React.FC<PostProps> = ({
  searchValue,
  sortOption,
  sortOptions,
}) => {
  const params = useParams();
  const navigate = useNavigate();
  const [res, setRes] = useState<ResponseInterface>();
  const [editable, setEditable] = useState(false);
  const [editedTitle, setEditedTitle] = useState("");
  const [editedContent, setEditedContent] = useState("");
  const [editedCategory, setEditedCategory] = useState("");
  const [content, setContent] = useState("");
  const [comments, setComments] = useState<CommentInterface[]>();
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  const handleSettingClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleSettingClose = () => {
    setAnchorEl(null);
  };

  const toggleEdit = () => {
    handleSettingClose();
    setEditable(!editable);
  };

  const onChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    setFunction: React.Dispatch<React.SetStateAction<string>>
  ) => {
    setFunction(event.target.value);
  };

  const body = {
    token: localStorage.getItem("token"),
  };

  const getRes = () => {
    const url = backendLinks.show_post + params.id;
    sendRequest(url, "POST", body)
      .then((res) => {
        res.post.created_at = new Date(res.post.created_at);
        res.comments.map((postInfo: CommentInterface) => {
          postInfo.created_at = new Date(postInfo.created_at);
        });
        setRes(res);
        console.log(res);
      })
      .catch(() => navigate("/threads"));
  };

  useEffect(() => {
    getRes();
  }, [params.id]);

  useEffect(() => {
    if (res && res.post) {
      setEditedTitle(res.post.title);
      setEditedContent(res.post.content);
      setEditedCategory(res.post.category);
      setComments(res.comments);
    }
  }, [res]);

  useEffect(() => {
    const sortedPosts = comments?.slice().sort((commentInfoA, commentInfoB) => {
      const dateA = new Date(commentInfoA.created_at);
      const dateB = new Date(commentInfoB.created_at);

      // Compare the dates
      if (sortOption == sortOptions[0]) {
        return dateB.getTime() - dateA.getTime();
      } else if (sortOption == sortOptions[1]) {
        return dateA.getTime() - dateB.getTime();
      }
      return 0;
    });
    setComments(sortedPosts);
  }, [sortOption]);

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

  const addHtmlEntities = (str: string) => {
    return String(str).replace(/&lt;/g, "<").replace(/&gt;/g, ">");
  };

  const deletePost = () => {
    const url = backendLinks.destroy_post + params.id;
    sendRequest(url, "DELETE", body)
      .then(() => navigate("/threads"))
      .catch((error) => console.log(error.message));
  };

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
        console.log("navigating");
        // navigate(`/post/${response.id}`);
      })
      .catch((error) => console.log(error));
  };

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
          <Typography variant="body1" component="p">
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
              <span>category: {res && res.post.category}</span>
            )}
          </Typography>
          <Typography variant="body2" component="p">
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
          </Typography>
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
        {comments?.map((comment, index) => (
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
