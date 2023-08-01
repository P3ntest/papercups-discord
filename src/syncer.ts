import { prisma } from "./prisma";
import { Conversation, Papercups } from "./papercups";
import { discordClient, getForumChannel } from "./discord";
import { requestString } from "@p3ntest/smartvars";

export async function syncConversations() {
  const conversations = await Papercups.getAllConversations();

  const createdConversations = await prisma.conversation.findMany({
    select: {
      id: true,
    },
  });

  const deltaConversations = conversations.filter(
    (c) => !createdConversations.some((cc) => cc.id === c.id)
  );

  console.log(`Found ${deltaConversations.length} new conversations`);

  for (const conversation of deltaConversations) {
    await createConversation(conversation);
  }
}

async function createConversation(conversation: Conversation) {
  const channel = await getForumChannel();

  const post = channel.threads.create({
    name: conversation.customer.name,
    message: { content: conversation.messages[0].body },
  });
}
