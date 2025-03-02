import { createSignal, For } from 'solid-js';
import { useUser } from '../../context/UserContext';

export default function Home() {
  const [posts, setPosts] = createSignal<any[]>([]);
  const { user, setUser } = useUser();

  fetch('/api/posts')
    .then(res => res.json())
    .then(setPosts)
    .catch(console.error);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' });
      setUser(null);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div class="p-6 bg-gray-100 min-h-screen">
      <h1>Hi {user()?.name}</h1>

      <h2 class="text-2xl font-bold mb-4">Posts</h2>
      <div class="grid gap-4">
        <For each={posts()}>
          {post => <div class="p-4 bg-white rounded shadow">{post.title}</div>}
        </For>
      </div>

      <button
        onClick={handleLogout}
        class="border rounded-3xl bg-red-800 px-4 py-2 text-white mt-4 cursor-pointer"
      >
        Logout
      </button>
    </div>
  );
}
