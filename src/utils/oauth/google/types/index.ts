export interface UserGoogleI {
    iss: string;
    azp: string;
    aud: string;
    sub: string;
    email: string;
    email_verified: boolean;
    at_hash: string;
    name: string;
    picture: string;
    given_name: string;
    iat: number;
    exp: number;
  }
  
  export interface UserCreateI {
    email: string;
    fullname: string;
    username: string;
    profile_img: string;
    verified_email: boolean;
    google_id: number;
  }
  