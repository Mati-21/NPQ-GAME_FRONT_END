import ChatComponent from "./ChatComponent";

function GameSessionPage() {
  const guessedNumbers = [2545, 1254, 2556, 2548, 2255, 6532];
  return (
    <div className="flex-1 flex px-10 py-4 shadow-all m-4 gap-4">
      {/* Sidebar and Main Section  */}
      <div className="flex-3 flex">
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

//  <div class="flex flex-col h-screen">
//       <div class="p-4 bg-blue-500 text-white">Header</div>

//       <div class="flex-1 overflow-y-auto p-4">
//         <p>Content 1</p>
//         <p>Content 2</p>
//         <p>Content 3</p>
//         <p>Content 4</p>
//         <p>Content 5</p>
//         <p>Content 6</p>
//         <p>Content 7</p>
//         <p>Content 1</p>
//         <p>Content 2</p>
//         <p>Content 3</p>
//         <p>Content 4</p>
//         <p>Content 5</p>
//         <p>Content 6</p>
//         <p>Content 7</p>
//         <p>Content 1</p>
//         <p>Content 2</p>
//         <p>Content 3</p>
//         <p>Content 4</p>
//         <p>Content 5</p>
//         <p>Content 6</p>
//         <p>Content 7</p>
//         <p>Content 5</p>
//         <p>Content 6</p>
//         <p>Content 7</p>
//         <p>Content 1</p>
//         <p>Content 2</p>
//         <p>Content 3</p>
//         <p>Content 4</p>
//         <p>Content 5</p>
//         <p>Content 6</p>
//         <p>Content 7</p>
//       </div>

//       <div class="p-4 bg-gray-200">Footer</div>
//     </div>
