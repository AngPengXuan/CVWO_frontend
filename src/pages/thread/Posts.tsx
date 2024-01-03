import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { PostInterface } from "../../components/interfaces";
import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  Grid,
  Typography,
} from "@mui/material";
import { backendLinks } from "../../utils/BackendConfig";

interface PostArray {
  post: PostInterface;
  username: string;
}

const Posts = () => {
  const navigate = useNavigate();
  const [postsArr, setPost] = useState<PostArray[]>([]);

  useEffect(() => {
    fetch(backendLinks.show_all_thread)
      .then((res) => {
        if (res.ok) {
          console.dir(res);
          return res.json();
        }
        throw new Error("Network response was not ok.");
      })
      .then((res) => setPost(res))
      .catch(() => navigate("/"));
  }, []);

  console.dir(postsArr);

  const allPosts = postsArr.map((res, index) => (
    <Grid item xs={12} key={index} sx={{ mb: 3 }}>
      <Card key={index}>
        <CardActionArea href={`/post/${res.post.id}`}>
          <CardContent>
            <Typography variant="h5" component="h5">
              {res.post.title}
            </Typography>
            <Typography color="textSecondary" gutterBottom>
              {res.username}
            </Typography>
            <Typography variant="body2" component="p">
              {res.post.content}
            </Typography>
          </CardContent>
        </CardActionArea>
      </Card>
    </Grid>
  ));

  const noPost = (
    <div>
      <h3>
        No posts yet. Why not <Link to="/new_post">create one</Link>
      </h3>
    </div>
  );

  return (
    <>
      <Box sx={{ px: 5 }}>{postsArr.length > 0 ? allPosts : noPost}</Box>
    </>
  );
};

export default Posts;
