import Profile from "../views/profile/profile";
import ResetPassword from "../components/auth/forget_password";
import SignIn from "../components/auth/signin";
import SignUp from "../components/auth/signup";
import Solo from "../views/game/gridshot/solo";
import { HashRouter, Route, Routes } from "react-router-dom";
import Home from "../views/home/home";
import Leaderboard from "../views/leaderboard/leaderboard";
import SoloParams from "../views/game/tracking/solo";
import Historic from "../views/historic/historic";

const Ways: React.FC = () => {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/home" element={<Home />} />
        <Route path="/solo-classic" element={<Solo />} />
        <Route path="/solo-params" element={<SoloParams />} />
        <Route path="/historic" element={<Historic />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
      </Routes>
    </HashRouter>
  );
};

export default Ways;
