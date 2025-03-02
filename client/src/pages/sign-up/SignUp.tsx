import { createSignal } from 'solid-js';
import { A, useNavigate } from '@solidjs/router';
import { useUser } from '../../context/UserContext';

export default function SignUp() {
  const [name, setName] = createSignal('Manuel');
  const [email, setEmail] = createSignal('asd@asd.com');
  const [password, setPassword] = createSignal('password');
  const [loading, setLoading] = createSignal(false);
  const [error, setError] = createSignal('');

  const { setUser } = useUser();
  const navigate = useNavigate();

  const handleSubmit = async (e: Event) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/sign-up', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name(),
          email: email(),
          password: password(),
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to sign up');
      }

      const user = await response.json();

      setUser(user);

      navigate('/home');
    } catch (err: any) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div class="flex flex-col items-center p-6 bg-gray-100 min-h-screen">
      <h2 class="text-2xl font-bold mb-4">Sign Up</h2>
      {error() && <p class="text-red-500">{error()}</p>}
      <form class="flex flex-col items-center w-64" onSubmit={handleSubmit}>
        <input
          class="border p-2 rounded w-full mb-2"
          type="text"
          placeholder="Name"
          value={name()}
          onInput={e => setName(e.currentTarget.value)}
        />
        <input
          class="border p-2 rounded w-full mb-2"
          type="email"
          placeholder="Email"
          value={email()}
          onInput={e => setEmail(e.currentTarget.value)}
        />
        <input
          class="border p-2 rounded w-full mb-2"
          type="password"
          placeholder="Password"
          value={password()}
          onInput={e => setPassword(e.currentTarget.value)}
        />
        <button
          type="submit"
          class="bg-green-500 text-white px-4 py-2 rounded w-full disabled:opacity-50"
          disabled={loading()}
        >
          {loading() ? 'Signing Up...' : 'Sign Up'}
        </button>
      </form>

      <A href="/sign-in" class="text-blue-500 mt-4">
        Go to Sign In
      </A>
    </div>
  );
}
