import { useAuth } from "@/provider/auth-context";

export default function Dashboard() {
  const { logout, user } = useAuth();

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Dashboard 🚀</h1>
        <button
          onClick={logout}
          className="bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded-lg"
        >
          Logout
        </button>
      </div>
      <p className="text-gray-400">Hoş geldiniz, {user?.name}!</p>
    </div>
  );
}