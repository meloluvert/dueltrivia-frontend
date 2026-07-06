export type IUser = {
  id: string;
  name: string;
  email: string;
};

export type IRegisterRequest = {
  name: string;
  email: string;
  password: string;
};

export type ILoginRequest = {
  email: string;
  password: string;
};

export type IAuthContext = {
  user: IUser | null;
  token: string | null;
  loading: boolean;
  authenticated: boolean;

  signIn(data: ILoginRequest): Promise<void>;
  signUp(data: IRegisterRequest): Promise<void>;
  signOut(): Promise<void>;

  getUser(): Promise<void>;
  updateUser(data: Partial<IRegisterRequest>): Promise<void>;
  deleteUser(): Promise<void>;

  sendResult(result: "win" | "lose" | "draw"): Promise<void>;
};