import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import ForgotPassword from "./pages/ForgotPassword.jsx";
import Taskbar from "./components/Taskbar.jsx";
 import Home from "./pages/Home.jsx";
import Friends from "./pages/FriendSuggestions.jsx";
 import CreatePostPage from "./pages/CreatePost.jsx";
// import Messages from "./pages/dashboard/Messages.jsx";
import Profile from "./pages/Profile.jsx";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        

        {/* Dashboard routes */}
          <Route path="/dashboard" element={<Taskbar />} />
        {/* <Route path="/dashboard/home" element={<><Home /><Taskbar activeSection="home" /></>} />
        <Route path="/dashboard/friends" element={<><Friends /><Taskbar activeSection="friends" /></>} /> */}
<Route path="/dashboard/home" element={<><Home /><Taskbar activeSection="home" /></>} />
        <Route path="/dashboard/friend-suggestions" element={<><Friends /><Taskbar activeSection="friend-suggestions" /></>} /> 
        <Route path="/dashboard/posts" element={<><CreatePostPage /><Taskbar activeSection="post" /></>} />
        <Route path="/dashboard/profile" element={<><Profile /><Taskbar activeSection="profile" /></>} />
        {/* <Route path="/dashboard/messages" element={<><Messages /><Taskbar activeSection="messages" /></>} />
        <Route path="/dashboard/profile" element={<><Profile /><Taskbar activeSection="profile" /></>} /> */}
      </Routes>
    </Router>
  );
}

export default App;
