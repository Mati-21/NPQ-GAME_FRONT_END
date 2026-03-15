import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { openQuitModal } from "../../features/UI_Slice/UI_Slice";
import { useDispatch } from "react-redux";

function GameDashboard() {
  const [show, setShow] = useState(false);
  console.log(show);
  const dispatch = useDispatch();

  return (
    <div className="flex-1 flex flex-col justify-between gap-4  shadow-all ">
      <div className="h-full">
        {/* Secret Number */}
        <div className="bg-gray-300/40 px-4 ">
          <label htmlFor="Secret" className="text-xs font-bold">
            Secret Number{" "}
          </label>
          <div className="flex justify-between">
            <input
              type={show ? "text" : "password"}
              name="Secret"
              className="outline-none text-sm"
              readOnly
              value={5265}
            />
            {show ? (
              <Eye
                size={16}
                className="cursor-pointer"
                onClick={() => setShow(false)}
              />
            ) : (
              <EyeOff
                size={16}
                className="cursor-pointer"
                onClick={() => setShow(true)}
              />
            )}
          </div>
        </div>
      </div>
      {/* Resign Button */}
      <div className="ml-2 flex justify-end p-4  ">
        <button
          onClick={() => dispatch(openQuitModal())}
          className="text-xs border px-4 py-1 font-bold cursor-pointer text-gray-400"
        >
          Resign Game
        </button>
      </div>
    </div>
  );
}

export default GameDashboard;
