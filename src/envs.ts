import { z } from "zod";

export const DataSourcesObjectSchema = z
  .custom<{
    [key: string]: string;
  }>(
    (value: unknown): boolean =>
      typeof value === "string" ||
      (typeof value === "object" && !Array.isArray(value)),
    {
      message:
        "Data Sources must be a stringified JSON or an object with string values.",
    }
  )
  .transform(
    (value: string | { [key: string]: string }): { [key: string]: string } =>
      typeof value === "string" ? JSON.parse(value) : value
  );

const EnvsSchema = z.object({
  APP_NAME: z.string().default("delbridge-typescript-data-api"),
  DATA_SOURCES: DataSourcesObjectSchema.default({
    local: "mongodb+srv://admin:FSdUbLPFitwTLyO3@production.p6bpw.mongodb.net/mantis-ad-server?retryWrites=true&w=majority",
  }),
  JWT_SECRET: z.string().default("prayForMe"),
  SERVER_ADDRESS: z.coerce.string().default("0.0.0.0"),
  SERVER_PORT: z.coerce.number().default(8080),
});

export const envs = EnvsSchema.parse(process.env);
