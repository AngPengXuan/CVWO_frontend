import React, { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ResponseInterface, CommentInterface } from "../interfaces";
import { sendRequest } from "../functions";
import {
  Button,
  Card,
  CardContent,
  Menu,
  MenuItem,
  IconButton,
  Typography,
} from "@mui/material";
import MoreVertSharpIcon from "@mui/icons-material/MoreVertSharp";

const Post = () => {
  const params = useParams();
  const navigate = useNavigate();
  const [res, setRes] = useState<ResponseInterface>();
  const [editable, setEditable] = useState(false);
  const [editedTitle, setEditedTitle] = useState("");
  const [editedContent, setEditedContent] = useState("");
  const [editedCategory, setEditedCategory] = useState("");
  const [editableComment, setEditableComment] = useState(false);
  const [editableCommentIndex, setEditableCommentIndex] = useState(-1);
  const [editedContentComment, setEditedContentComment] = useState("");
  const [editedCommentId, setEditedCommentId] = useState(-1);
  const [content, setContent] = useState("");
  const [comments, setComments] = useState<CommentInterface[]>();
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [anchorElComments, setAnchorElComments] = useState(
    Array(comments?.length).fill(null)
  );

  const handleCommentsSettingClick =
    (index: number) => (event: React.MouseEvent<HTMLButtonElement>) => {
      const newAnchorEls = [...anchorElComments];
      newAnchorEls[index] = event.currentTarget;
      setAnchorElComments(newAnchorEls);
    };

  const handleCommentsSettingClose = (index: number) => () => {
    const newAnchorEls = [...anchorElComments];
    newAnchorEls[index] = null;
    setAnchorElComments(newAnchorEls);
  };

  const handleCloseAllCommentsSettings = () => {
    const newAnchorEls = anchorElComments.map(() => null);
    setAnchorElComments(newAnchorEls);
  };

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

  const stripHtmlEntities = (str: string) => {
    return String(str)
      .replace(/\n/g, "<br> <br>")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  };

  const getRes = () => {
    const url = `http://localhost:3000/api/v1/show/${params.id}`;
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
    const url = `http://localhost:3000/api/v1/destroy/${params.id}`;
    sendRequest(url, "DELETE", body)
      .then(() => navigate("/posts"))
      .catch((error) => console.log(error.message));
  };

  const saveChanges = () => {
    const url = `http://localhost:3000/api/v1/update/${params.id}`;
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
    const url = "http://localhost:3000/api/v1/comments/create";

    if (content.length == 0) return;

    const commentBody = {
      token: localStorage.getItem("token"),
      comment: {
        content: stripHtmlEntities(content),
        post_id: params.id,
      },
    };

    sendRequest(url, "POST", commentBody)
      .then(() => {
        setContent("");
        getRes();
        console.log("navigating");
        // navigate(`/post/${response.id}`);
      })
      .catch((error) => console.log(error));
  };

  const deleteComment = (index: number) => {
    return () => {
      console.log("delete");
      handleCloseAllCommentsSettings();
      const url = `http://localhost:3000/api/v1/comment/destroy/${params.id}`;
      const commentBody = {
        token: localStorage.getItem("token"),
        comment: {
          id: index,
        },
      };
      sendRequest(url, "DELETE", commentBody)
        .then(() => {
          getRes();
          navigate(`/post/${params.id}`);
        })
        .catch((error) => console.log(error.message));
    };
  };

  const saveChangesComment = () => {
    const url = `http://localhost:3000/api/v1/comment/update/${params.id}`;
    const updatedBody = {
      token: localStorage.getItem("token"),
      comment: {
        content: stripHtmlEntities(editedContentComment),
        id: editedCommentId,
      },
    };
    sendRequest(url, "PATCH", updatedBody)
      .then((response) => {
        setEditableComment(false);
        getRes();
        navigate(`/post/${response.id}`);
      })
      .catch((error) => console.log(error.message));
  };

  const toggleEditComment = (index: number) => {
    return () => {
      handleCommentsSettingClose(index)();
      if (comments && index >= 0) {
        setEditableComment(!editableComment);
        setEditableCommentIndex(index);
        setEditedContentComment(comments[index].content);
        setEditedCommentId(comments[index].id);
      }
    };
  };

  return (
    <>
      <Card
        style={{
          width: "40vw",
          margin: "auto",
          textAlign: "center",
          display: "flex",
          flexDirection: "column",
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
          <Typography color="textSecondary" gutterBottom>
            {res && res.post.username}
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
        </CardContent>
        {editable && (
          <Button onClick={saveChanges} variant="contained" color="success">
            Save Changes
          </Button>
        )}
      </Card>
      <div className="">
        <div className="container py-5">
          <div>
            {comments?.map((comment, index) => (
              <Card
                key={index}
                style={{
                  width: "40vw",
                  margin: "auto",
                  textAlign: "center",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                {comment.is_owner && (
                  <>
                    <div
                      style={{
                        alignSelf: "flex-end",
                      }}
                    >
                      <IconButton onClick={handleCommentsSettingClick(index)}>
                        <MoreVertSharpIcon />
                      </IconButton>
                    </div>
                    <Menu
                      anchorEl={anchorElComments[index]}
                      open={Boolean(anchorElComments[index])}
                      onClose={handleCommentsSettingClose(index)}
                    >
                      <MenuItem onClick={deleteComment(comment.id)}>
                        Delete
                      </MenuItem>
                      <MenuItem onClick={toggleEditComment(index)}>
                        Edit
                      </MenuItem>
                    </Menu>{" "}
                  </>
                )}
                <CardContent>
                  <Typography color="textSecondary" gutterBottom>
                    {comment.username}
                  </Typography>
                  <Typography variant="body2" component="p">
                    {editableCommentIndex == index && editableComment ? (
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
                  {editableCommentIndex == index && editableComment && (
                    <Button onClick={saveChangesComment}>Save</Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          {localStorage.hasOwnProperty("token") && (
            <div>
              <form onSubmit={onSubmit}>
                <label htmlFor="postcontent">Content</label>
                <textarea
                  className="form-control"
                  id="postcontent"
                  name="content"
                  rows={3}
                  required
                  value={content}
                  onChange={(event) => onChange(event, setContent)}
                />

                <Button type="submit">Create Comment</Button>
              </form>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Post;
