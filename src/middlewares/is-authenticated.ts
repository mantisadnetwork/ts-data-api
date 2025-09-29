import * as h3 from "h3";
import { verify, VerifyErrors } from "jsonwebtoken";

import { envs } from "../envs";

export const Errors = {
  noHeader: () => {
    return h3.createError({
      message: "Authorization header not provided",
      status: 401,
    });
  },
  invalidToken: ({ message }: VerifyErrors) => {
    return h3.createError({
      message: `Invalid Token: ${message}`,
      status: 401,
    });
  },
};

type IsAuthenticated = (event: h3.H3Event) => void | never;

export const isAuthenticated: IsAuthenticated = (event) => {
  const authorization = h3.getHeader(event, "apiKey");

  if(authorization !== "SWCzxNTdwUxtDNAvs1lmhH3JuiJJ1tKezByhl5T86JQb4NJByr4T1lPCG8UAHrYV"){
    throw Errors.noHeader();
  }
};
