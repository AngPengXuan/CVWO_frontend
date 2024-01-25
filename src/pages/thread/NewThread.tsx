import React, { Dispatch, FormEvent, SetStateAction, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  onChange,
  sendRequest,
  stripHtmlEntities,
} from "../../components/Functions";
import { backendLinks } from "../../utils/BackendConfig";
import { Box, Button, TextField, Typography, Link, Grid } from "@mui/material";

// Interface for new post/thread properties
interface newPostProps {
  setsearchAndSort: Dispatch<SetStateAction<boolean>>;
}

// The new post/thread component
const NewPost: React.FC<newPostProps> = ({ setsearchAndSort }) => {
  // Sets the states required
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");

  //Removes search and sort field on render
  React.useEffect(() => {
    setsearchAndSort(false);
  }, []);

  // Sends a post request with the data when submit button is clicked
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
        setsearchAndSort(true);
        navigate(`/thread/${response.post.id}`);
      })
      .catch((error) => console.log(error.message));
  };

  // New post/thread page
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
