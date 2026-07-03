import { Link } from "react-router-dom";

function Landing() {
  return (
    <div className="flex-1 flex justify-center items-center bg-[#f5f6f7] dark:bg-slate-900 transition-colors duration-300">
      {/* Container */}
      <div className="h-[80%] w-[70%] flex justify-between">
        {/* left Side text */}
        <div className="text-black dark:text-slate-100 flex-1">
          <div className="max-w-md flex flex-col gap-4">
            <h1 className="font-lobster text-6xl text-black dark:text-white">
              Turn Math Into a Problem-Solving Adventure
            </h1>
            <h2 className="font-lobster text-xl text-black dark:text-slate-200">
              NPQ builds the skills you need to tackle real-life challenges.
            </h2>
            <p className="text-gray-700 dark:text-slate-300">
              The NPQ game develops more than math knowledge — it improves
              logical thinking, focus, and decision-making. By practicing place
              value concepts through interactive play, learners build mental
              agility that helps them solve problems in everyday life.
            </p>
            <Link
              to="/register"
              className="px-8 shadow-md py-2 font-bold text-white bg-purple-secondary dark:bg-[#5959B3] rounded-full self-start hover:opacity-90 transition-opacity"
            >
              Join Us
            </Link>
          </div>
        </div>
        {/* Image side */}
        <div className="flex-1 flex justify-center">
          <img src="brain.png" alt="" className="h-[400px] object-contain" />
        </div>
      </div>
    </div>
  );
}

export default Landing;

