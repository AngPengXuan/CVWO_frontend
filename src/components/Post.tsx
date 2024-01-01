import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

interface Post {
  title: string;
  content: string;
}

const Post = () => {
  const params = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState<Post>();

  useEffect(() => {
    console.dir(params.id);
    const url = `http://localhost:3000/api/v1/show/${params.id}`;
    fetch(url)
      .then((res) => {
        if (res.ok) {
          //   console.dir(res.json());
          return res.json();
        }
        throw new Error("Network response was not ok");
      })
      .then((res) => {
        console.log("hi");
        setPost(res);
        console.log(post);
      })
      .catch(() => navigate("/posts"));
  }, [params.id]);

  const addHtmlEntities = (str: string) => {
    return String(str).replace(/&lt;/g, "<").replace(/&gt;/g, ">");
  };

  const deletePost = () => {
    const url = `http://localhost:3000/api/v1/destroy/${params.id}`;
    const csrfTokenElement = document.querySelector(
      'meta[name="csrf-token"]'
    ) as HTMLMetaElement;
    const token = csrfTokenElement && csrfTokenElement.content;

    fetch(url, {
      method: "DELETE",
      headers: {
        "X-CSRF-Token": token,
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
        throw new Error("Network response was not ok.");
      })
      .then(() => navigate("/posts"))
      .catch((error) => console.log(error.message));
  };

  const postContent = post && addHtmlEntities(post.content);

  return (
    <div className="">
      <div className="container py-5">
        <div className="row">
          <div className="col-sm-12 col-lg-3">
            <ul className="list-group">
              <h5 className="mb-2">Title</h5>
              {post && post.title}
            </ul>
          </div>
          <div className="col-sm-12 col-lg-7">
            <h5 className="mb-2">Content</h5>
            <div
              dangerouslySetInnerHTML={{
                __html: `${postContent}`,
              }}
            />
          </div>
          <div className="col-sm-12 col-lg-2">
            <button
              type="button"
              className="btn btn-danger"
              onClick={deletePost}
            >
              Delete Post
            </button>
          </div>
        </div>
        <Link to="/posts" className="btn btn-link">
          Back to posts
        </Link>
      </div>
    </div>
  );
};

export default Post;
