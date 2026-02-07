const UserTimeline = () => {
  return (
    <div className="flex-1 flex">
      {/* User stat */}
      <div className="flex-1 mx-auto p-6 bg-white shadow-lg rounded-xl">
        {/* Header */}
        <div className="flex items-center space-x-4 mb-6">
          <img
            src="https://i.pravatar.cc/150?img=12"
            alt="Player Avatar"
            className="w-20 h-20 rounded-full border-2 border-indigo-500"
          />
          <div>
            <h1 className="text-2xl font-bold text-gray-800">PlayerOne</h1>
            <p className="text-sm text-gray-500">NPQ Game Player</p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
          <div className="bg-indigo-50 p-4 rounded-lg shadow hover:shadow-md transition">
            <p className="text-gray-500 text-sm">Total Games Played</p>
            <p className="text-xl font-semibold text-indigo-700">120</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg shadow hover:shadow-md transition">
            <p className="text-gray-500 text-sm">Total Wins</p>
            <p className="text-xl font-semibold text-green-700">85</p>
          </div>
          <div className="bg-yellow-50 p-4 rounded-lg shadow hover:shadow-md transition">
            <p className="text-gray-500 text-sm">Win Rate</p>
            <p className="text-xl font-semibold text-yellow-700">71%</p>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg shadow hover:shadow-md transition">
            <p className="text-gray-500 text-sm">Best Score (Fewest Guesses)</p>
            <p className="text-xl font-semibold text-purple-700">3</p>
          </div>
          <div className="bg-pink-50 p-4 rounded-lg shadow hover:shadow-md transition">
            <p className="text-gray-500 text-sm">Average Guesses/Game</p>
            <p className="text-xl font-semibold text-pink-700">5</p>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg shadow hover:shadow-md transition">
            <p className="text-gray-500 text-sm">Longest Winning Streak</p>
            <p className="text-xl font-semibold text-blue-700">12</p>
          </div>
          <div className="bg-orange-50 p-4 rounded-lg shadow hover:shadow-md transition sm:col-span-2">
            <p className="text-gray-500 text-sm">Leaderboard Rank</p>
            <p className="text-xl font-semibold text-orange-700">#7</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserTimeline;
