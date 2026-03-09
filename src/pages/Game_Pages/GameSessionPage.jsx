import ChatComponent from "./ChatComponent";

function GameSessionPage() {
  const guessedNumbers = [2545, 1254, 2556, 2548, 2255, 6532];
  return (
    <div className="flex px-10 py-4 shadow-all m-4 flex-1 gap-4">
      {/* Sidebar and Main Section  */}
      <div className="flex-3  flex">
        {/* Side Section */}
        <div className="flex-1">side</div>
        {/* Main Section */}
        <div className="flex-3 flex gap-4">
          {/* Host User */}
          <div className=" flex-1 shadow-all  ">
            <h1 className="border-b px-4 py-2">
              You <sub>(Host)</sub>
            </h1>
            <div className="flex justify-between p-4">
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
          </div>
          {/* Join User */}
          <div className=" flex-1 shadow-all ">
            <h1 className="border-b px-4 py-2">Amir</h1>
            <div className="flex justify-between p-4">
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
          </div>
        </div>
      </div>
      {/* Chat Section */}
      <ChatComponent />
    </div>
  );
}

export default GameSessionPage;
