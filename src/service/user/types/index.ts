export interface GoogleTokensResult {
  access_token: string;
  expires_in: Number;
  refresh_token: string;
  scope: string;
  id_token: string;
}

export interface GoogleUserResult {
  id: string;
  email: string;
  verified_email: boolean;
  name: string;
  given_name: string;
  family_name: string;
  picture: string;
  locale: string;
}


export interface GithubTokensResult {
    data:{
      access_token: string;
      token_type: string;
      scope: string;
    }
  }
  
export interface GithubUserResult {
  login: string;
  id: number;
  node_id: string;
  avatar_url: string;
  gravatar_id: string;
  url: string;
  html_url: string;
  followers_url: string;
  following_url: string;
  gists_url: string;
  starred_url: string;
  subscriptions_url: string;
  organizations_url: string;
  repos_url: string;
  events_url: string;
  received_events_url: string;
  type: string;
  site_admin: boolean;
  name: string;
  company?: string;
  blog: string;
  location: string;
  email?: string;
  hireable: boolean;
  bio: string;
  twitter_username?: string;
  public_repos: number;
  public_gists: number;
  followers: number;
  following: number;
  created_at: string;
  updated_at: string;
}

export interface CreateUserData {
  google_id?: string;
  facebook_id?: string;
  github_id?: string;
  fullname: string;
  username: string;
  email?: string;
  verify_email?: boolean;
  profile_img?: string;
  password_hash?: string;
  date_of_birth?: Date;
  phone?: string;
  verify_phone?: boolean;
  gender?: string;
  cpf?: string;
}
