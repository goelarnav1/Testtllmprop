import { Case } from "@/types/case";
import { useEffect, useState } from "react";
import { EditableNameField } from "./EditableNameFields";
import { EditableField } from "./EditableField";
import {
  CallIcon,
  CaseIcon,
  EmailIcon,
  MeetingIcon,
  TaskIcon,
  TrashIcon,
} from "./Icons";
import { EmailOverlay } from "./EmailOverlay";
import { Email } from "@/types/email";
import { Action } from "@/types/action";
import { EditableSelect } from "./EditableSelect";
import { dummyAccounts, dummyUsers } from "@/dummyData";
import { useCopilotAction } from "@copilotkit/react-core";

interface CaseDetailProps {
  caseItem: Case;
  onUpdateCase: (caseItem: Case) => void;
}

export const CaseDetail: React.FC<CaseDetailProps> = ({
  caseItem,
  onUpdateCase,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [email, setEmail] = useState<Email>({
    receiver: caseItem.email,
    subject: "",
    body: "",
  });
  const [showEmailOverlay, setShowEmailOverlay] = useState(false);
  useEffect(() => {
    setEmail({
      receiver: caseItem.email,
      subject: `(ID: ${caseItem.id})`,
      body: "",
    });
    setShowEmailOverlay(false);
    setIsEditing(false);
  }, [caseItem.email]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    onUpdateCase({ ...caseItem, [name]: value });
  };

  const handleDoneClick = () => {
    setIsEditing(false);
  };

  const [newAction, setNewAction] = useState<Action>({
    type: "Call",
    details: "",
  });

  const handleLogAction = () => {
    onUpdateCase({
      ...caseItem,
      actions: [...caseItem.actions, newAction],
    });
    setNewAction({ type: "Call", details: "" });
  };

  useCopilotAction({
    name: "updateCase",
    description: "Update the case details",
    parameters: [
      {
        name: "owner",
        type: "string",
        enum: dummyUsers.map((owner) => owner.id),
        description:
          "The id of the user who owns the case. Possible users are: " +
          JSON.stringify(dummyUsers),
        required: false,
      },
      {
        name: "phone",
        type: "string",
        description: "The phone number",
        required: false,
      },
      {
        name: "email",
        type: "string",
        description: "The email address",
        required: false,
      },
      {
        name: "name",
        type: "string",
        description: "The name of the contact that reported the case",
        required: false,
      },
      {
        name: "account",
        type: "string",
        enum: dummyAccounts.map((account) => account.id),
        description:
          "The id of the account associated with the case. Possible accounts are: " +
          JSON.stringify(dummyAccounts),
        required: false,
      },
      {
        name: "status",
        type: "string",
        enum: ["Open", "Closed", "Pending", "Escalated"],
        description: "The status of the case",
        required: false,
      },
      {
        name: "priority",
        type: "string",
        enum: ["Low", "Medium", "High"],
        description: "The priority of the case",
        required: false,
      },
      {
        name: "type",
        type: "string",
        enum: ["Problem", "Incident", "Question", "Request"],
        description: "The type of the case",
        required: false,
      },
      {
        name: "origin",
        type: "string",
        enum: ["Email", "Phone", "Chat", "Portal"],
        description: "The origin of the case",
        required: false,
      },
      {
        name: "reason",
        type: "string",
        description: "The reason for the case",
        required: false,
      },
      {
        name: "notes",
        type: "string",
        description: "The notes for the case",
        required: false,
      },
    ],
    render: "Updating case details...",
    handler: (params) => {
      const updatedCase = { ...caseItem };
      for (const key in params) {
        if ((params as any)[key]) {
          if (key === "owner") {
            const owner = dummyUsers.find((u) => u.id === params[key]);
            if (owner) {
              updatedCase.owner = owner;
            }
          } else if (key === "account") {
            const account = dummyAccounts.find((a) => a.id === params[key]);
            if (account) {
              updatedCase.account = account;
            }
          } else {
            (updatedCase as any)[key] = (params as any)[key];
          }
        }
      }
      onUpdateCase(updatedCase);
    },
  });

  useCopilotAction({
    name: "logActions",
    description: "Log actions",
    parameters: [
      {
        name: "actions",
        type: "object[]",
        attributes: [
          {
            name: "type",
            type: "string",
            enum: ["Call", "Email", "Meeting", "Task"],
          },
          {
            name: "details",
            type: "string",
          },
        ],
      },
    ],
    handler: ({ actions }) => {
      onUpdateCase({
        ...caseItem,
        actions: [...caseItem.actions, ...actions],
      });
    },
  });

  useCopilotAction({
    name: "draftEmail",
    description:
      "Draft an email to the main contact of the account (the name property in the case)",
    parameters: [
      {
        name: "subject",
      },
      {
        name: "body",
      },
    ],
    handler: ({ subject, body }) => {
      setEmail({ receiver: caseItem.email, subject, body });
      setShowEmailOverlay(true);
    },
  });

  return (
    <div className="p-6">
      {showEmailOverlay && (
        <EmailOverlay
          email={email}
          caseItem={caseItem}
          onSend={() => {
            setShowEmailOverlay(false);
            onUpdateCase({
              ...caseItem,
              actions: [
                ...caseItem.actions,
                {
                  type: "Email",
                  details: `Subject: ${email.subject} Body: ${email.body}`,
                },
              ],
            });
          }}
          onCancel={() => {
            setShowEmailOverlay(false);
          }}
          updateEmail={setEmail}
        />
      )}
      <div className="flex items-start space-x-6">
        <div className="flex-1">
          <div className="flex items-center bg-slate-200 p-5">
            <div className="flex-grow-0 mr-2 text-pink-700">{CaseIcon}</div>
            <div className="flex-grow">
              <EditableNameField
                isEditing={isEditing}
                value={caseItem.reason}
                handleInputChange={handleInputChange}
                setIsEditing={setIsEditing}
              />
            </div>
            <div className="flex justify-end">
              {isEditing ? (
                <button
                  onClick={handleDoneClick}
                  className="bg-black hover:bg-gray-800 text-sm text-white font-medium py-2 px-4 rounded"
                >
                  Done
                </button>
              ) : (
                <button
                  onClick={() => setIsEditing(true)}
                  className="bg-black hover:bg-gray-800 text-sm text-white font-medium py-2 px-4 rounded"
                >
                  Edit case
                </button>
              )}
            </div>
          </div>
          <div className="mt-6 w-[600px] gap-y-10 flex flex-col">
            <div className="bg-slate-400 p-2 rounded-sm text-white">
              Case Information
            </div>
            <div className="flex flex-row gap-10">
              <div className="w-1/2">
                <EditableSelect
                  label="Case Owner"
                  value={caseItem.owner.id}
                  options={dummyUsers.map((owner) => ({
                    value: owner.id,
                    label: owner.name,
                  }))}
                  name="owner"
                  isEditing={isEditing}
                  onSelectChange={(e) => {
                    const owner = dummyUsers.find(
                      (u) => u.id === e.target.value
                    );
                    if (owner) {
                      onUpdateCase({ ...caseItem, owner });
                    }
                  }}
                  setIsEditing={setIsEditing}
                />
              </div>
              <div className="w-1/2">
                <EditableField
                  label="Contact Phone"
                  value={caseItem.phone}
                  name="phone"
                  isEditing={isEditing}
                  onInputChange={handleInputChange}
                  setIsEditing={setIsEditing}
                />
              </div>
            </div>
            <div className="flex flex-row gap-10">
              <div className="w-1/2">
                <div className="mt-2">
                  <strong className="text-gray-600">Case Number</strong>
                  <br />
                  <p className="text-gray-600">{caseItem.id}</p>
                </div>
              </div>
              <div className="w-1/2">
                <EditableField
                  label="Email"
                  value={caseItem.email}
                  name="email"
                  isEditing={isEditing}
                  onInputChange={handleInputChange}
                  setIsEditing={setIsEditing}
                  onClick={() => setShowEmailOverlay(true)}
                />
              </div>
            </div>
            <div className="flex flex-row gap-10">
              <div className="w-1/2">
                <EditableField
                  label="Contact Name"
                  value={caseItem.name}
                  name="name"
                  isEditing={isEditing}
                  onInputChange={handleInputChange}
                  setIsEditing={setIsEditing}
                />
              </div>
              <div className="w-1/2">
                <EditableSelect
                  label="Account Name"
                  value={caseItem.account.id}
                  name="account"
                  options={dummyAccounts.map((account) => ({
                    value: account.id,
                    label: account.name,
                  }))}
                  isEditing={isEditing}
                  onSelectChange={(e) => {
                    const account = dummyAccounts.find(
                      (a) => a.id === e.target.value
                    );
                    if (account) {
                      onUpdateCase({ ...caseItem, account });
                    }
                  }}
                  setIsEditing={setIsEditing}
                />
              </div>
            </div>
            <div className="bg-slate-400 p-2 rounded-sm text-white">
              Additional Information
            </div>
            <div className="flex flex-row gap-10">
              <div className="w-1/2">
                <EditableSelect
                  label="Status"
                  value={caseItem.status}
                  options={[
                    { value: "Open", label: "Open" },
                    { value: "Closed", label: "Closed" },
                    { value: "Pending", label: "Pending" },
                    { value: "Escalated", label: "Escalated" },
                  ]}
                  name="status"
                  isEditing={isEditing}
                  onSelectChange={(e) => {
                    onUpdateCase({
                      ...caseItem,
                      status: e.target.value as Case["status"],
                    });
                  }}
                  setIsEditing={setIsEditing}
                />
              </div>
              <div className="w-1/2">
                <EditableSelect
                  label="Type"
                  value={caseItem.type}
                  options={[
                    { value: "Problem", label: "Problem" },
                    { value: "Incident", label: "Incident" },
                    { value: "Question", label: "Question" },
                    { value: "Request", label: "Request" },
                  ]}
                  name="type"
                  isEditing={isEditing}
                  onSelectChange={(e) => {
                    onUpdateCase({
                      ...caseItem,
                      type: e.target.value as Case["type"],
                    });
                  }}
                  setIsEditing={setIsEditing}
                />
              </div>
            </div>
            <div className="flex flex-row gap-10">
              <div className="w-1/2">
                <EditableSelect
                  label="Priority"
                  value={caseItem.priority}
                  options={[
                    { value: "Low", label: "Low" },
                    { value: "Medium", label: "Medium" },
                    { value: "High", label: "High" },
                  ]}
                  name="priority"
                  isEditing={isEditing}
                  onSelectChange={(e) => {
                    onUpdateCase({
                      ...caseItem,
                      priority: e.target.value as Case["priority"],
                    });
                  }}
                  setIsEditing={setIsEditing}
                />
              </div>
              <div className="w-1/2">
                <EditableSelect
                  label="Origin"
                  value={caseItem.origin}
                  options={[
                    { value: "Email", label: "Email" },
                    { value: "Phone", label: "Phone" },
                    { value: "Chat", label: "Chat" },
                    { value: "Portal", label: "Portal" },
                  ]}
                  name="origin"
                  isEditing={isEditing}
                  onSelectChange={(e) => {
                    onUpdateCase({
                      ...caseItem,
                      origin: e.target.value as Case["origin"],
                    });
                  }}
                  setIsEditing={setIsEditing}
                />
              </div>
            </div>
            <div className="flex flex-row gap-10">
              <div className="w-1/2">
                <EditableField
                  label="Reason"
                  value={caseItem.reason}
                  name="reason"
                  isEditing={isEditing}
                  onInputChange={handleInputChange}
                  setIsEditing={setIsEditing}
                />
              </div>
              <div className="w-1/2">
                <EditableField
                  label="Notes"
                  value={caseItem.notes}
                  name="notes"
                  isEditing={isEditing}
                  onInputChange={handleInputChange}
                  setIsEditing={setIsEditing}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-6 border-t border-gray-200 pt-6">
        <div className="bg-slate-400 p-2 rounded-sm text-white w-[600px] mb-10">
          Actions
        </div>
        {caseItem.actions.length > 0 ? (
          caseItem.actions.map((action, index) => (
            <div key={index} className="mt-2 text-sm items-center flex group">
              <div className={`font-semibold w-7 inline-block`}>
                {iconForTodoType(action.type)}
              </div>
              <div>{action.details}</div>
              <div
                className="text-red-500 ml-2 cursor-pointer hidden group-hover:inline-block"
                onClick={() => {
                  onUpdateCase({
                    ...caseItem,
                    actions: caseItem.actions.filter((t, i) => i !== index),
                  });
                }}
              >
                {TrashIcon}
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-600 mt-2">No actions available.</p>
        )}
      </div>
      <div className="flex mt-10">
        <select
          value={newAction.type}
          onChange={(e) =>
            setNewAction({
              ...newAction,
              type: e.target.value as Action["type"],
            })
          }
          className="mr-2 p-0.5 border rounded text-xs"
        >
          <option value="Call">Call</option>
          <option value="Meeting">Meeting</option>
          <option value="Task">Task</option>
          <option value="Email">Email</option>
        </select>
        <input
          type="text"
          value={newAction.details}
          onChange={(e) =>
            setNewAction({ ...newAction, details: e.target.value })
          }
          placeholder="Log Action"
          className="mr-2 p-1 border rounded text-xs"
        />
        <button
          onClick={handleLogAction}
          className="bg-black hover:bg-gray-800 text-white font-bold py-1 px-2 rounded text-sm"
        >
          Log
        </button>
      </div>
    </div>
  );
};

function iconForTodoType(type: string) {
  switch (type) {
    case "Call":
      return CallIcon;
    case "Email":
      return EmailIcon;
    case "Meeting":
      return MeetingIcon;
    case "Task":
      return TaskIcon;
  }
  return null;
}
