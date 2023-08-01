import axios from "axios";
import { requestString } from "@p3ntest/smartvars";
import { z } from "zod";

export const papercupsInstance = axios.create({
  baseURL: new URL("api/v1", requestString("papercups base url")).href,
  headers: {
    Authorization: `Bearer ${requestString("papercups key")}`,
  },
});

export const Papercups = {
  async getAllConversations() {
    const { data } = await papercupsInstance.get("/conversations");
    return z.array(Conversation).parse(data.data);
  },
};

const Customer = z.object({
  id: z.string(),
  object: z.literal("customer"),
  email: z.string(),
  external_id: z.string(),
  name: z.string(),
});

const Message = z.object({
  id: z.string(),
  object: z.literal("message"),
  body: z.string(),
});

const Conversation = z.object({
  id: z.string(),
  object: z.literal("conversation"),
  status: z.enum(["open", "closed"]),
  messages: z.array(Message),
  customer: Customer,
});

export type Conversation = z.infer<typeof Conversation>;
