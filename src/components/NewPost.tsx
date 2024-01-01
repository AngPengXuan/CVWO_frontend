import React, { ChangeEvent, FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

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
    const url = "http://localhost:3000/api/v1/posts/create";

    if (title.length == 0 || content.length == 0) return;

    // const body = {
    //   token: localStorage.getItem("token"),
    //   title,
    //   category,
    //   content: stripHtmlEntities(content),
    // };
    const body = {
      token: localStorage.getItem("token"),
      post: {
        title,
        category,
        content: stripHtmlEntities(content),
      },
    };
    console.log(JSON.stringify(body));

    //need check if null
    const csrfTokenElement = document.querySelector(
      'meta[name="csrf-token"]'
    ) as HTMLMetaElement;
    const csrfToken = csrfTokenElement && csrfTokenElement.content;

    fetch(url, {
      method: "POST",
      headers: {
        "X-CSRF-Token": csrfToken,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
        throw new Error("Network response was not ok.");
      })
      .then((response) => navigate(`/post/${response.id}`))
      .catch((error) => console.log(error.message));
  };

  return (
    <div className="container mt-5">
      <div className="row">
        <div className="col-sm-12 col-lg-6 offset-lg-3">
          <h1 className="font-weight-normal mb-5">Add a new post!</h1>
          <form onSubmit={onSubmit}>
            <div className="form-group">
              <label htmlFor="posttitle">Title</label>
              <input
                type="text"
                name="title"
                id="posttitle"
                className="form-control"
                required
                onChange={(event) => onChange(event, setTitle)}
              />
            </div>
            <div>
              <label htmlFor="postCategory">Category</label>
              <input
                type="text"
                name="category"
                id="postCategory"
                className="form-control"
                required
                onChange={(event) => onChange(event, setCategory)}
              />
            </div>
            <label htmlFor="postcontent">Content</label>
            <textarea
              className="form-control"
              id="postcontent"
              name="content"
              rows={5}
              required
              onChange={(event) => onChange(event, setContent)}
            />
            <button type="submit" className="btn custom-button mt-3">
              Create Post
            </button>
            <Link to="/posts" className="btn btn-link mt-3">
              Back to posts
            </Link>
          </form>
        </div>
      </div>
    </div>
  );
};

export default NewPost;
