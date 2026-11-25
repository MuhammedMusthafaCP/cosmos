import fs from "node:fs";
import { ensureUser, seedContent, API } from "./api.js";

// Creates two stable users + seed content and stores the main user's session for reuse.
export default async function globalSetup() {
  const ada = await ensureUser("E2E Ada", "e2e-ada@cosmos.dev");
  const ben = await ensureUser("E2E Ben", "e2e-ben@cosmos.dev");
  await seedContent(ada, ben);
  fs.mkdirSync("e2e/.auth", { recursive: true });
  const state = (u) => ({
    cookies: [{ name: "token", value: u.token, domain: "localhost", path: "/", httpOnly: true, secure: true, sameSite: "None", expires: Math.floor(Date.now() / 1000) + 6 * 3600 }],
    origins: [],
  });
  fs.writeFileSync("e2e/.auth/ada.json", JSON.stringify(state(ada)));
  fs.writeFileSync("e2e/.auth/ben.json", JSON.stringify(state(ben)));
  fs.writeFileSync("e2e/.auth/users.json", JSON.stringify({ ada, ben, api: API }));
}
