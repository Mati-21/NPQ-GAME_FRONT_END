function JoinUser() {
  const guessedNumbers = [2545, 1254, 2556, 2548, 2255, 6532];
  return (
    <div className="flex flex-col flex-1 shadow-all ">
      <h1 className="border-b px-4 py-2  border-gray-400">Amir</h1>
      {/* Gussed Number */}
      <div className="flex flex-1 justify-between py-1 px-4">
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
        <div className="flex gap-4">
          <input
            type="number"
            placeholder="Place"
            className="text-xs border border-gray-400 outline-none w-20 px-2"
          />
          <input
            type="number"
            placeholder="Quantity"
            className="text-xs border outline-none border-gray-400 w-20 px-2"
          />
          <button className="text-xs px-4 bg-blue-500 text-white py-1 cursor-pointer">
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}

export default JoinUser;
