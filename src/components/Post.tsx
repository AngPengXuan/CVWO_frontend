import React, { ChangeEvent, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

interface Post {
  title: string;
  content: string;
  category: string;
}

interface Response {
  post: Post;
  is_owner: boolean;
}

const Post = () => {
  const params = useParams();
  const navigate = useNavigate();
  const [res, setRes] = useState<Response>();
  const [editable, setEditable] = useState(false);
  const [editedTitle, setEditedTitle] = useState("");
  const [editedContent, setEditedContent] = useState("");
  const [editedCategory, setEditedCategory] = useState("");

  const toggleEdit = () => {
    setEditable(!editable);
  };

  const onChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    setFunction: React.Dispatch<React.SetStateAction<string>>
  ) => {
    setFunction(event.target.value);
  };

  const body = {
    token: localStorage.getItem("token"),
  };

  const stripHtmlEntities = (str: string) => {
    return String(str)
      .replace(/\n/g, "<br> <br>")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  };

  //need check if null
  const csrfTokenElement = document.querySelector(
    'meta[name="csrf-token"]'
  ) as HTMLMetaElement;
  const csrfToken = csrfTokenElement && csrfTokenElement.content;

  useEffect(() => {
    console.dir(params.id);
    const url = `http://localhost:3000/api/v1/show/${params.id}`;
    fetch(url, {
      method: "POST",
      headers: {
        "X-CSRF-Token": csrfToken,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    })
      .then((res) => {
        if (res.ok) {
          //   console.dir(res.json());
          return res.json();
        }
        throw new Error("Network response was not ok");
      })
      .then((res) => {
        console.log("hi");
        setRes(res);
        console.log(res);
      })
      .catch(() => navigate("/posts"));
  }, [params.id]);

  useEffect(() => {
    if (res && res.post) {
      setEditedTitle(res.post.title);
      setEditedContent(res.post.content);
      setEditedCategory(res.post.category);
    }
  }, [res]);

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
      body: JSON.stringify(body),
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

  const saveChanges = () => {
    const url = `http://localhost:3000/api/v1/update/${params.id}`;
    const csrfTokenElement = document.querySelector(
      'meta[name="csrf-token"]'
    ) as HTMLMetaElement;
    const token = csrfTokenElement && csrfTokenElement.content;

    const updatedBody = {
      token: localStorage.getItem("token"),
      post: {
        title: editedTitle,
        category: editedCategory,
        content: stripHtmlEntities(editedContent),
      },
    };

    console.dir(JSON.stringify(updatedBody));

    fetch(url, {
      method: "PATCH",
      headers: {
        "X-CSRF-Token": token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedBody),
    })
      .then((response) => {
        if (response.ok) {
          setEditable(false);
          return response.json();
        }
        throw new Error("Network response was not ok.");
      })
      .then((response) => navigate(`/post/${response.id}`))
      .catch((error) => console.log(error.message));
  };

  const postContent = res && addHtmlEntities(res.post.content);

  return (
    <div className="">
      <div className="container py-5">
        <div className="row">
          <div className="col-sm-12 col-lg-3">
            <ul className="list-group">
              <h5 className="mb-2">Title</h5>
              {editable ? (
                <textarea
                  name="title"
                  value={editedTitle}
                  onChange={(e) => {
                    onChange(e, setEditedTitle);
                  }}
                />
              ) : (
                <span>{res && res.post.title}</span>
              )}
            </ul>
          </div>
          <div className="col-sm-12 col-lg-3">
            <ul className="list-group">
              <h5 className="mb-2">Category</h5>
              {editable ? (
                <textarea
                  name="category"
                  value={editedCategory}
                  onChange={(e) => {
                    onChange(e, setEditedCategory);
                  }}
                />
              ) : (
                <span>{res && res.post.category}</span>
              )}
            </ul>
          </div>
          <div className="col-sm-12 col-lg-7">
            <h5 className="mb-2">Content</h5>
            {editable ? (
              <textarea
                name="content"
                value={editedContent}
                onChange={(e) => {
                  onChange(e, setEditedContent);
                }}
              />
            ) : (
              <div
                dangerouslySetInnerHTML={{
                  __html: `${postContent}`,
                }}
              />
            )}
          </div>
          {res && res.is_owner && (
            <div className="col-sm-12 col-lg-2">
              <button
                type="button"
                className="btn btn-danger"
                onClick={deletePost}
              >
                Delete Post
              </button>
              <br />
              <br />
              {editable ? (
                <button
                  type="button"
                  className="btn btn-success"
                  onClick={saveChanges}
                >
                  Save Changes
                </button>
              ) : (
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={toggleEdit}
                >
                  Update Post
                </button>
              )}
            </div>
          )}
        </div>
        <Link to="/posts" className="btn btn-link">
          Back to posts
        </Link>
      </div>
    </div>
  );
};

export default Post;
