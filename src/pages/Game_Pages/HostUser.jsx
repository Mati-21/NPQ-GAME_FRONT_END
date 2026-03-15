function HostUser() {
  const guessedNumbers = [2545, 1254, 2556, 2548, 2255, 6532];
  return (
    <div className="flex-1 flex flex-col shadow-all  ">
      {/* header */}
      <h1 className="border-b border-gray-400 px-4 py-2">
        You <sub>(Host)</sub>
      </h1>
      {/* Gussed Number */}
      <div className="flex flex-1  justify-between py-1 px-4">
        <div className="flex flex-col">
          <h1 className="border-b mb-2">No</h1>
          <ul>
            {guessedNumbers.map((guessNumber, i) => (
              <li className="" key={i}>
                {guessNumber}
              </li>
            ))}
          </ul>
        </div>
        <div className="flex flex-col">
          <h1 className="border-b mb-2">Place</h1>
          <ul>
            {guessedNumbers.map((guessNumber, i) => (
              <li className="" key={i}>
                {guessNumber}
              </li>
            ))}
          </ul>
        </div>
        <div className="flex flex-col">
          <h1 className="border-b mb-2">Quantity</h1>
          <ul>
            {guessedNumbers.map((guessNumber, i) => (
              <li className="" key={i}>
                {guessNumber}
              </li>
            ))}
          </ul>
        </div>
      </div>
      {/* Action  Buttons  */}
      


      <div className="flex mt-2 px-4 border-t py-2 border-gray-400">
        <div className="flex gap-4  w-full ">
          <input
            type="number"
            placeholder="Guess The Number"
            className="text-xs border border-gray-400 outline-none w-20 px-2 flex-1"
          />

          <button className="text-xs px-4 bg-blue-500 text-white py-1 cursor-pointer">
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}

export default HostUser;
