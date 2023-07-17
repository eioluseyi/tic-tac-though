import { SetStateAction, useEffect, useRef, useState } from "react";
import styled from "styled-components";
import io from "socket.io-client";
import router from "next/router";
import Step1 from "src/HomePage/Step1";
import Step2 from "src/HomePage/Step2";
import { initialUserState } from "variables/client";
import { toast } from "react-toastify";
import { GameSessionType, UserType } from "types/common";
let socket: ReturnType<typeof io>;

const HomePage = () => {
  const [userName, setUserName] = useState("");
  const [userState, setUserState] = useState<UserType>(initialUserState());
  const [sessionId, setSessionId] = useState("");
  const [sessionList, setSessionList] = useState<GameSessionType[]>([]);
  const [loading, setLoading] = useState(true);

  const userList = useRef<Array<{ uuid: string; name: string }>>([]);

  const socketInitializer = async () => {
    await fetch("/api/socket");
    socket = io();

    socket.on("connect", () => {
      setLoading(false);
    });

    socket.on("updated-userlist", (res: SetStateAction<any>) => {
      const getItemValue = localStorage.getItem("userState");
      const newUsers = res.filter(
        (resItem: { uuid: string }) =>
          !userList.current.find((listItem) => resItem.uuid === listItem.uuid) // && listItem.uuid !== userState.uuid
      );

      newUsers.forEach((user: { name: string }) =>
        toast(`${user.name} just joined`)
      );
      userList.current = res;

      if (!getItemValue || !res) return;

      const userExists = res.find(
        (el: { uuid: string }) => el.uuid === JSON.parse(getItemValue).uuid
      );

      if (userExists) return setUserState(JSON.parse(getItemValue));

      resetUserName();
    });

    socket.on("updated-sessionlist", (res: SetStateAction<any>) => {
      setSessionList(res);
    });
  };

  const addNewUser = () => {
    socket.emit("add-user", { userName }, (res: SetStateAction<any>) => {
      if (!res.success) return;

      if (res.data.user.uuid) {
        setUserState(res.data.user);
        localStorage.setItem("userState", JSON.stringify(res.data.user));
      }
    });
  };

  const resetUserName = () => {
    localStorage.clear();
    setUserState(initialUserState());
  };

  const createSession = () => {
    socket.emit(
      "add-session",
      { userId: userState.uuid },
      (res: SetStateAction<any>) => {
        if (res.success) router.push(`/play?id=${res.data.sessionId}`);
      }
    );
  };

  const isUserInSession = (_sessionId: string) => {
    return sessionList.filter((el) => {
      return (
        el.sessionId === _sessionId &&
        el.users.filter((_el) => _el.uuid === userState.uuid).length
      );
    }).length;
  };

  const joinSession = (_sessionId: string) => {
    if (isUserInSession(_sessionId)) {
      router.push(`/play?id=${_sessionId}`);
    }
    socket.emit(
      "join-session",
      { _sessionId, userId: userState.uuid },
      (res: SetStateAction<any>) => {
        if (res.success) router.push(`/play?id=${_sessionId}`);
      }
    );
  };

  useEffect(() => {
    socketInitializer();
  }, []);

  useEffect(() => {
    setUserName(userState.name);
  }, [userState]);

  return (
    <Container>
      <div className="app-header app-header-small">
        Tic Tac <span className="text-highlight">though</span>..
      </div>
      <div className="control-wrapper">
        {!userState.uuid && (
          <Step1
            userName={userName}
            setUserName={setUserName}
            addNewUser={addNewUser}
            loading={loading}
          />
        )}
        {userState.uuid && (
          <Step2
            userName={userState.name}
            createSession={createSession}
            joinSession={joinSession}
            sessionList={sessionList}
            sessionId={sessionId}
            setSessionId={setSessionId}
            loading={loading}
          />
        )}

        <div className="second-part">
          <div>Sessions available ({sessionList.length})</div>
          {sessionList.length ? (
            <div className="session-list">
              {sessionList
                .filter((ssn) => ssn.users.length < 2)
                .map(
                  (
                    itm: {
                      sessionId: string;
                      users: Array<{ name: string }>;
                    },
                    idx
                  ) => (
                    <button
                      className="session-item"
                      key={itm.sessionId}
                      autoFocus={idx === 0}
                      onClick={() => joinSession(itm.sessionId)}
                    >
                      <div className="session-item-content">
                        {itm.sessionId} ({itm.users[0].name})
                      </div>
                    </button>
                  )
                )}
            </div>
          ) : (
            <div>
              <h3>About this App...</h3>
            </div>
          )}
        </div>
      </div>
      <div className="footer">
        {userName.length > 0 && userState.uuid && (
          <div className="input-group">
            <span>Not {userName}? </span>
            <button className="action-button secondary" onClick={resetUserName}>
              Change Username
            </button>
          </div>
        )}
      </div>
    </Container>
  );
};

