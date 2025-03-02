import { createContext, useContext, createSignal, Component, JSX } from 'solid-js';
import { User } from '../types/user';

interface UserContextProps {
  user: () => User | null | undefined;
  setUser: (user: User | null | undefined) => void;
}

const UserContext = createContext<UserContextProps>({} as UserContextProps);

export const UserProvider: Component<{ children: JSX.Element }> = props => {
  const [user, setUser] = createSignal<User | null | undefined>();

  return <UserContext.Provider value={{ user, setUser }}>{props.children}</UserContext.Provider>;
};

export const useUser = () => useContext(UserContext);
