import { useNavigate } from "react-router-dom";
import { Button } from "reactstrap";
import { FaHome, FaUserFriends, FaPen, FaEnvelope, FaUser } from "react-icons/fa";

const Taskbar = ({ activeSection }) => {
  const navigate = useNavigate();

  const handleClick = (route) => {
    navigate(route);
  };

  return (
    <div style={{ display: "flex", justifyContent: "space-around", padding: "0.5rem", borderTop: "1px solid #ccc", position: "fixed", bottom: 0, width: "100%", background: "#fff" }}>
      <Button color={activeSection === "home" ? "primary" : "light"} onClick={() => handleClick("/dashboard")}>
        <FaHome size={20} />
        <div style={{ fontSize: "12px" }}>Home</div>
      </Button>

      <Button color={activeSection === "friends" ? "primary" : "light"} onClick={() => handleClick("/dashboard/friends")}>
        <FaUserFriends size={20} />
        <div style={{ fontSize: "12px" }}>Friends</div>
      </Button>

      <Button color={activeSection === "post" ? "primary" : "light"} onClick={() => handleClick("/dashboard/posts")}>
        <FaPen size={20} />
        <div style={{ fontSize: "12px" }}>Post</div>
      </Button>

      <Button color={activeSection === "messages" ? "primary" : "light"} onClick={() => handleClick("/dashboard/messages")}>
        <FaEnvelope size={20} />
        <div style={{ fontSize: "12px" }}>Messages</div>
      </Button>

      <Button color={activeSection === "profile" ? "primary" : "light"} onClick={() => handleClick("/dashboard/profile")}>
        <FaUser size={20} />
        <div style={{ fontSize: "12px" }}>Profile</div>
      </Button>
    </div>
  );
};

export default Taskbar;
