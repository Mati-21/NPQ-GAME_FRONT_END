import { Calendar, CircleX, Gpu, Locate, Map, MapPin, Pen } from "lucide-react";
import { Link } from "react-router-dom";
import UserTimeline from "./UserTimeline";
import EditProfile from "./EditProfile";

function Profile() {
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
        <div className="flex flex-col justify-center  w-full h-1/2">
          <img src="#" alt="" />
          <div className=""></div>
        </div>
        {/* Discription */}
        <div className="flex flex-col gap-2  h-full w-full px-6 pb-10 scrollbar-custom">
          <h2 className="font-semibold border-b border-gray-300 pb-1">Name</h2>
          <h1 className="text-sm">Mati Melakmu</h1>
          <h2 className="font-semibold border-b border-gray-300 pb-1 mt-2">
            Email
          </h2>
          <h1 className="text-sm">Matimelkamu@gmail.com</h1>
          <h2 className="font-semibold border-b border-gray-300 pb-1 mt-2">
            About Me
          </h2>
          <p className="text-sm">
            Lorem ipsum dolor sit amet consectetur, adipisicing elit. Nobis
            offia ea!font-semibold border-b border-gray-300 pb-1
          </p>

          <h2 className="font-semibold border-b border-gray-300 pb-1 mt-2">
            Bio
          </h2>
          <p className="text-sm">quaerat enim mnis voluptatibus soluta ea!</p>

          <div className=" flex items-center gap-2 mt-4">
            <Calendar size={20} />{" "}
            <p className="text-sm font-semibold">Joined: july 2005</p>
          </div>
          <div className=" flex items-center gap-2 mt-4">
            <MapPin size={20} />{" "}
            <p className="text-sm font-semibold">Ethiopia, Addis Ababa</p>
          </div>
        </div>
      </div>

      {/*  */}
      <EditProfile />
    </div>
  );
}

export default Profile;
