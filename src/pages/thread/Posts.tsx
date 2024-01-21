import React, { useEffect, useState } from "react";
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

interface PostProps {
  searchValue: string;
  sortOption: string;
  sortOptions: Array<string>;
}

interface PostInfo {
  post: PostInterface;
  username: string;
}

const Posts: React.FC<PostProps> = ({
  searchValue,
  sortOption,
  sortOptions,
}) => {
  const navigate = useNavigate();
  const [postsArr, setPost] = useState<PostInfo[]>([]);
  const [filteredPostsArr, setFilteredPostArr] = useState<PostInfo[]>([]);

  useEffect(() => {
    fetch(backendLinks.show_all_thread)
      .then((res) => {
        if (res.ok) {
          console.dir(res);
          return res.json();
        }
        throw new Error("Network response was not ok.");
      })
      .then((res) => {
        setPost(res);
        setFilteredPostArr(res);
      })
      .catch(() => navigate("/"));
  }, []);

  console.dir(postsArr);

  useEffect(() => {
    const filteredPosts = postsArr.filter(
      (postInfo) =>
        postInfo.post.title.toLowerCase().includes(searchValue.toLowerCase()) ||
        postInfo.post.content
          .toLowerCase()
          .includes(searchValue.toLowerCase()) ||
        postInfo.post.category.toLowerCase().includes(searchValue.toLowerCase())
    );
    setFilteredPostArr(filteredPosts);
  }, [searchValue]);

  useEffect(() => {
    const sortedPosts = postsArr.slice().sort((postInfoA, postInfoB) => {
      const dateA = new Date(postInfoA.post.created_at);
      const dateB = new Date(postInfoB.post.created_at);

      // Compare the dates
      if (sortOption == sortOptions[0]) {
        return dateB.getTime() - dateA.getTime();
      } else if (sortOption == sortOptions[1]) {
        return dateA.getTime() - dateB.getTime();
      }
      return 0;
    });
    setFilteredPostArr(sortedPosts);
  }, [sortOption]);

  const allPosts = filteredPostsArr.map((res, index) => (
    <Grid item xs={12} key={index} sx={{ mb: 3 }}>
      <Card key={index}>
        <CardActionArea href={`/post/${res.post.id}`}>
          <CardContent>
            <Typography variant="h5" component="h5" fontWeight="bold">
              {res.post.title}
            </Typography>
            <Typography color="textSecondary" gutterBottom>
              posted by {res.username} on {res.post.created_at.toLocaleString()}
            </Typography>
            <Typography color="textSecondary" gutterBottom>
              category: {res.post.category}
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
      <Box sx={{ px: 5 }}>
        {filteredPostsArr.length > 0 ? allPosts : noPost}
      </Box>
    </>
  );
};

export default Posts;
