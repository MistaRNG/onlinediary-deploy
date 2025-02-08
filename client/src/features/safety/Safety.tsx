import "./Safety.css";
import { Button, InputGroup } from "@blueprintjs/core";
import useCurrentUser from "common/hooks/useCurrentUser";
import useShowPassword from "common/hooks/useShowPassword";
import LockButton from "features/auth/LockButton";
import { useRef, FormEvent, useState, useEffect } from "react";
import { logIn } from "features/auth/authSlice";
import { useDispatch } from "react-redux";
import { unlock } from "./safetySlice";
import { useNavigate } from "react-router-dom";

const Safety: React.FC = () => {
  const { username } = useCurrentUser();
  const { showPassword, toggleShowPassword } = useShowPassword();
  const passwordRef = useRef<HTMLInputElement>(null);
  const dispatch: any = useDispatch();
  const [loginMethod, setLoginMethod] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    setLoginMethod(localStorage.getItem("loginMethod"));
  }, []);

  const clearPassword = () => {
    if (passwordRef.current) {
      passwordRef.current.value = "";
    }
  };

  const successFn = () => dispatch(unlock());

  const submitHandler = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const password = passwordRef.current?.value || "";
    dispatch(logIn(username, password, clearPassword, successFn));
  };

  const handleGitLabLogin = () => {
    window.open(
      "http://localhost:3001/api/auth/gitlab",
      "_blank",
      "width=600,height=800"
    );

    const checkAuthInterval = setInterval(() => {
      if (localStorage.getItem("oauthToken")) {
        clearInterval(checkAuthInterval);
        dispatch(unlock());
        navigate("/journal");
      }
    }, 500);
  };

  useEffect(() => {
    window.addEventListener("message", (event) => {
      if (event.origin === "http://localhost:3001" && event.data.token) {
        localStorage.setItem("oauthToken", event.data.token);
        localStorage.setItem("username", event.data.username);
      }
    });

    return () => {
      window.removeEventListener("message", () => {});
    };
  }, []);

  return (
    <div className="Safety">
      {loginMethod === "gitlab" ? (
        <Button large={true} onClick={handleGitLabLogin}>
          Re-login with GitLab
        </Button>
      ) : (
        <form onSubmit={submitHandler}>
          <h2>Enter password for</h2>
          <h3>{`@${username}`}</h3>
          <InputGroup
            inputRef={passwordRef}
            autoComplete="on"
            large={true}
            rightElement={
              <LockButton {...{ showPassword, toggleShowPassword }} />
            }
            type={showPassword ? "text" : "password"}
          />
          <Button large={true} type="submit">
            Unlock
          </Button>
        </form>
      )}
    </div>
  );
};

export default Safety;
