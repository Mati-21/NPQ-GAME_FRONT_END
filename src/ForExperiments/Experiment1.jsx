function Experiment1() {
  return (
    //app
    <div className="h-screen bg-amber-50 flex flex-col">
      {/* Navbar */}
      <div className="w-full p-4 bg-green-200 ">navbar</div>
      {/* Profile Page */}
      <div className="flex-1  bg-pink-400 flex p-4">
        {/* Sidebar */}
        <div className="bg-yellow-200 w-1/4  flex h-full   flex-col">
          {/* profile image */}
          <div className="bg-black text-white h-1/4">Profile image</div>
          {/* Discription */}
          <div className="bg-red-300  h-1/2 overflow-y-auto ">
            <p>
              Lorem ipsum, dolor sit amet consectetur adipisicing elit. Optio a
              ut, eum inventore laborum blanditiis nihil quidem est voluptas
              doloribus libero neque sapiente soluta dignissimos ea quibusdam
              facere voluptatibus consequuntur?
            </p>
            <p>
              Lorem ipsum, dolor sit amet consectetur adipisicing elit. Optio a
              ut, eum inventore laborum blanditiis nihil quidem est voluptas
              doloribus libero neque sapiente soluta dignissimos ea quibusdam
              facere voluptatibus consequuntur?
            </p>
            <p>
              Lorem ipsum, dolor sit amet consectetur adipisicing elit. Optio a
              ut, eum inventore laborum blanditiis nihil quidem est voluptas
              doloribus libero neque sapiente soluta dignissimos ea quibusdam
              facere voluptatibus consequuntur?
            </p>
            <p>
              Lorem ipsum, dolor sit amet consectetur adipisicing elit. Optio a
              ut, eum inventore laborum blanditiis nihil quidem est voluptas
              doloribus libero neque sapiente soluta dignissimos ea quibusdam
              facere voluptatibus consequuntur?
            </p>
            <p>
              Lorem ipsum, dolor sit amet consectetur adipisicing elit. Optio a
              ut, eum inventore laborum blanditiis nihil quidem est voluptas
              doloribus libero neque sapiente soluta dignissimos ea quibusdam
              facere voluptatibus consequuntur?
            </p>
          </div>
        </div>
        {/* Main content area */}
        <div className="bg-orange-400 flex-1 p-4">Main content area</div>
      </div>
    </div>
  );
}

export default Experiment1;
