import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { PostInterface } from "../../components/Interfaces";
import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  Grid,
  Typography,
} from "@mui/material";
import { backendLinks } from "../../utils/BackendConfig";
import RatingItem from "../../components/ThreadRating";

// All the interfaces required for the page
interface PostProps {
  searchValue: string;
  sortOption: string;
  sortOptions: Array<string>;
}

interface RatingInterface {
  user_id: number;
  rating: number;
}

interface PostInfo {
  content: (string | JSX.Element)[];
  title: (string | JSX.Element)[];
  category: (string | JSX.Element)[];
  post: PostInterface;
  ratings: Array<RatingInterface>;
  username: string;
}

// Component to render all the threads/posts
const Posts: React.FC<PostProps> = ({
  searchValue,
  sortOption,
  sortOptions,
}) => {
  //Sets the states required
  const navigate = useNavigate();
  const [postsArr, setPost] = useState<PostInfo[]>([]);
  const [filteredPostsArr, setFilteredPostArr] = useState<PostInfo[]>([]);

  // Function to get response, getting all the thread/post data
  const getRes = () => {
    fetch(backendLinks.show_all_post)
      .then((res) => {
        if (res.ok) {
          return res.json();
        }
        throw new Error("Network response was not ok.");
      })
      .then((res) => {
        res.map((postInfo: PostInfo) => {
          postInfo.post.created_at = new Date(postInfo.post.created_at);
        });
        setPost(res);
      })
      .catch(() => navigate("/"));
  };

  // Gets all the thread/post data everytime page is loaded
  useEffect(() => {
    getRes();
  }, []);

  // Handles searching everytime something is typed in search bar
  useEffect(() => {
    if (!searchValue) {
      sortPosts(postsArr);
      return;
    }

    const lowercaseSearch = searchValue.toLowerCase();

    const matchingPosts = postsArr.filter(
      (postInfo) =>
        postInfo.post.content.toLowerCase().includes(lowercaseSearch) ||
        postInfo.post.title.toLowerCase().includes(lowercaseSearch) ||
        postInfo.post.category.toLowerCase().includes(lowercaseSearch)
    );
    const nonMatchingPosts = postsArr.filter(
      (postInfo) =>
        !postInfo.post.content.toLowerCase().includes(lowercaseSearch) &&
        !postInfo.post.title.toLowerCase().includes(lowercaseSearch) &&
        !postInfo.post.category.toLowerCase().includes(lowercaseSearch)
    );

    const updatedPosts = [...matchingPosts, ...nonMatchingPosts];

    const highlightArray = (input: string, lowercaseSearch: string) => {
      return input
        .split(new RegExp(`(${lowercaseSearch})`, "i"))
        .map((part, index) =>
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
        );
    };

    const highlightedPosts = updatedPosts.map((postInfo) => {
      const highlightedContent = highlightArray(
        postInfo.post.content,
        lowercaseSearch
      );
      const highlightedTitle = highlightArray(
        postInfo.post.title,
        lowercaseSearch
      );
      const highlightedCategory = highlightArray(
        postInfo.post.category,
        lowercaseSearch
      );

      return {
        ...postInfo,
        content: highlightedContent,
        title: highlightedTitle,
        category: highlightedCategory,
      };
    });
    setFilteredPostArr(highlightedPosts);
  }, [searchValue, postsArr]);

  // Sort the Threads/Posts by rating/date
  const sortPosts = (postsArr: Array<PostInfo>) => {
    const sortedPosts = postsArr.slice().sort((postInfoA, postInfoB) => {
      const dateA = new Date(postInfoA.post.created_at);
      const dateB = new Date(postInfoB.post.created_at);

      // Compare the dates
      if (sortOption == sortOptions[0]) {
        return dateB.getTime() - dateA.getTime();
      } else if (sortOption == sortOptions[1]) {
        return dateA.getTime() - dateB.getTime();
      } else if (sortOption == sortOptions[2]) {
        return (
          postInfoB.ratings.reduce(
            (accumulator, currVal) => accumulator + currVal.rating,
            0
          ) -
          postInfoA.ratings.reduce(
            (accumulator, currVal) => accumulator + currVal.rating,
            0
          )
        );
      } else if (sortOption == sortOptions[3]) {
        return (
          postInfoA.ratings.reduce(
            (accumulator, currVal) => accumulator + currVal.rating,
            0
          ) -
          postInfoB.ratings.reduce(
            (accumulator, currVal) => accumulator + currVal.rating,
            0
          )
        );
      }
      return 0;
    });
    setFilteredPostArr(sortedPosts);
  };

  // Sort the Threads/Posts by rating/date whenever the sort option changes
  useEffect(() => {
    getRes();
    sortPosts(postsArr);
  }, [sortOption]);

  // Renders all the post/threads
  const allPosts = filteredPostsArr.map((postInfo, index) => (
    <Grid item xs={12} key={index} sx={{ mb: 3 }}>
      <Card key={index}>
        <CardActionArea href={`/thread/${postInfo.post.id}`}>
          <CardContent>
            <Typography variant="h5" component="h5" fontWeight="bold">
              {postInfo.title || postInfo.post.title}
            </Typography>
            <Typography color="textSecondary" gutterBottom>
              posted by {postInfo.username} on{" "}
              {postInfo.post.created_at.toLocaleString("en-US", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
                timeZone: "UTC",
              })}
            </Typography>
            <Typography color="textSecondary" gutterBottom>
              category: {postInfo.category || postInfo.post.category}
            </Typography>
            <Typography variant="body2" component="p">
              {postInfo.content || postInfo.post.content}
            </Typography>
          </CardContent>
        </CardActionArea>
        <RatingItem
          post_id={postInfo.post.id}
          posts={filteredPostsArr}
          getRes={getRes}
        />
      </Card>
    </Grid>
  ));

  // Default when there are no post/threads yet
  const noPost = (
    <div>
      <h3>
        No threads yet. Why not <Link to="/new_thread">create one</Link>
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
