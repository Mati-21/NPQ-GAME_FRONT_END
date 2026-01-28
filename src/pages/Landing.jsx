import { Link } from "react-router-dom";

function Landing() {
  return (
    <div className="flex-1 flex justify-center items-center">
      {/* Container */}
      <div className="h-[80%] w-[70%] flex justify-between">
        {/* left Side text */}
        <div className="text-black flex-1 ">
          <div className="max-w-md flex flex-col gap-4">
            <h1 className=" font-lobster text-6xl ">
              Turn Math Into a Problem-Solving Adventure
            </h1>
            <h2 className=" font-lobster text-xl ">
              NPQ builds the skills you need to tackle real-life challenges.
            </h2>
            <p>
              The NPQ game develops more than math knowledge — it improves
              logical thinking, focus, and decision-making. By practicing place
              value concepts through interactive play, learners build mental
              agility that helps them solve problems in everyday life.
            </p>
            <Link
              to="/register"
              className="px-8 shadow-md py-2 font-bold text-black inline-block mt-2 bg-purple-secondary rounded-full self-start "
            >
              Join Us
            </Link>
          </div>
        </div>
        {/* Image side */}
        <div className=" flex-1 flex justify-center ">
          <img src="brain.png" alt="" className="h-[400px]" />
        </div>
      </div>
    </div>
  );
}

export default Landing;
