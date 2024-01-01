import { useEffect, useState } from "react";
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
  const [postsArr, setPost] = useState<PostArray[]>([]);

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

  console.dir(postsArr);

  const allPosts = postsArr.map((res, index) => (
    <div key={index}>
      <h3>
        <Link to={`/post/${res.post.id}`}>{res.post.title}</Link>
      </h3>
      <h5>{res.username}</h5>
      <p>{res.post.content}</p>
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
      <div>{postsArr.length > 0 ? allPosts : noPost}</div>
    </>
  );
};

export default Posts;
