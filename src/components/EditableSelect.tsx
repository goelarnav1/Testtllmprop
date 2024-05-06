import React, { useState, useRef, useEffect } from "react";

interface EditableSelectProps {
  label: string;
  value: string;
  options: Array<{ value: string; label: string }>;
  name: string;
  isEditing: boolean;
  onSelectChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  setIsEditing: (isEditing: boolean) => void;
  onClick?: () => void;
}

export const EditableSelect: React.FC<EditableSelectProps> = ({
  label,
  value,
  options,
  name,
  isEditing,
  onSelectChange,
  setIsEditing,
  onClick,
}) => {
  const ref = useRef<HTMLSelectElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current !== null) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <div className="mt-2">
      <strong className="text-gray-600">{label}</strong>
      <br />
      {isEditing ? (
        <select
          ref={ref}
          name={name}
          value={value}
          onChange={onSelectChange}
          className="text-gray-900 w-full rounded border p-1 my-1 max-w-96"
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      ) : (
        <p
          className="text-gray-600 cursor-pointer"
          onClick={() => {
            if (timeoutRef.current !== null) {
              clearTimeout(timeoutRef.current);
            }
            timeoutRef.current = setTimeout(() => {
              if (onClick) {
                onClick();
              }
            }, 200);
          }}
          onDoubleClick={() => {
            if (timeoutRef.current !== null) {
              clearTimeout(timeoutRef.current);
            }
            setIsEditing(true);
            setTimeout(() => {
              ref.current?.focus();
            }, 0);
          }}
        >
          {options.find((o) => o.value === value)?.label || value}
        </p>
      )}
    </div>
  );
};
