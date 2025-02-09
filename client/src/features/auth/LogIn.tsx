import "./Auth.css";
import { Button, InputGroup, FormGroup } from "@blueprintjs/core";
import { Link, useNavigate } from "react-router-dom";
import useShowPassword from "common/hooks/useShowPassword";
import LockButton from "./LockButton";
import { useRef, FormEvent, useEffect, useState } from "react";
import { logIn } from "./authSlice";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../app/store";
import Tooltip from "@mui/material/Tooltip";

const LogIn: React.FC = () => {
  const { showPassword, toggleShowPassword } = useShowPassword();
  const usernameRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const [showUsernameTooltip, setShowUsernameTooltip] = useState(false);
  const [showPasswordTooltip, setShowPasswordTooltip] = useState(false);

  const clearPassword = () => {
    if (passwordRef.current) {
      passwordRef.current.value = "";
    }
  };

  const submitHandler = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const username = usernameRef.current?.value || "";
    const password = passwordRef.current?.value || "";

    localStorage.setItem("loginMethod", "standard");
    dispatch(logIn(username, password, clearPassword, () => navigate("/journal")));
  };

  const handleGitLabLogin = () => {
    window.open(
      "https://onlinediary-deploy-production.up.railway.app/api/auth/gitlab",
      "_blank",
      "width=600,height=800"
    );

    const checkAuthInterval = setInterval(() => {
      if (localStorage.getItem("oauthToken")) {
        clearInterval(checkAuthInterval);

        const username = localStorage.getItem("username") || "unknownUser";
        if (usernameRef.current && passwordRef.current) {
          usernameRef.current.value = username;
          passwordRef.current.value = "oauth-simulated-password";
        }

        document.getElementById("login-form")?.dispatchEvent(
          new Event("submit", { cancelable: true, bubbles: true })
        );

        localStorage.setItem("loginMethod", "gitlab");
        localStorage.removeItem("oauthToken");
        localStorage.removeItem("username");
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

  const handleShowTooltip = (setShowTooltip: (value: boolean) => void) => {
    setShowTooltip(true);
    setTimeout(() => setShowTooltip(false), 5000);
  };

  return (
    <>
      <h1>Login</h1>
      <Button
        onClick={handleGitLabLogin}
        large={true}
        intent="primary"
        style={{
          marginTop: "2em",
          backgroundColor: "#006bb3",
          color: "#ffffff",
          padding: "1em 1.5em",
          fontSize: "1.5rem",
          marginBottom: "1.5em",
          width: "90%",
          maxWidth: "400px",
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-start",
          gap: "0.5em",
          textAlign: "left",
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          id="Login"
          width="50px"
          style={{
            verticalAlign: "middle",
            marginRight: "0.5em",
            marginBottom: "0.2em",
          }}
        >
          <g fill="#ffffff" className="color000000 svgShape">
            <path d="M19 4h-2a1 1 0 0 0 0 2h1v12h-1a1 1 0 0 0 0 2h2a1 1 0 0 0 1-1V5a1 1 0 0 0-1-1zm-7.2 3.4a1 1 0 0 0-1.6 1.2L12 11H4a1 1 0 0 0 0 2h8.09l-1.72 2.44a1 1 0 0 0 .24 1.4 1 1 0 0 0 .58.18 1 1 0 0 0 .81-.42l2.82-4a1 1 0 0 0 0-1.18z" fill="#ffffff" className="color000000 svgShape"></path>
          </g>
        </svg>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          id="gitlab"
          width="30px"
          height="30px"
          style={{
            verticalAlign: "middle",
            marginRight: "0.5em",
            marginBottom: "0.3em",
          }}
        >
          <path fill="#E24329" d="m12 23.054 4.419-13.6H7.581L12 23.054z"></path>
          <path fill="#FC6D26" d="m12 23.054-4.419-13.6H1.388L12 23.054z"></path>
          <path fill="#FCA326" d="M1.388 9.453.045 13.586a.917.917 0 0 0 .332 1.023L12 23.054 1.388 9.453z"></path>
          <path fill="#E24329" d="M1.388 9.454h6.193L4.919 1.262a.457.457 0 0 0-.87 0L1.388 9.454z"></path>
          <path fill="#FC6D26" d="m12 23.054 4.419-13.6h6.193L12 23.054z"></path>
          <path fill="#FCA326" d="m22.612 9.453 1.343 4.133a.917.917 0 0 1-.332 1.023L12 23.054 22.612 9.453z"></path>
          <path fill="#E24329" d="M22.612 9.454h-6.193l2.662-8.191a.457.457 0 0 1-.87 0l2.661 8.191z"></path>
        </svg>
        Use GitLab for Login
      </Button>

      <form
        id="login-form"
        onSubmit={submitHandler}
        style={{
          borderTop: "1px solid #444",
          paddingTop: "1em",
          maxWidth: "300px",
          margin: "1em auto 0 auto",
        }}
      >
        <Tooltip
          title="⚠️ GitLab login is recommended for better security – use standard login only if needed."
          open={showUsernameTooltip}
          placement="top"
          onClose={() => setShowUsernameTooltip(false)}
        >
          <div>
            <FormGroup label="Username">
              <InputGroup
                large={true}
                inputRef={usernameRef}
                style={{ width: "100%" }}
                onFocus={() => handleShowTooltip(setShowUsernameTooltip)}
              />
            </FormGroup>
          </div>
        </Tooltip>
        <Tooltip
          title="⚠️ GitLab login is recommended for better security – use standard login only if needed."
          open={showPasswordTooltip}
          placement="top"
          onClose={() => setShowPasswordTooltip(false)}
        >
          <div>
            <FormGroup label="Password">
              <InputGroup
                inputRef={passwordRef}
                autoComplete="on"
                large={true}
                rightElement={
                  <LockButton {...{ showPassword, toggleShowPassword }} />
                }
                type={showPassword ? "text" : "password"}
                style={{ width: "100%" }}
                onFocus={() => handleShowTooltip(setShowPasswordTooltip)}
              />
            </FormGroup>
          </div>
        </Tooltip>
        <Button
          type="submit"
          large={true}
          style={{
            backgroundColor: "#777",
            borderColor: "#555",
            color: "#fff",
            width: "100%",
            transition: "background-color 0.3s ease",
            cursor: "pointer",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "#555";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "#777";
          }}
        >
          Login
        </Button>

        <p
          style={{
            color: '#ffa500',
            fontSize: '0.9rem',
            textAlign: 'center',
            marginTop: '0.5em',
          }}
        >
          ⚠️ Use standard login only in emergencies – GitLab login is more secure!
        </p>
      </form>
      <div className="user-link" style={{ textAlign: "center", marginTop: "1em" }}>
        Not a member? <Link to="/register">Register</Link>
      </div>
    </>
  );
};

export default LogIn;
