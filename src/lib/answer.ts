export interface Answer {
  isError: boolean;
  role: "assistant" | "user";
  message: string;
}
