import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getTodayDate } from "common/helpers";
import Loading from "../loading/Loading";
import useCurrentUser from "common/hooks/useCurrentUser";

const Redirect: React.FC = () => {
  const navigate = useNavigate();
  const { username } = useCurrentUser();

  useEffect(() => {
    if (username) {
      const url = `/journal/${getTodayDate()}`;
      navigate(url);
    } else {
      navigate("/login");
    }
  }, [username, navigate]);

  return <Loading />;
};

export default Redirect;
