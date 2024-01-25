import { RequestData } from "./Interfaces";
import { ChangeEvent } from "react";

// Get the CSRF token
const getCsrfToken = () => {
  const csrfTokenElement = document.querySelector(
    'meta[name="csrf-token"]'
  ) as HTMLMetaElement;
  return csrfTokenElement && csrfTokenElement.content;
};

// To send requests such as POST, DELETE
export const sendRequest = (url: string, method: string, data: RequestData) => {
  const token = getCsrfToken();

  return fetch(url, {
    method,
    headers: {
      "X-CSRF-Token": token,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((response) => {
      if (response.ok) {
        return response.json();
      }
      throw new Error("Network response was not ok.");
    })
    .catch((error) => console.log(error.message));
};

// Function to handle changes to text field
export const onChange = (
  event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  setFunction: React.Dispatch<React.SetStateAction<string>>
) => {
  setFunction(event.target.value);
};

// Sanitise Html entities in a text field
export const stripHtmlEntities = (str: string) => {
  return String(str)
    .replace(/\n/g, "<br> <br>")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
};

// Handle the ENTER keypress
export const handleKeypress = (func: () => void) => {
  return (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      func();
    }
  };
};
