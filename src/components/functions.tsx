import { RequestData } from "./interfaces";
import { ChangeEvent } from "react";

const getCsrfToken = () => {
  const csrfTokenElement = document.querySelector(
    'meta[name="csrf-token"]'
  ) as HTMLMetaElement;
  return csrfTokenElement && csrfTokenElement.content;
};

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

export const onChange = (
  event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  setFunction: React.Dispatch<React.SetStateAction<string>>
) => {
  setFunction(event.target.value);
};

export const stripHtmlEntities = (str: string) => {
  return String(str)
    .replace(/\n/g, "<br> <br>")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
};
