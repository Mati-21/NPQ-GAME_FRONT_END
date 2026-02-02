let timer;

function searchUser(value) {
  clearTimeout(timer); // stop previous waiting
  timer = setTimeout(() => {
    console.log("Searching for:", value);
  }, 300); // wait 300ms
}

function Experiment1() {
  return (
    <div className="h-screen flex items-center justify-center">
      <input
        type="text"
        name="search"
        id="searchInput"
        onChange={(e) => searchUser(e.target.value)}
        className="border border-green-600 px-2 py-1 outline-none"
        o
        placeholder="text here"
      />
    </div>
  );
}

export default Experiment1;
