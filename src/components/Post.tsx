import React, { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

interface Post {
  title: string;
  content: string;
  category: string;
}

interface Comment {
  username: string;
  content: string;
  is_owner: boolean;
  id: number;
}

interface Response {
  post: Post;
  comments: Comment[];
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
  const [editableComment, setEditableComment] = useState(false);
  const [editableCommentIndex, setEditableCommentIndex] = useState(-1);
  const [editedContentComment, setEditedContentComment] = useState("");
  const [editedCommentId, setEditedCommentId] = useState(-1);
  const [content, setContent] = useState("");
  const [comments, setComments] = useState<Comment[]>();

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

  const getRes = () => {
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
  };

  useEffect(() => {
    getRes();
  }, [params.id]);

  useEffect(() => {
    if (res && res.post) {
      setEditedTitle(res.post.title);
      setEditedContent(res.post.content);
      setEditedCategory(res.post.category);
      setComments(res.comments);
      console.dir(comments);
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
          getRes();
          return response.json();
        }
        throw new Error("Network response was not ok.");
      })
      .then((response) => navigate(`/post/${response.id}`))
      .catch((error) => console.log(error.message));
  };

  const postContent = res && addHtmlEntities(res.post.content);

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const url = "http://localhost:3000/api/v1/comments/create";

    if (content.length == 0) return;

    const commentBody = {
      token: localStorage.getItem("token"),
      comment: {
        content: stripHtmlEntities(content),
        post_id: params.id,
      },
    };
    console.dir(commentBody);

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
      body: JSON.stringify(commentBody),
    })
      .then((response) => {
        if (response.ok) {
          setContent("");
          getRes();
          return response.json();
        }
        throw new Error("Network response was not ok.");
      })
      .then((response) => {
        console.log("navigating");
        navigate(`/post/${response.id}`);
      })
      .catch((error) => console.log(error.message));
  };

  const deleteComment = (index: number) => {
    return () => {
      const url = `http://localhost:3000/api/v1/comment/destroy/${params.id}`;
      const csrfTokenElement = document.querySelector(
        'meta[name="csrf-token"]'
      ) as HTMLMetaElement;
      const token = csrfTokenElement && csrfTokenElement.content;

      const commentBody = {
        token: localStorage.getItem("token"),
        comment: {
          id: index,
        },
      };

      fetch(url, {
        method: "DELETE",
        headers: {
          "X-CSRF-Token": token,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(commentBody),
      })
        .then((response) => {
          if (response.ok) {
            getRes();
            return response.json();
          }
          throw new Error("Network response was not ok.");
        })
        .then(() => navigate(`/post/${params.id}`))
        .catch((error) => console.log(error.message));
    };
  };

  const saveChangesComment = () => {
    const url = `http://localhost:3000/api/v1/comment/update/${params.id}`;
    const csrfTokenElement = document.querySelector(
      'meta[name="csrf-token"]'
    ) as HTMLMetaElement;
    const token = csrfTokenElement && csrfTokenElement.content;

    const updatedBody = {
      token: localStorage.getItem("token"),
      comment: {
        content: stripHtmlEntities(editedContentComment),
        id: editedCommentId,
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
          setEditableComment(false);
          getRes();
          return response.json();
        }
        throw new Error("Network response was not ok.");
      })
      .then((response) => navigate(`/post/${response.id}`))
      .catch((error) => console.log(error.message));
  };

  const toggleEditComment = (index: number) => {
    return () => {
      if (comments && index >= 0) {
        setEditableComment(!editableComment);
        setEditableCommentIndex(index);
        setEditedContentComment(comments[index].content);
        setEditedCommentId(comments[index].id);
      }
    };
  };

  useEffect(() => {
    console.log("comments updated!");
    console.dir(comments);
  }, [comments]);

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

        <div>
          {comments?.map((comment, index) => (
            <div key={index}>
              <span>Username: {comment.username}</span>
              {editableCommentIndex == index && editableComment ? (
                <textarea
                  name="content"
                  value={editedContentComment}
                  onChange={(e) => {
                    onChange(e, setEditedContentComment);
                  }}
                />
              ) : (
                <span>Content: {comment.content}</span>
              )}
              {comment.is_owner &&
                (!editableComment || editableCommentIndex == index) && (
                  <div className="col-sm-12 col-lg-2">
                    <button
                      type="button"
                      className="btn btn-danger"
                      onClick={deleteComment(comment.id)}
                    >
                      Delete Comment
                    </button>
                    <br />
                    <br />
                    {editableCommentIndex == index && editableComment ? (
                      <button
                        type="button"
                        className="btn btn-success"
                        onClick={saveChangesComment}
                      >
                        Save Changes
                      </button>
                    ) : (
                      <button
                        type="button"
                        className="btn btn-danger"
                        onClick={toggleEditComment(index)}
                      >
                        Update Post
                      </button>
                    )}
                  </div>
                )}
            </div>
          ))}
        </div>

        {localStorage.hasOwnProperty("token") && (
          <div>
            <form onSubmit={onSubmit}>
              <label htmlFor="postcontent">Content</label>
              <textarea
                className="form-control"
                id="postcontent"
                name="content"
                rows={3}
                required
                value={content}
                onChange={(event) => onChange(event, setContent)}
              />
              <button type="submit" className="btn custom-button mt-3">
                Create Comment
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default Post;
