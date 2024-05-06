import React from "react";

interface EditableNameFieldsProps {
  isEditing: boolean;
  value: string;
  handleInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  setIsEditing: (isEditing: boolean) => void;
}

export const EditableNameField: React.FC<EditableNameFieldsProps> = ({
  isEditing,
  value,
  handleInputChange,
  setIsEditing,
}) => {
  const ref = React.useRef<HTMLInputElement>(null);
  return isEditing ? (
    <input
      ref={ref}
      type="text"
      name="name"
      value={value}
      onChange={handleInputChange}
      className="text-2xl font-bold text-gray-900 w-full rounded p-1 border max-w-96"
      autoFocus
    />
  ) : (
    <h2
      className="text-2xl font-bold text-gray-900 cursor-pointer"
      onDoubleClick={() => {
        setIsEditing(true);
        ref.current?.focus();
        setTimeout(() => {
          ref.current?.setSelectionRange(0, ref.current.value.length);
        }, 0);
      }}
    >
      {value}
    </h2>
  );
};
