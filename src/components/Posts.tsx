import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

interface Post {
  title: string;
  content: string;
  id: BigInteger;
}

interface PostArray {
  post: Post;
  username: string;
}

const Posts = () => {
  const navigate = useNavigate();
  const [posts, setPost] = useState<PostArray[]>([]);

  useEffect(() => {
    const url = "http://localhost:3000/api/v1/posts/index";
    fetch(url)
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

  console.dir(posts);

  const allPosts = posts.map((post, index) => (
    <div key={index}>
      <h3>
        <Link to={`/post/${post.post.id}`}>{post.post.title}</Link>
      </h3>
      <h5>{post.username}</h5>
      <p>{post.post.content}</p>
    </div>
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
      <div>{posts.length > 0 ? allPosts : noPost}</div>
    </>
  );
};

export default Posts;
