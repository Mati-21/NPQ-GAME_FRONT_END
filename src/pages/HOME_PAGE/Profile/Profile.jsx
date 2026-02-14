import { Calendar, CircleX, Gpu, Locate, Map, MapPin, Pen } from "lucide-react";
import { Link } from "react-router-dom";
import UserTimeline from "./UserTimeline";
import EditProfile from "./EditProfile";
import { useSelector } from "react-redux";

function Profile() {
  const user = useSelector((state) => state.auth.user);
  return (
    <div className="shadow-all m-2 flex-1 flex justify-start">
      <div className="relative h-full shadow-all  flex flex-col items-center w-1/4 mx-auto ">
        <div className="absolute top-6 left-6 cursor-pointer">
          <Pen />
        </div>
        <Link to="/" className="absolute top-6 right-6 cursor-pointer">
          <CircleX />
        </Link>

        {/* cover Picture */}
        <div className="flex flex-col justify-center w-full h-64 overflow-hidden">
          <img
            src={user.avatar}
            alt=""
            className="w-full h-full object-cover"
          />
        </div>

        {/* Discription */}
        <div className="flex flex-col gap-2  w-full px-6 pb-2 h-full  scrollbar-custom py-4">
          <h2 className="font-semibold   text-xs">Name</h2>
          <h1 className="text-xs border-b border-gray-300 pb-1">
            {user.firstName} {user.lastName}
          </h1>
          <h2 className="font-semibold  mt-2 text-xs">Email</h2>
          <h1 className="text-xs border-b border-gray-300 pb-1">
            {user.email}
          </h1>
          <h2 className="font-semibold  mt-2 text-xs">About Me</h2>
          <p className="text-xs border-b border-gray-300 pb-1">{user.about}</p>

          <h2 className="font-semibold  mt-2 text-xs">Bio</h2>
          <p className="text-xs border-b border-gray-300 pb-1 ">
            quaerat enim mnis voluptatibus soluta ea!
          </p>

          <div className=" flex items-center gap-2 mt-4 border-b border-gray-300 pb-1">
            <Calendar size={20} />{" "}
            <p className="text-xs font-semibold">Joined: {user.createdAt}</p>
          </div>
          <div className=" flex items-center gap-2 mt-4 border-b border-gray-300 pb-1">
            <MapPin size={20} />{" "}
            <p className="text-xs font-semibold">
              {user.location.country}, {user.location.region}
            </p>
          </div>
        </div>
      </div>

      {/*  */}
      <EditProfile />
    </div>
  );
}

export default Profile;
