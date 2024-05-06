import { Case } from "@/types/case";
import clsx from "clsx";
import React from "react";

interface CaseListProps {
  cases: Case[];
  onSelectCase: (caseItem: Case) => void;
  selectedCaseId?: string;
}

const CaseList: React.FC<CaseListProps> = ({
  cases,
  selectedCaseId,
  onSelectCase,
}) => {
  cases = [...cases];

  // sort cases by reason
  cases.sort((a, b) => {
    return a.reason.localeCompare(b.reason);
  });
  return (
    <div className="flex flex-col mt-2">
      {cases.map((caseItem, index) => (
        <React.Fragment key={caseItem.id}>
          <div
            className={clsx(
              "flex items-center p-3 cursor-pointer",
              selectedCaseId === caseItem.id
                ? "ring-2 ring-blue-500 ring-inset bg-blue-100 rounded-lg"
                : "hover:bg-gray-200"
            )}
            onClick={() => {
              onSelectCase(caseItem);
            }}
          >
            <div>
              <div className="font-medium">{caseItem.reason}</div>
            </div>
          </div>
          {index < cases.length - 1 && <hr className="" />}
        </React.Fragment>
      ))}
    </div>
  );
};

export default CaseList;
