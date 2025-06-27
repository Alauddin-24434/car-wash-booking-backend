import { Types } from "mongoose"

export interface ISlot {
  id?: Types.ObjectId | string

  date: string          // e.g. "2025-06-25" (ISO format date)
  startTime: string     // e.g. "10:00 AM" - slot শুরু সময়
  endTime: string       // e.g. "11:00 AM" - slot শেষ সময়
  duration: number      // in minutes, (optional but handy)
  status: "available" | "full" | "blocked"
 
  serviceId: Types.ObjectId  // Reference to Service collection
}


export interface ISlotQueryParams {
  availability?: boolean;  // true হলে শুধু যেগুলোতে available > 0 সেগুলো দেখাবে
  date?: string;           // "YYYY-MM-DD" ফরম্যাটে নির্দিষ্ট দিন অনুযায়ী ফিল্টার
  serviceId?: string;      // সার্ভিস আইডি দিয়ে ফিল্টার
  status?: "available" | "full" | "blocked";  // স্ট্যাটাস অনুযায়ী ফিল্টার
  searchTerm?: string;     // যদি তোমার slot এ সার্চ করার মতো কোন ফিল্ড থাকে (optional)
  sort?: string;           // কোন ফিল্ড দিয়ে sorting করবে (e.g. "date", "startTime")
  limit?: number;          // pagination এর জন্য limit (প্রতি পেজ কয়টি)
  page?: number;           // pagination এর জন্য page নম্বর
}
