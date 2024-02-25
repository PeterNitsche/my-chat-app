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
  const { lastMessage, sendMessage, readyState } = useWebSocket(socketUrl, {
    onOpen: () => console.log("opened"),
    shouldReconnect: () => true,
  });

  // loading of initial messages should be done via REST endpoint calls (out of scope for POC)
  const [messageHistory, setMessageHistory] = useState<MessageEvent[]>([]);

  useEffect(() => {
    if (lastMessage !== null) {
      setMessageHistory((prev) => prev.concat(lastMessage));
    }
  }, [lastMessage, setMessageHistory]);

  const onSendClick = () => {
    const randomMessage = (Math.random() + 1).toString(36).substring(2);
    sendMessage(randomMessage);
  };

  return (
    <>
      <p>Connection status: {connectionStates[readyState]}</p>

      <br />
      <button onClick={onSendClick} disabled={readyState !== ReadyState.OPEN}>
        Send random message
      </button>
      <h2>Messages</h2>
      {messageHistory.map((message, idx) => {
        return <p key={idx}>{message.data}</p>;
      })}
      <br />
    </>
  );
}

export default Chat;
