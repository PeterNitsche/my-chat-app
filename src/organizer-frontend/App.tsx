import "./App.css";

import useWebSocket, { ReadyState } from "react-use-websocket";

const socketUrl = "ws://localhost:8080";

const connectionStates = {
  [ReadyState.CONNECTING]: "Connecting",
  [ReadyState.OPEN]: "Open",
  [ReadyState.CLOSING]: "Closing",
  [ReadyState.CLOSED]: "Closed",
  [ReadyState.UNINSTANTIATED]: "Uninstantiated",
};

function App() {
  const { sendMessage, readyState } = useWebSocket(socketUrl, {
    onOpen: () => console.log("opened"),
    shouldReconnect: () => true,
  });

  const onSendClick = () => {
    const randomMessage = (Math.random() + 1).toString(36).substring(7);
    sendMessage(randomMessage);
  };

  return (
    <>
      <h1>Organizer</h1>
      <p>Connection status: {connectionStates[readyState]}</p>
      <br />
      <button onClick={onSendClick}>Send random message</button>
    </>
  );
}

export default App;
