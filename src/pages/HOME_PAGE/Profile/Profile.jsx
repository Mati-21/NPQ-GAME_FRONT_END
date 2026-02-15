import { Calendar, CircleX, Gpu, Locate, Map, MapPin, Pen } from "lucide-react";
import { Link } from "react-router-dom";
import UserTimeline from "./UserTimeline";
import EditProfile from "./EditProfile";
import { useSelector } from "react-redux";
import {} from "../../../features/UI_Slice/UI_Slice";
import { formatData } from "../../../utils/formatData";

function Profile() {
  const user = useSelector((state) => state.auth.user);
  const { isEditProfileOpen } = useSelector((state) => state.UI_Slice);

  const userJoinDate = formatData(user.createdAt);

  return (
    <div className="shadow-all m-2 flex-1 flex justify-start">
      <div className="relative h-full shadow-all  flex flex-col items-center w-1/4 mx-auto ">
        {/* cover Picture */}
        <div className="flex flex-col justify-center w-full h-96 overflow-hidden">
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
            {user.firstName ? user.firstName : "N/A"}{" "}
            {user.lastName ? user.lastName : "N/A"}
          </h1>
          <h2 className="font-semibold  mt-2 text-xs">Email</h2>
          <h1 className="text-xs border-b border-gray-300 pb-1">
            {user.email}
          </h1>
          <h2 className="font-semibold  mt-2 text-xs">About Me</h2>
          <p className="text-xs border-b border-gray-300 pb-1">
            {user.aboutMe ? user.aboutMe : "N/A"}
          </p>

          <h2 className="font-semibold  mt-2 text-xs">Bio</h2>
          <p className="text-xs border-b border-gray-300 pb-1 ">
            {user.bio ? user.bio : "N/A"}
          </p>

          <div className=" flex items-center gap-2 mt-4 border-b border-gray-300 pb-1">
            <Calendar size={20} />{" "}
            <p className="text-xs font-semibold">
              Joined ON: {userJoinDate.month}-{userJoinDate.day}-
              {userJoinDate.year}
            </p>
          </div>
          <div className=" flex items-center gap-2 mt-4 border-b border-gray-300 pb-1">
            <MapPin size={20} />{" "}
            <p className="text-xs font-semibold">
              {user.location.country ? user.location.country : "N/A"},{" "}
              {user.location.region ? user.location.region : "N/A"}
            </p>
          </div>
        </div>
      </div>

      {/*  */}
      {isEditProfileOpen ? <EditProfile /> : <UserTimeline />}
    </div>
  );
}

export default Profile;
