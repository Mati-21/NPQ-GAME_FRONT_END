import { Link } from "react-router-dom";

function Landing() {
  return (
    <div className="flex-1 flex justify-center items-center bg-[#f5f6f7] dark:bg-slate-900 transition-colors duration-300 p-4 sm:p-8 md:p-12 overflow-y-auto">
      {/* Container */}
      <div className="w-full max-w-5xl flex flex-col-reverse lg:flex-row items-center justify-between gap-8 md:gap-12 lg:gap-16">
        {/* left Side text */}
        <div className="text-black dark:text-slate-100 flex-1 text-center lg:text-left">
          <div className="max-w-md mx-auto lg:mx-0 flex flex-col gap-3 sm:gap-4 items-center lg:items-start">
            <h1 className="font-lobster text-3xl sm:text-4xl md:text-5xl text-black dark:text-white leading-tight">
              Turn Math Into a Problem-Solving Adventure
            </h1>
            <h2 className="font-lobster text-lg sm:text-xl text-slate-800 dark:text-slate-200">
              NPQ builds the skills you need to tackle real-life challenges.
            </h2>
            <p className="text-xs sm:text-sm md:text-base text-gray-600 dark:text-slate-300 leading-relaxed">
              The NPQ game develops more than math knowledge — it improves
              logical thinking, focus, and decision-making. By practicing place
              value concepts through interactive play, learners build mental
              agility that helps them solve problems in everyday life.
            </p>
            <Link
              to="/register"
              className="px-6 sm:px-8 shadow-md py-2 font-bold text-white bg-purple-secondary dark:bg-[#5959B3] rounded-full hover:opacity-90 transition-opacity mt-2"
            >
              Join Us
            </Link>
          </div>
        </div>
        {/* Image side */}
        <div className="flex-1 flex justify-center w-full max-w-sm lg:max-w-none">
          <img src="brain.png" alt="Brain Adventure" className="h-[200px] sm:h-[300px] md:h-[350px] lg:h-[400px] object-contain w-auto" />
        </div>
      </div>
    </div>
  );
}

export default Landing;

