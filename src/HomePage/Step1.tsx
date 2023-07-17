import { Dispatch, SetStateAction } from "react";
import styled from "styled-components";

const Step1 = ({
  userName,
  setUserName,
  addNewUser,
  loading,
}: {
  userName: string;
  setUserName: Dispatch<SetStateAction<string>>;
  addNewUser: () => void;
  loading: boolean;
}) => (
  <Container>
    <div className="heading-title">What's your name?</div>
    <form
      className="input-group"
      onSubmit={(e) => {
        e.preventDefault();
        addNewUser();
      }}
    >
      <input
        className="text-input"
        placeholder="Preferred user name"
        value={userName}
        onChange={(e) => setUserName(e.target.value)}
      />
      <button
        className="action-button"
        type="submit"
        disabled={loading || userName.length < 3}
      >
        Go
      </button>
    </form>
  </Container>
);

export default Step1;

const Container = styled.div`
  padding-bottom: 30px;
  margin-inline: auto;
  margin-bottom: 30px;

  max-width: 400px;
  width: 100%;

  border-bottom: 1px solid #ddd;
`;
