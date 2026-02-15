import { BrowserRouter, Route, Routes } from "react-router-dom";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Notfound from "./pages/Notfound";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./routes/ProtectedRoute";
import PublicRoute from "./routes/PublicRoute";
import Home from "./pages/HOME_PAGE/Home";

import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { connectSocket, disconnectSocket } from "./utils/socket";
import { logout, setCredentials } from "./features/Auth/authSlice.js";
import { useQuery } from "@tanstack/react-query";
import { checkAuth } from "./api/user.api.js";
import Profile from "./pages/HOME_PAGE/Profile/Profile.jsx";

function App() {
  const { isAuthenticated } = useSelector((state) => state.auth);
  // console.log(isAuthenticated);

  const dispatch = useDispatch();

  const { isLoading, data, error } = useQuery({
    queryKey: ["auth"],
    queryFn: checkAuth,
    retry: false,
    refetchInterval: 1000 * 60 * 10, // Refetch every hour
    refetchIntervalInBackground: true,
  });

  useEffect(() => {
    if (data) {
      dispatch(setCredentials({ user: data.user }));
      connectSocket();
    }

    if (error) {
      dispatch(logout());
      disconnectSocket();
    }
  }, [data, error, dispatch]);

  useEffect(() => {
    if (isAuthenticated) {
      connectSocket();
    } else {
      disconnectSocket();
    }
  }, [isAuthenticated]);

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <h1 className="text-2xl font-semibold">Loading...</h1>
      </div>
    );
  }

  return (
    <div className="h-screen bg-twitter-white flex overflow-x-hidden scrollbar-custom flex-col">
      <BrowserRouter>
        <Navbar />
        <Routes>
          {/* Public routes */}
          <Route
            path="/"
            element={
              <PublicRoute>
                <Landing />
              </PublicRoute>
            }
          />
          <Route
            path="/login"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />
          <Route
            path="/register"
            element={
              <PublicRoute>
                <Register />
              </PublicRoute>
            }
          />

          {/* Protected routes */}
          <Route
            path="/home"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
          {/* Protected routes */}
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />

          {/* Catch all */}
          <Route path="*" element={<Notfound />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;

// App
/*
<div className="h-screen bg-white-background flex overflow-x-hidden scrollbar-custom flex-col">
  {/* navbar */
// <div className="w-screen px-20 bg-purple-secondary shadow-md p-3 text-white sticky top-0 z-50 bg-white"></div>
{
  /* profile page */
}
// <div className="shadow-all m-2 flex-1 flex justify-start">
{
  /* sidebar  */
}
// <div className="relative h-full shadow-all  flex flex-col items-center w-1/4 mx-auto ">
{
  /* cover Picture */
}
// <div className="flex flex-col justify-center bg-amber-100 w-full  h-1/2"></div>
{
  /* Discription */
}
// <div className="flex flex-col gap-2 mt-4 h-full w-full px-6 pb-10 scrollbar-custom"></div>
// </div>
{
  /* user profile time line */
}
// <div className="flex-1 flex"></div>
// </div>
// </div>;
