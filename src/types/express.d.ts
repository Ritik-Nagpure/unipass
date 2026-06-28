import { User } from "../db/schema.js";

declare global {
  namespace Express {
    interface User extends User {}
  }
}

export {};
