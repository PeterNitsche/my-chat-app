import "./App.css";

import useWebSocket from "react-use-websocket";

const socketUrl = "ws://localhost:8080";

function App() {
  const { sendMessage } = useWebSocket(socketUrl, {
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
      <br />
      <button onClick={onSendClick}>Send random message</button>
    </>
  );
}

export default App;
