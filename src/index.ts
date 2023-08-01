import { login } from "./discord";
import { syncConversations } from "./syncer";

login().then(() => {
  syncConversations();
});
