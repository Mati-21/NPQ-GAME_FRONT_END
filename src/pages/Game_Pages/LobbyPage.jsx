function LobbyPage() {
  const host = false;
  return (
    <div className="flex-1 flex flex-col px-10 py-10">
      <h1 className="border-b-2 border-black text-2xl font-bold pb-2">
        Players
      </h1>
      <div className="mt-4 relative flex flex-col items-end justify-between flex-1 ">
        <div className="flex flex-col w-full ">
          <p className="font-semibold">1. You</p>
          <p className="font-semibold">
            2. Amir Abdu <sub className="text-red-400">(waiting)</sub>
          </p>
        </div>

        <div className="absolute right-0 flex flex-col  gap-4  p-4 min-w-sm border-l">
          <div className="flex flex-col gap-2">
            <label htmlFor="Secret">Secret Number</label>
            <input
              type="number"
              placeholder="Enter your secret number "
              className="px-4 py-1 border-2 border-black/30 outline-none"
            />
          </div>
        </div>
        {host ? (
          <button className="py-1 rounded font-bold px-10 cursor-pointer shadow-all items-end">
            Start Game
          </button>
        ) : (
          <button className="py-1 rounded font-bold px-10 cursor-pointer shadow-all items-end">
            Ready
          </button>
        )}
      </div>
    </div>
  );
}

export default LobbyPage;
