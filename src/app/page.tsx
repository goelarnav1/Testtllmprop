"use client";

import "@copilotkit/react-ui/styles.css";
import "@copilotkit/react-textarea/styles.css";

import { CaseDetail } from "@/components/CaseDetail";
import CaseList from "@/components/CaseList";
import { dummyCases } from "@/dummyData";
import { Case } from "@/types/case";
import { CopilotKit, useMakeCopilotReadable } from "@copilotkit/react-core";
import { CopilotPopup } from "@copilotkit/react-ui";
import { useState } from "react";
import { INSTRUCTIONS } from "./instructions";

export default function Home() {
  return (
    <CopilotKit url="/api/copilotkit">
      <Main />
      <CopilotPopup
        instructions={INSTRUCTIONS}
        labels={{
          initial:
            "Hi! I'm an AI assistant. I can do things like summarize records, log actions and draft and revise emails. What can I help you with?",
        }}
        defaultOpen={true}
        clickOutsideToClose={false}
      />
    </CopilotKit>
  );
}

function Main() {
  const [cases, setCases] = useState<Case[]>(dummyCases);
  const [selectedCaseId, setSelectedCaseId] = useState<string | undefined>(
    undefined
  );

  // Find the selected case based on selectedCaseId
  const selectedCase = cases.find((caseItem) => caseItem.id === selectedCaseId);

  useMakeCopilotReadable(
    selectedCase
      ? "This is the current case: " + JSON.stringify(selectedCase)
      : "No case selected"
  );

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <div className="bg-gray-800 text-white p-4">
        <h1>CopilotKit 🪁 - CRM App</h1>
      </div>

      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left-hand Side Area: List of Cases */}
        <div className="w-64 bg-gray-100 overflow-auto">
          <CaseList
            cases={cases}
            selectedCaseId={selectedCaseId}
            onSelectCase={(caseItem) => {
              setSelectedCaseId(caseItem.id);
            }}
          />
        </div>

        {/* Main Area */}
        <div className="flex-1 bg-gray-50 p-4 overflow-auto">
          {selectedCase ? (
            <CaseDetail
              caseItem={selectedCase}
              onUpdateCase={(caseItem) => {
                setCases((prevCases) =>
                  prevCases.map((c) => (c.id === caseItem.id ? caseItem : c))
                );
              }}
            />
          ) : (
            <div className="text-gray-800 text-base items-center justify-center  flex h-full">
              Please select a case
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
