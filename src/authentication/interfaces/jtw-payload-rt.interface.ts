import { JwtPayload } from "./jwt-payload.interface";

export interface JwtPayloadRt extends JwtPayload {
  refreshToken : string,
}