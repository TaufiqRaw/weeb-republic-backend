export interface JwtPayload{
  email: string,
  username : string,
  isAdmin : boolean,
  sub: number,
}