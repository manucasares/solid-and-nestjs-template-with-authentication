import { createSignal, type Component } from 'solid-js';
import AppRouter from './components/router/AppRouter';
import { useUser } from './context/UserContext';

const App: Component = () => {
  const [loading, setLoading] = createSignal(true);
  const { setUser } = useUser();

  fetch('/api/users/me')
    .then(res => {
      if (!res.ok) {
        setUser(null);
        return;
      }
      return res.json();
    })
    .then(user => {
      setUser(user);
    })
    .catch(error => {
      setUser(null);
      console.error(error);
    })
    .finally(() => setLoading(false));

  return <>{loading() ? <p>Loading...</p> : <AppRouter />}</>;
};

export default App;
