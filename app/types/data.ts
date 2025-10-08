import type { Timestamp } from "firebase/firestore";

export type MenuByDate = {
  id?: string; // from db tool
  dateString: string; // should be ISO date string yyyy-MM-dd
  date: Timestamp; // timestamp
  menu?: {
    emoji?: string | null;
    summary: string;
    content: string;
  };
  chatMessages: {
    role: "user" | "assistant";
    content: string;
  }[];
};
