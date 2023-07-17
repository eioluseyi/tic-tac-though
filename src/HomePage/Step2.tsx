import { Dispatch, SetStateAction } from "react";
import styled from "styled-components";
import { GameSessionType } from "types/common";

const Step2 = ({
  userName,
  createSession,
  joinSession,
  sessionId,
  setSessionId,
  loading,
}: {
  userName: string;
  createSession: () => void;
  joinSession: (val: string) => void;
  sessionList: GameSessionType[];
  sessionId: string;
  setSessionId: Dispatch<SetStateAction<string>>;
  loading: boolean;
}) => (
  <Container>
    <div className="heading-title">
      Hi, {userName}
      <i>!</i>
    </div>
    <div className="heading-subtitle">What would you like to do?</div>
    {/* <div className="spacer" /> */}
    <form
      className="input-group"
      onSubmit={(e) => {
        e.preventDefault();
        joinSession(sessionId);
      }}
    >
      <button
        type="button"
        className={`action-button ${sessionId ? "hidden" : ""}`}
        onClick={createSession}
        disabled={loading || sessionId.length > 0}
      >
        <b
          style={{
            border: "2px solid",
            borderRadius: "10px",
            paddingInline: "3.8px",
            scale: "0.8",
            display: "inline-grid",
            placeItems: "center",
          }}
        >
          +
        </b>{" "}
        New Game
      </button>
      <input
        className="text-input"
        placeholder="Enter game code"
        value={sessionId}
        onChange={(e) => setSessionId(e.target.value)}
      />
      <button
        type="submit"
        className={`action-button secondary ${!sessionId ? "hidden" : ""}`}
        disabled={loading || !sessionId}
      >
        Join
      </button>
    </form>
  </Container>
);

export default Step2;

const Container = styled.div``;
