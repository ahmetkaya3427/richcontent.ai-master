import crypto from "crypto";

export const md5 = (data: string) => {
  return crypto.createHash("md5").update(data).digest("hex");
};

export const sha1 = (data: string) => {
  return crypto.createHash("sha1").update(data).digest("hex");
};

export const hashPassword = (password: string) => {
  return sha1(md5(password));
};
