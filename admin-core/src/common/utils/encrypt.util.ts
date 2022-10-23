import crypto from "node:crypto";

const hash = (c: string) => crypto.createHash("md5").update(c).digest("hex");

export const md5 = (content: string, salt?: string) =>
  salt ? hash(hash(content) + salt) : hash(content);
