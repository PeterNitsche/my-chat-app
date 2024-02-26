# Architecture

## Objectives

The architecture has to ensure that:

- Users can receive and send messages sent by other users in real-time
- Users can receive messages which has been sent while they were offline (historical messages)
- The chat component can be reused in Organizer and Participation Frontend

## Components

The following components take part in chat messaging.

![Component Diagram](chat-component.png)

The **chat component** is a reusable npm package embedded into the organizer and participation frontend.

The **chat database** service persists all chat related entities (e.g. messages) and provides a REST endpoint to manage them.

The **chat messaging service** is responsible to distribute received messages to other clients and the **chat database**.

## Messaging flow

The following execution sequence shows the end-to-end lifecycle of the chat component.

![Sequence Diagram](chat-sequence.png)

Before the user can start sending messages, all previous messages sent by other users during his/her absence need to be retrieved from the database service.

All newly sent messages will be distributed using a Websocket connection. When the user closes the chat, the websocket connection should be closed.

### Case: Interrupted websocket connection

In order to send messages, the user needs to have a stable websocket connection to the messaging service. The connection can break for multiple reasons like wifi issues, unresponsive servers or troubles with the internet provider.

Thus, the client library used to establish the connection, should notice a broken connection quickly and needs to provide a retry mechanism to establish the connection as soon as possible.

If the client notices a connection loss, the user should not try to send new messages by disabling the chat UI.

After the connection has been reestablished, the UI needs to catch up on missed messages by reloading the historical messages from the database. Afterwards, the UI can be enabled again for the user.

The following sequence diagram illustrates the procedure.

![Sequence Diagram connection loss](chat-sequence-error-loss.png)

## Risk assessment

### Connection quality

**Impact**: Medium **Likelihood**: High

The chat is disabled if the websocket connection breaks which decreases the usability. Also, slow connections might result in a mixed message order in the chat history.

**Mitigation**: A queueing mechanic can be implemented which collects all messages on the client side if the connection is closed. Once the connection is opened again, the queued messages can be send to the messaging service.

Additionally, a timestamp should be introduced to each message object to sort an asynchronously received message into the linear message history.

### Data protection

**Impact**: High **Likelihood**: Medium

Sensitive data might be shared within chat messages and can potentially be compromised.

**Mitigation**: Modern security standards should be applied to the application (content security policy, HTTPs, message encryption, authentication, usage of modern frameworks avoiding cross-site scripting). Specific measures should be discussed in the team and a security expert.

Also, it should be discussed to use a third-party provider for the chat functionality (e.g. Sendbird) which is specialized in providing secure chat features.

### Server load

**Impact**: High **Likelihood**: Low

Having 10.000 active users using the chat in parallel, results in 10.000 open websocket connection. This high load can slow down the response time or even crash the messaging service.

**Mitigation**:

Usual backend techniques like load balancing should be introduced

As alternative, it can be considered to use a peer-to-peer architecture in which each chat client sends messages to other clients directly. The messaging backend would be only responsible to persist the messages in the database without the need to respond in real-time.

Also, it should be discussed to use a third-party provider for the chat functionality (e.g. Sendbird) which is experienced in handling the usual loads produced by a chat feature.

### Chat version inconsistency

**Impact**: Medium **Likelihood**: Low

When the chat component is maintained as separate npm package with own semantic versioning, both frontends might use different versions of the chat component on production which leads to an inconsistent communication between the clients.

**Mitigation**:

Risk can be reduced by:

- using a mono-repository
- using micro-frontends
- communicating closely between the teams / team members.

### Chat UI inconsistency

**Impact**: Low **Likelihood**: Low

When the chat component and the two frontends are implemented independently from each other in different teams, the UI appearance can deviate.

**Mitigation**: Use a single component library for all frontends.

## POC

The proof of concept is implemented in [this repository](https://github.com/PeterNitsche/my-chat-app). It focuses mainly on the feasibility of the messaging flow. Usual frontend aspects like usability and responsiveness are not considered in the POC since they don't need to be proven.
