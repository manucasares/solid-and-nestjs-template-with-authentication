import { createSignal } from 'solid-js';
import { A, useNavigate } from '@solidjs/router';
import { useUser } from '../../context/UserContext';

export default function SignIn() {
  const [email, setEmail] = createSignal('asd@asd.com');
  const [password, setPassword] = createSignal('asd123');
  const [error, setError] = createSignal('');
  const navigate = useNavigate();

  const { setUser } = useUser();

  const handleSignIn = async () => {
    setError(''); // Reset error message

    try {
      const response = await fetch('/api/auth/sign-in', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include', // Needed for session-based auth
        body: JSON.stringify({ email: email(), password: password() }),
      });

      if (!response.ok) {
        throw new Error('Invalid credentials');
      }

      const user = await response.json();
      setUser(user);

      // Redirect after successful sign-in
      navigate('/home');
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div class="flex flex-col items-center p-6 bg-gray-100 min-h-screen">
      <h2 class="text-2xl font-bold mb-4">Sign In</h2>

      {error() && <p class="text-red-500 mb-2">{error()}</p>}

      <input
        class="border p-2 rounded w-64 mb-2"
        type="email"
        placeholder="Email"
        value={email()}
        onInput={e => setEmail(e.target.value)}
      />
      <input
        class="border p-2 rounded w-64 mb-4"
        type="password"
        placeholder="Password"
        value={password()}
        onInput={e => setPassword(e.target.value)}
      />
      <button class="bg-blue-500 text-white px-4 py-2 rounded" onClick={handleSignIn}>
        Sign In
      </button>
      <A href="/sign-up" class="text-blue-500 mt-4">
        Go to Sign Up
      </A>
    </div>
  );
}
