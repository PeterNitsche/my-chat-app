import { useEffect, useState } from "react";

import useWebSocket, { ReadyState } from "react-use-websocket";

const socketUrl = "ws://localhost:8080";

const connectionStates = {
  [ReadyState.CONNECTING]: "Connecting",
  [ReadyState.OPEN]: "Open",
  [ReadyState.CLOSING]: "Closing",
  [ReadyState.CLOSED]: "Closed",
  [ReadyState.UNINSTANTIATED]: "Uninstantiated",
};

function Chat() {
  const [messageHistory, setMessageHistory] = useState<string[]>([]);

  //loading of new messages in real-time using websocket
  const { lastMessage, sendMessage, readyState, getWebSocket } = useWebSocket(
    socketUrl,
    {
      onOpen: () => console.log("opened"),
      shouldReconnect: () => true,
    }
  );

  useEffect(() => {
    if (lastMessage !== null) {
      setMessageHistory((prev) => prev.concat(lastMessage.data));
    }
  }, [lastMessage, setMessageHistory]);

  //initial loading of old messages whenever websocket is opened using REST
  useEffect(() => {
    if (readyState !== ReadyState.OPEN) {
      return;
    }

    fetch("http://localhost:3000/messages")
      .then((response) => response.json())
      .then((data) => data.map((msg: { data: string }) => msg.data))
      .then(setMessageHistory)
      .catch(console.error);
  }, [readyState, setMessageHistory]);

  const onSendClick = () => {
    const randomMessage = (Math.random() + 1).toString(36).substring(2);
    sendMessage(randomMessage);
  };

  const onCloseWebsocketClick = () => {
    getWebSocket()?.close();
  };

  return (
    <>
      <p>Connection status: {connectionStates[readyState]}</p>
      <button
        onClick={onCloseWebsocketClick}
        disabled={readyState !== ReadyState.OPEN}
      >
        Close websocket
      </button>
      <br />
      <button onClick={onSendClick} disabled={readyState !== ReadyState.OPEN}>
        Send random message
      </button>
      <h2>Messages</h2>
      {messageHistory.map((message, idx) => {
        return <p key={idx}>{message}</p>;
      })}
      <br />
    </>
  );
}

export default Chat;
