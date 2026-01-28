import { users } from "../../../MockData/Mockdata";

const topPlayers = users.slice(0, 5); // top 5 users

function TopPlayers() {
  return topPlayers.length > 0 ? (
    <div className="px-14 mt-6">
      <h1 className="text-4xl font-semibold tracking-wider ">Top Players</h1>
      {topPlayers.map((user) => (
        <div
          key={user.id}
          className="mt-4 p-4 bg-white shadow-all rounded-lg flex items-center gap-4"
        >
          <div className="w-12 h-12 rounded-full bg-black text-purple-secondary flex items-center justify-center font-semibold text-lg">
            {user.first_name.charAt(0)}
          </div>
          <div>
            <h2 className="font-semibold">{user.first_name}</h2>
            <p className="text-gray-500">{user.email}</p>
          </div>
        </div>
      ))}
    </div>
  ) : (
    <div className="px-14 mt-6">
      <h1 className="text-4xl font-semibold tracking-tighter ">
        No players yet
      </h1>
    </div>
  );
}

export default TopPlayers;
