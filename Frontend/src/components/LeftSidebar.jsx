import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Card, CardBody, ListGroup, ListGroupItem } from "reactstrap";
import {
  Home,
  User,
  Settings,
  LogOut,
  Bell,
  MessageSquare,
  BarChart,
  Calendar,
  HelpCircle,
} from "lucide-react";

const LeftSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { icon: <Home size={18} />, label: "Home", path: "/" },
    { icon: <User size={18} />, label: "Profile", path: "/home /profile" },
    { icon: <MessageSquare size={18} />, label: "Messages", path: "/messages" },
    { icon: <Bell size={18} />, label: "Notifications", path: "/notifications" },
    { icon: <BarChart size={18} />, label: "Analytics", path: "/analytics" },
    { icon: <Calendar size={18} />, label: "Events", path: "/events" },
  ];

  const settingsItems = [
    { icon: <Settings size={18} />, label: "Settings", path: "/settings" },
    { icon: <HelpCircle size={18} />, label: "Support", path: "/support" },
    { icon: <LogOut size={18} />, label: "Logout", path: "/logout" },
  ];

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <div
      style={{
        width: "18%",
        position: "fixed",
        top: 0,
        left: 0,
        height: "100vh",
        background: "linear-gradient(180deg, #0061ff, #60efff)",
        color: "#fff",
        padding: "25px 15px",
        boxShadow: "4px 0 12px rgba(0,0,0,0.2)",
        overflowY: "auto",
      }}
    >
      <h3
        style={{
          textAlign: "center",
          marginBottom: "35px",
          fontWeight: "800",
          letterSpacing: "1px",
          color: "#f8f9ff",
        }}
      >
        Solution Hub
      </h3>

      <Card
        style={{
          background: "rgba(255,255,255,0.1)",
          border: "none",
          borderRadius: "15px",
          boxShadow: "inset 0 0 10px rgba(255,255,255,0.1)",
        }}
      >
        <CardBody style={{ padding: "0" }}>
          <ListGroup flush>
            {navItems.map((item, index) => (
              <ListGroupItem
                key={index}
                onClick={() => handleNavigation(item.path)}
                style={{
                  background:
                    location.pathname === item.path
                      ? "rgba(255,255,255,0.3)"
                      : "transparent",
                  border: "none",
                  color: "#eaf6ff",
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  padding: "12px 14px",
                  borderRadius: "10px",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  fontWeight: "500",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "rgba(255,255,255,0.25)";
                  e.currentTarget.style.transform = "translateX(5px)";
                }}
                onMouseLeave={(e) => {
                  if (location.pathname !== item.path)
                    e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.transform = "translateX(0)";
                }}
              >
                {item.icon}
                <span>{item.label}</span>
              </ListGroupItem>
            ))}
          </ListGroup>

          {/* Divider */}
          <hr
            style={{
              border: "0",
              height: "1px",
              background: "rgba(255,255,255,0.3)",
              margin: "18px 0",
            }}
          />

          {/* Settings Section */}
          <ListGroup flush>
            {settingsItems.map((item, index) => (
              <ListGroupItem
                key={index}
                onClick={() => handleNavigation(item.path)}
                style={{
                  background:
                    location.pathname === item.path
                      ? "rgba(255,255,255,0.3)"
                      : "transparent",
                  border: "none",
                  color: "#eaf6ff",
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  padding: "12px 14px",
                  borderRadius: "10px",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  fontWeight: "500",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "rgba(255,255,255,0.25)";
                  e.currentTarget.style.transform = "translateX(5px)";
                }}
                onMouseLeave={(e) => {
                  if (location.pathname !== item.path)
                    e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.transform = "translateX(0)";
                }}
              >
                {item.icon}
                <span>{item.label}</span>
              </ListGroupItem>
            ))}
          </ListGroup>
        </CardBody>
      </Card>

      <div
        style={{
          position: "absolute",
          bottom: "20px",
          width: "85%",
          textAlign: "center",
          fontSize: "12px",
          color: "rgba(255,255,255,0.8)",
          fontWeight: "400",
        }}
      >
        © 2025 Solution Hub
      </div>
    </div>
  );
};

export default LeftSidebar;
