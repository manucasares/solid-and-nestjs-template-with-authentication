import { createSignal, JSX, lazy, type Component } from 'solid-js';
import { UserProvider } from '../context/UserContext';

const AppProviders: Component<{ children: JSX.Element }> = props => {
  return <UserProvider>{props.children}</UserProvider>;
};

export default AppProviders;
