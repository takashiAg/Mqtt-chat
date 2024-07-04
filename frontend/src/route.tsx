import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Rooms from "./page/rooms.tsx";
import Room from "./page/room.tsx";
import NotFound from "./page/404.tsx";
import RoomCreate from "./page/room-new.tsx";
import Signin from "./page/signin.tsx";
import Signup from "./page/signup.tsx";
import { useGlobalState } from "./states/auth.hook.tsx";

const Router = () => {
  const state = useGlobalState();

  if (!state.isLoggedIn) {
    return (
      <BrowserRouter>
        <Routes>
          <Route path="*" element={<Signin />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Rooms />} />
        <Route path="/room" element={<Rooms />} />
        <Route path="room/:roomId" element={<Room />} />
        <Route path="room/create" element={<RoomCreate />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
