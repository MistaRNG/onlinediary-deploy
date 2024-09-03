declare module 'passport-gitlab2' {
  import { Strategy as PassportStrategy } from 'passport';
  import { Request } from 'express';

  interface StrategyOptions {
    clientID: string;
    clientSecret: string;
    callbackURL: string;
    passReqToCallback?: boolean;
    baseURL?: string;
  }

  export interface GitLabProfile {
    id: string;
    username: string;
    displayName: string;
    profileUrl: string;
    emails: { value: string }[];
  }

  type VerifyFunction = (
    accessToken: string,
    refreshToken: string,
    profile: GitLabProfile,
    done: (error: any, user?: any) => void
  ) => void;

  type VerifyFunctionWithRequest = (
    req: Request,
    accessToken: string,
    refreshToken: string,
    profile: GitLabProfile,
    done: (error: any, user?: any) => void
  ) => void;

  export class Strategy extends PassportStrategy {
    constructor(options: StrategyOptions, verify: VerifyFunction);
    constructor(
      options: StrategyOptions & { passReqToCallback: true },
      verify: VerifyFunctionWithRequest
    );
  }
}
