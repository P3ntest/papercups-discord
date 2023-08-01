import { Client, Events, ForumChannel, GatewayIntentBits } from "discord.js";
import { requestString } from "@p3ntest/smartvars";

export const discordClient = new Client({
  intents: [GatewayIntentBits.Guilds],
});

export async function login() {
  if (loggedIn) {
    return;
  }
  await discordClient.login(requestString("discord token"));
}

let loggedIn = false;
discordClient.once(Events.ClientReady, (c) => {
  console.log(`Ready! Logged in as ${c.user.tag}`);
  loggedIn = true;
});

let fetchedForumChannel = false;
export async function getForumChannel(): Promise<ForumChannel> {
  if (fetchedForumChannel) {
    return discordClient.channels.cache.get(
      requestString("discord channel id")
    )! as ForumChannel;
  }
  const channel = await discordClient.channels.fetch(
    requestString("discord channel id")
  );

  if (channel && channel instanceof ForumChannel) {
    fetchedForumChannel = true;
    return channel;
  }

  throw new Error("Invalid discord channel");
}
