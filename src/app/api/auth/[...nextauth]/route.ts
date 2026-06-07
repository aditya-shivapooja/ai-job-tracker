// creates the Auth.js API endpoints automatically.
export const runtime = "nodejs";

import { handlers } from "@/auth";

export const { GET, POST } = handlers;