import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { PostInterface } from "../../components/interfaces";
import { Card, CardContent, Typography } from "@mui/material";
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
    <Card key={index}>
      <CardContent>
        <Typography variant="h5" component="h5">
          <Link to={`/post/${res.post.id}`}>{res.post.title}</Link>
        </Typography>
        <Typography color="textSecondary" gutterBottom>
          {res.username}
        </Typography>
        <Typography variant="body2" component="p">
          {res.post.content}
        </Typography>
      </CardContent>
    </Card>
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
      <div style={{ width: "30vw", margin: "auto", textAlign: "center" }}>
        {postsArr.length > 0 ? allPosts : noPost}
      </div>
    </>
  );
};

export default Posts;
