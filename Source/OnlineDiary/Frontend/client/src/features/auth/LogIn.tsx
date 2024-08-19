import "./Auth.css";
import { Button, InputGroup, FormGroup } from "@blueprintjs/core";
import { Link } from "react-router-dom";
import useShowPassword from "common/hooks/useShowPassword";
import LockButton from "./LockButton";
import { useRef, FormEvent } from "react";
import { logIn } from "./authSlice";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../app/store";

const LogIn: React.FC = () => {
  const { showPassword, toggleShowPassword } = useShowPassword();

  const usernameRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  const dispatch = useDispatch<AppDispatch>();

  const clearPassword = () => {
    if (passwordRef.current) {
      passwordRef.current.value = "";
    }
  };

  const submitHandler = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const username = usernameRef.current?.value || "";
    const password = passwordRef.current?.value || "";
    dispatch(logIn(username, password, clearPassword, () => {}));
  };

  return (
    <>
      <h1>Login</h1>
      <form onSubmit={submitHandler}>
        <FormGroup label="Username">
          <InputGroup large={true} inputRef={usernameRef} />
        </FormGroup>
        <FormGroup label="Password">
          <InputGroup
            inputRef={passwordRef}
            autoComplete="on"
            large={true}
            rightElement={
              <LockButton {...{ showPassword, toggleShowPassword }} />
            }
            type={showPassword ? "text" : "password"}
          />
        </FormGroup>
        <Button type="submit" large={true}>
          Login
        </Button>
      </form>
      <div className="user-link">
        Not a member? <Link to="/register">Register</Link>
      </div>
    </>
  );
};

export default LogIn;
