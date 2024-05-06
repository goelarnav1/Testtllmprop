export interface Action {
  type: "Call" | "Email" | "Meeting" | "Task";
  details: string;
}
