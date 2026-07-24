import { useState } from "react";
import { Alert, Card, EmptyState, Skeleton, StatusBadge } from "../../components/ui";
import {
  patientConversations,
  type PatientConversationFixture,
  type PatientPageState,
} from "../../lib/patientFixtures";

function ConversationButton({
  conversation,
  isSelected,
  onSelect,
}: {
  conversation: PatientConversationFixture;
  isSelected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      aria-pressed={isSelected}
      className="patient-message-list__item"
      onClick={onSelect}
      type="button"
    >
      <span className="patient-message-list__topline">
        <strong>{conversation.subject}</strong>
        <time dateTime={conversation.updatedAtDateTime}>{conversation.updatedAt}</time>
      </span>
      <span className="patient-page__meta">{conversation.participant}</span>
      <span>{conversation.latestPreview}</span>
      {conversation.unread ? (
        <StatusBadge tone="information">Unread</StatusBadge>
      ) : null}
    </button>
  );
}

export function PatientMessagesPage({ state = "ready" }: { state?: PatientPageState }) {
  const conversations = state === "empty" ? [] : patientConversations;
  const [selectedConversationId, setSelectedConversationId] = useState(conversations[0]?.id ?? "");
  const selectedConversation = (
    conversations.find((conversation) => conversation.id === selectedConversationId)
    ?? conversations[0]
  );

  if (state === "loading") {
    return (
      <section className="patient-page" aria-label="Messages loading">
        <Skeleton type="card" />
        <Skeleton type="card" />
      </section>
    );
  }

  if (state === "error") {
    return (
      <Alert
        description="Messages could not be loaded from the fixture source."
        role="alert"
        title="Messages Could Not Load"
        tone="danger"
      />
    );
  }

  if (state === "permission") {
    return (
      <Alert
        description="This fictional patient account does not have access to the requested messages."
        role="alert"
        title="Permission Needed"
        tone="danger"
      />
    );
  }

  return (
    <section className="patient-page" aria-labelledby="patient-messages-title">
      <div className="patient-page__heading">
        <div>
          <p className="patient-page__kicker">Messages</p>
          <h2 id="patient-messages-title">Read-Only Message Center</h2>
          <p>
            Review fictional care team conversations. Message sending is not active in this view.
          </p>
        </div>
      </div>

      {state === "partial" ? (
        <Alert
          description="Conversation previews are available, but some delivery metadata is stale."
          role="status"
          title="Partial Data Loaded"
          tone="warning"
        />
      ) : null}

      {conversations.length === 0 ? (
        <EmptyState
          description="No message conversations have been supplied for this patient fixture."
          title="No Messages Yet"
        />
      ) : (
        <div className="patient-messages">
          <Card className="patient-message-list">
            <h2>Conversations</h2>
            <ul>
              {conversations.map((conversation) => (
                <li key={conversation.id}>
                  <ConversationButton
                    conversation={conversation}
                    isSelected={conversation.id === selectedConversation?.id}
                    onSelect={() => setSelectedConversationId(conversation.id)}
                  />
                </li>
              ))}
            </ul>
          </Card>

          <Card className="patient-message-thread">
            <div className="patient-message-thread__header">
              <div>
                <p className="patient-page__kicker">{selectedConversation.participant}</p>
                <h2>{selectedConversation.subject}</h2>
              </div>
              {selectedConversation.unread ? (
                <StatusBadge tone="information">Unread</StatusBadge>
              ) : null}
            </div>
            <div className="patient-message-thread__messages" aria-label="Conversation messages">
              {selectedConversation.messages.map((message) => (
                <article className="patient-message" key={message.id}>
                  <div className="patient-message__meta">
                    <strong>{message.sender}</strong>
                    <time dateTime={message.dateTime}>{message.timestamp}</time>
                  </div>
                  <p>{message.body}</p>
                </article>
              ))}
            </div>
            <Alert
              description="Reply controls, attachments, notifications, and real-time delivery are outside this read-only view."
              role="note"
              title="Message Sending Not Available"
              tone="info"
            />
          </Card>
        </div>
      )}
    </section>
  );
}
