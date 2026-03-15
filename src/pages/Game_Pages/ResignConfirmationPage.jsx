import { useDispatch } from "react-redux";
import { closeQuitModal } from "../../features/UI_Slice/UI_Slice";

function ResignConfirmationPage() {
  const dispatch = useDispatch();
  return (
    <div
      onClick={() => dispatch(closeQuitModal())}
      className="h-screen w-full z-50 absolute bg-black/80 flex justify-center items-center "
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white/80 px-10 py-2 flex flex-col gap-6 justify-center items-center h-1/3 rounded"
      >
        <h1 className="text-xl font-bold">
          Do you really want to quit the game ?
        </h1>
        <div className="flex  justify-center gap-4">
          <button className="px-8 py-1 rounded bg-blue-400 text-white font-bold cursor-pointer">
            No
          </button>
          <button className="px-8 py-1 rounded bg-red-800 text-white font-bold cursor-pointer">
            Yes
          </button>
        </div>
      </div>
    </div>
  );
}

export default ResignConfirmationPage;
