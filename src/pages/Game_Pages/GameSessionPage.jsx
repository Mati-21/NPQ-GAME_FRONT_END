import ChatComponent from "./ChatComponent";
import GameDashboard from "./GameDashboard";
import HostUser from "./HostUser";
import JoinUser from "./JoinUser";

function GameSessionPage() {
  const guessedNumbers = [2545, 1254, 2556, 2548, 2255, 6532];
  return (
    <div className="flex-1 min-h-0 flex px-4 py-4 shadow-all m-4 gap-4">
      {/* Sidebar and Main Section  */}
      <div className="flex-3 gap-4 flex">
        {/* Game Dashboard Section */}
        <GameDashboard />
        {/* Main Section */}
        <div className="flex-3 flex gap-4">
          {/* Host User */}
          <HostUser />
          {/* Join User */}
          <JoinUser />
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
