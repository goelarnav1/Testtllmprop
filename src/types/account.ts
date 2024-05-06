export interface Account {
  id: string;
  name: string;
  tier: "Basic" | "Silver" | "Gold" | "Platinum";
}
