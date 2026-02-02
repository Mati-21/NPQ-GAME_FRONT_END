import { CircleX, Pen } from "lucide-react";
import { Link } from "react-router-dom";

function Profile() {
  return (
    <div className="relative my-4 bg-white h-screen flex flex-col items-center rounded-2xl shadow-all w-1/2 mx-auto">
      <div className="absolute top-10 left-10 cursor-pointer">
        <Pen />
      </div>
      <Link to="/" className="absolute top-10 right-10 cursor-pointer">
        <CircleX />
      </Link>

      {/* Profile  */}
      <h1 className="mt-2 text-2xl font-semibold tracking-wider">Profile</h1>

      {/* Profile Picture */}
      <div className="h-40 w-40  rounded-full mt-4 shadow-all">
        <img src="#" alt="" />
      </div>

      {/* Stats */}
      <div className="flex gap-8 mt-4 bg-gray-100 p-4 rounded-lg shadow-inner">
        <div className="cursor-pointer px-2 flex flex-col gap-1 items-center">
          <p>Games</p>
          <p className="text-2xl">2</p>
        </div>
        <div className="cursor-pointer px-2 flex flex-col gap-1 items-center">
          <p className="text-xl font-bold text-green-400">Win</p>
          <p className="text-2xl">5</p>
        </div>
        <div className="cursor-pointer px-2 flex text-red-500 flex-col gap-1 items-center">
          <p>Lose</p>
          <p className="text-2xl">0</p>
        </div>
      </div>

      {/* User Info */}

      <div className=" w-full flex-1 px-6">
        <h2 className="mt-6 text-md font-semibold">Username: user123</h2>
        <h2 className="mt-2 text-md font-semibold">Email: user123@gmail.com</h2>
        <h2 className="mt-2 text-md font-semibold">Phone: 0961838196</h2>
      </div>
    </div>
  );
}

export default Profile;
