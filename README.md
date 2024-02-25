# Chat POC

This chat POC showcases a basic chat component used in two different frontends (organizer & participation).
The repo has been initialized using the vite template "react-ts".

## Scope

The POC has the goal to proof the architectural design of a chat component. UI design, responsiveness, etc. are not considered in this POC.

## Start

Run `yarn install` and `yarn start` locally.
It starts the frontend, a database to store the messages and a websocket server to distribute new messages in real-time.

## Usage

Open `http://localhost:5173/` in the browser to simulate the organizer frontend.
Open `http://localhost:5173/participation` in the browser to simulate the participation frontend.

You'll see a lean frontend with messages sent in the past.
Click on the button `Send random message` to send a new message to the server.
They are shown to each active client in real-time.

Click on the button `Close websocket` to simulate an interrupted connection to the chat server. It will stay closed for a few seconds until the websocket client reopens the connection. In the meantime, you can send a message with another client which will appear immediately after the connection is reopened again.
