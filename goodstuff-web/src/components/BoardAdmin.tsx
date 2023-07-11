import React, { useState, useEffect } from "react";
import EventBus from "../common/EventBus";
import UserService from "../services/user.service";

interface ResponseData {
  data: string;
  status?: number;
  message?: string;
}

const BoardAdmin: React.FC = () => {
  const [content, setContent] = useState<string>("");

  useEffect(() => {
    UserService.getAdminBoard().then(
        (response: ResponseData) => {
          setContent(response.data);
        },
        (error: { response?: ResponseData; message?: string; toString?: () => string }) => {
          const _content =
              (error.response &&
                  error.response.data &&
                  error.response.message) ||
              error.message ||
              (error.toString ? error.toString() : "An error occurred");

          setContent(_content);

          if (error.response && error.response.status === 401) {
            EventBus.dispatch("logout", null);
          }
        }
    );
  }, []);

  return (
      <div className="container">
        <header className="jumbotron">
          <h3>{content}</h3>
        </header>
      </div>
  );
};

export default BoardAdmin;
