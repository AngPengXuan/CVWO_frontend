import React, { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ResponseInterface,
  CommentInterface,
} from "../../components/interfaces";
import { sendRequest, stripHtmlEntities } from "../../components/functions";
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

const Post = () => {
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
    const url = backendLinks.show_thread + params.id;
    sendRequest(url, "POST", body)
      .then((res) => {
        console.log("hi");
        setRes(res);
        console.log(res);
      })
      .catch(() => navigate("/posts"));
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
      console.dir(comments);
    }
  }, [res]);

  const addHtmlEntities = (str: string) => {
    return String(str).replace(/&lt;/g, "<").replace(/&gt;/g, ">");
  };

  const deletePost = () => {
    const url = backendLinks.destroy_thread + params.id;
    sendRequest(url, "DELETE", body)
      .then(() => navigate("/posts"))
      .catch((error) => console.log(error.message));
  };

  const saveChanges = () => {
    const url = backendLinks.update_thread + params.id;
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
        navigate(`/post/${response.id}`);
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
                <textarea
                  name="title"
                  value={editedTitle}
                  onChange={(e) => {
                    onChange(e, setEditedTitle);
                  }}
                />{" "}
              </>
            ) : (
              <span>{res && res.post.title}</span>
            )}
          </Typography>
          <Typography variant="body1" component="p">
            {editable ? (
              <>
                {"Category:"}
                <br />
                <textarea
                  name="category"
                  value={editedCategory}
                  onChange={(e) => {
                    onChange(e, setEditedCategory);
                  }}
                />
              </>
            ) : (
              <span>{res && res.post.category}</span>
            )}
          </Typography>
          <Typography variant="body2" component="p">
            {editable ? (
              <>
                {"Content:"}
                <br />
                <textarea
                  name="content"
                  value={editedContent}
                  onChange={(e) => {
                    onChange(e, setEditedContent);
                  }}
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
            {res && res.post.username}
          </Typography>
        </CardContent>
        {editable && (
          <Button onClick={saveChanges} variant="contained" color="success">
            Save Changes
          </Button>
        )}
      </Card>
      <div>
        {comments?.map((comment, index) => (
          <CommentItem
            comment={comment}
            getRes={getRes}
            key={index}
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