export default HomePage;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;

  overflow: hidden;

  padding: 40px 30px 20px;

  text-align: center;

  background: url(/assets/img/play-bg.webp), rgb(255 255 255 / 0.8);
  background-blend-mode: overlay;

  .control-wrapper {
    display: flex;
    flex-direction: column;
    flex: 1;
    max-width: 600px;
    margin-inline: auto;

    overflow: hidden;
  }

  .second-part {
    display: flex;
    flex-direction: column;

    /* padding-bottom: 30px; */
    margin-inline: auto;
    margin-bottom: 10px;

    max-width: 400px;
    width: 100%;

    overflow: hidden;
  }

  .footer {
    margin-block: auto 0;
    margin-inline: auto;

    max-width: 400px;
  }

  .app-header-small {
    font-size: 18px;
  }

  .heading-title {
    font-size: 42px;
    margin-block: 50px 30px;
  }

  .heading-subtitle {
    font-size: 18px;
    color: #777;
    margin-block: -20px 30px;
  }

  .spacer {
    height: 30px;
  }

  .input-group {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;

    font-size: 14px;

    margin-inline: auto;
    margin-bottom: 10px;

    & > * {
      height: 50px;
      /* width: fit-content; */
    }
    & > * + .hidden {
      margin-left: -10px !important;
    }

    & > :is(div, span) {
      display: flex;
      align-items: center;

      /* height: 100%; */
    }
  }

  .text-input {
    padding-inline: 15px;

    flex: 1;

    font-size: 14px;

    border: 1px solid #999;
    border-radius: 4px;

    box-sizing: border-box;

    &:focus {
      outline: 2px solid #4f3521;
      outline-offset: -2px;
    }
  }

  .action-button {
    padding-inline: 20px;

    font-size: 14px;
    color: #eee;
    cursor: pointer;

    max-width: 100%;
    white-space: nowrap;
    overflow: hidden;

    border: none;
    border-radius: 4px;
    background-color: #4f3521;

    transition: 0.3s ease-out;

    &:hover {
      background-color: #5f4531;
    }

    &:active {
      background-color: #3f2511;
    }

    &:disabled {
      opacity: 0.5;
      pointer-events: none;
    }

    &.secondary {
      font-weight: 600;
      color: #4f3521;

      margin-left: -5px;

      border: none;
      background-color: transparent;

      &:hover {
        background-color: #fff4df;
      }

      &:active {
        background-color: #ffeedd;
      }

      &:disabled {
        opacity: 0.5;
        pointer-events: none;
      }
    }

    &.hidden {
      max-width: 0%;
      padding-inline: 0px;

      & + * {
        margin-left: -10px;
      }
    }
  }

  .session-list {
    flex: 1;

    display: grid;
    gap: 20px;
    margin-top: 10px;
    padding: 10px;
    overflow-y: auto;

    .session-item {
      display: grid;
      place-items: center;

      padding: 0;

      height: 80px;

      border-radius: 10px;
      border: none;

      cursor: pointer;

      background-color: #fff;
      box-shadow: rgba(0, 0, 0, 0.25) 0px 0.0625em 0.0625em,
        rgba(0, 0, 0, 0.25) 0px 0.125em 0.5em,
        rgba(255, 255, 255, 0.1) 0px 0px 0px 1px inset;

      .session-item-content {
        padding-block: 23px;

        width: 100%;

        font-size: 18px;

        transition: scale 0.3s ease-out, color 0.3s ease-out,
          background-color 0.3s ease-out;
      }

      &:hover,
      &:focus-visible {
        outline: none;

        .session-item-content {
          scale: 1.05;

          color: #fff;
          border-radius: inherit;
          background-color: #4f3521;
        }
      }
    }
  }
`;
