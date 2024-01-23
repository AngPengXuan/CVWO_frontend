import React, { ChangeEvent, FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { sendRequest } from "../../components/Functions";
import { backendLinks } from "../../utils/BackendConfig";
import { Box, Button, TextField, Typography, Link, Grid } from "@mui/material";

const NewPost: React.FC = () => {
  const navigate = useNavigate();
  //   const [name, setName] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");

  //convert special characters to their escaped/encoded values respectively
  const stripHtmlEntities = (str: String) => {
    return String(str)
      .replace(/\n/g, "<br> <br>")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  };

  const onChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    setFunction: React.Dispatch<React.SetStateAction<string>>
  ) => {
    setFunction(event.target.value);
  };

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (title.length == 0 || content.length == 0) return;

    const body = {
      token: localStorage.getItem("token"),
      post: {
        title,
        category,
        content: stripHtmlEntities(content),
      },
    };
    console.log(JSON.stringify(body));

    sendRequest(backendLinks.create_post, "POST", body)
      .then((response) => {
        console.log("hi");
        console.dir(response);
        navigate(`/post/${response.post.id}`);
      })
      .catch((error) => console.log(error.message));
  };
  return (
    <Box sx={{ mt: 5 }}>
      <Grid container justifyContent="center">
        <Grid item xs={12} lg={6}>
          <Typography variant="h4" fontWeight="normal" mb={5}>
            Add a new thread!
          </Typography>
          <form onSubmit={onSubmit}>
            <TextField
              label="Title"
              type="text"
              name="title"
              required
              fullWidth
              margin="normal"
              onChange={(event) => onChange(event, setTitle)}
            />
            <TextField
              label="Category"
              type="text"
              name="category"
              required
              fullWidth
              margin="normal"
              onChange={(event) => onChange(event, setCategory)}
            />
            <TextField
              label="Content"
              type="text"
              name="content"
              required
              multiline
              rows={5}
              fullWidth
              margin="normal"
              onChange={(event) => onChange(event, setContent)}
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              sx={{ mt: 3, mr: 2 }}
            >
              Create Thread
            </Button>
            <Link
              href="/posts"
              variant="body2"
              sx={{ mt: 3, display: "inline-block" }}
            >
              Back to threads
            </Link>
          </form>
        </Grid>
      </Grid>
    </Box>
  );
};

export default NewPost;
