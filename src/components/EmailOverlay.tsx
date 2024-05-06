import { Case } from "@/types/case";
import { Email } from "@/types/email";
import { CopilotTextarea } from "@copilotkit/react-textarea";
import React, { useState } from "react";

interface EmailOverlayProps {
  onSend: (email: Email) => void;
  onCancel: () => void;
  updateEmail: (email: Email) => void;
  email: Email;
  caseItem: Case;
}

export const EmailOverlay = ({
  email,
  onSend,
  onCancel,
  updateEmail,
  caseItem,
}: EmailOverlayProps) => {
  return (
    <div className="fixed bottom-0 left-64 m-4 max-w-sm w-full bg-white shadow-lg border rounded-lg">
      <div className="p-4">
        <input
          type="text"
          placeholder="To"
          value={email.receiver}
          onChange={(e) => {
            updateEmail({ ...email, receiver: e.target.value });
          }}
          className="w-full p-2 mb-2 border rounded text-sm"
        />
        <input
          type="text"
          placeholder="Subject"
          value={email.subject}
          onChange={(e) => {
            updateEmail({ ...email, subject: e.target.value });
          }}
          className="w-full p-2 mb-2 border rounded text-sm"
        />
        <CopilotTextarea
          // placeholder="Body"
          value={email.body}
          onChange={(e) => {
            updateEmail({ ...email, body: e.target.value });
          }}
          className="w-full p-2 border rounded resize-none text-sm h-96"
          rows={10}
          autosuggestionsConfig={{
            textareaPurpose:
              "An email about this case: " + JSON.stringify(caseItem),
            chatApiConfigs: {
              suggestionsApiConfig: {
                forwardedParams: {
                  max_tokens: 5,
                  stop: ["\n", ".", ","],
                },
              },
              insertionApiConfig: {},
            },
          }}
        ></CopilotTextarea>
        <div className="text-right mt-4">
          <button
            className="bg-white border border-black text-black py-2 px-4 rounded mr-3"
            onClick={() => onCancel()}
          >
            Cancel
          </button>
          <button
            className="bg-black hover:bg-gray-800 text-white font-bold py-2 px-4 rounded"
            onClick={() => onSend(email)}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};
