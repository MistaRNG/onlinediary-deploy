import "./LogoutButton.css";
import { Button } from "@blueprintjs/core";
import { logout } from "./authSlice";
import { useDispatch } from "react-redux";
import useCurrentUser from "common/hooks/useCurrentUser";
import { AppDispatch } from "../../app/store";
import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

const LogoutButton: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { username } = useCurrentUser();

  const [isPasswordInputVisible, setIsPasswordInputVisible] = useState(false);

  const clickHandler = () => dispatch(logout());

  const goToPublicJournals = () => {
    navigate("/public-journals");
  };

  useEffect(() => {
    const checkPasswordInput = () => {
      const passwordInputVisible = !!document.querySelector('input[type="password"]');
      setIsPasswordInputVisible(passwordInputVisible);
    };

    checkPasswordInput();

    const observer = new MutationObserver(checkPasswordInput);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="Logout-Button">
      {!isPasswordInputVisible && location.pathname !== "/public-journals" && (
        <Button onClick={goToPublicJournals} icon="people">
          Entries from others
        </Button>
      )}
      <Button>Logged in as @{username}</Button>
      <Button icon="log-out" onClick={clickHandler} />
    </div>
  );
};

export default LogoutButton;
