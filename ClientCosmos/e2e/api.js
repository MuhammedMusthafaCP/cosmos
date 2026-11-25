// Small helpers to talk to the backend directly (seeding, throwaway users).
export const API = "http://localhost:3000";

async function call(path, { method = "GET", body, headers = {} } = {}) {
  const res = await fetch(API + path, {
    method,
    body: body ? JSON.stringify(body) : undefined,
    headers: { "content-type": "application/json", ...headers },
  });
  const text = await res.text();
  let json;
  try { json = JSON.parse(text); } catch { json = text; }
  return { res, json };
}

const tokenOf = (res) =>
  res.headers.getSetCookie().find((c) => c.startsWith("token="))?.split(";")[0].slice(6);

export async function ensureUser(name, email, password = "pw12345") {
  let { res } = await call("/users", { method: "POST", body: { name, email, password } });
  let token = tokenOf(res);
  if (!token) ({ res } = await call("/users/getone", { method: "POST", body: { email, password } }), (token = tokenOf(res)));
  const { json } = await call("/users/tokenvalidate", { method: "POST", body: {}, headers: { "x-access-token": token } });
  return { name, email, password, token, id: json.user._id };
}

export async function seedContent(a, b) {
  const posts = await call("/posts");
  if (!posts.json.some((p) => p.caption.startsWith("[e2e]"))) {
    const img = "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c3/Andromeda_Galaxy_%28with_h-alpha%29.jpg/640px-Andromeda_Galaxy_%28with_h-alpha%29.jpg";
    for (const [u, caption, topic] of [[a, "[e2e] Orion Nebula from my backyard", "nebulas"], [b, "[e2e] Andromeda 40x30s stack", "galaxies"], [a, "[e2e] Jupiter at opposition", "solar system"]]) {
      await call("/posts/newpost", { method: "POST", headers: { "x-profile": JSON.stringify({ _id: u.id, name: u.name }) }, body: { caption, topic, image: img } });
    }
  }
  const all = await call(`/community/getAll/${b.id}`);
  if (!all.json.some((c) => c.name === "[e2e] Deep Sky Imagers")) {
    await call("/community/create", { method: "POST", body: { name: "[e2e] Deep Sky Imagers", description: "Long exposures and stacking tips", creator: a.id, communityprofile: "" } });
  }
}

export { call };
