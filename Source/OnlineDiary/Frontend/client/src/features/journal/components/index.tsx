import "./Journal.css";
import LogoutButton from "features/auth/LogoutButton";
import { useParams, useNavigate } from "react-router-dom";
import useJournal from "common/hooks/useJournal";
import Loading from "features/loading/Loading";
import Main from "./Main";
import { Button } from "@blueprintjs/core";

const Journal: React.FC = () => {
  const { date } = useParams<{ date: string }>();
  const navigate = useNavigate();

  const { validDate, disabledDays, minDate, value, gotData, css, dates } =
    useJournal(date);

  const goToPublicJournals = () => {
    navigate("/public-journals");
  };

  return (
    <>
      <style>{css}</style>
      <div className="journal-header">
        <Button onClick={goToPublicJournals} icon="people" minimal={true}>
          Entries from others
        </Button>
        <LogoutButton />
      </div>
      {gotData && validDate ? (
        <Main {...{ disabledDays, minDate, value, date, dates }} />
      ) : (
        <Loading />
      )}
    </>
  );
};

export default Journal;
