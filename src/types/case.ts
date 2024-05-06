import { User } from "./user";
import { Account } from "./account";
import { Action } from "./action";

export interface Case {
  id: string;
  owner: User;
  phone: string; // Done
  email: string; // Done
  name: string;
  account: Account;
  status: "Open" | "Closed" | "Pending" | "Escalated";
  priority: "Low" | "Medium" | "High";
  type: "Problem" | "Incident" | "Question" | "Request";
  origin: "Email" | "Phone" | "Chat" | "Portal";
  reason: string; // Done
  notes: string; // Done
  actions: Action[];
}
