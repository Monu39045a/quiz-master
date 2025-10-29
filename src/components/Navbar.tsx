import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../redux/store";
import { logout } from "../redux/userSlice";
import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { FaUserCircle } from "react-icons/fa";
import { IoArrowBack } from "react-icons/io5";

const Navbar: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { name, role } = useSelector((state: RootState) => state.user);

  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Handle logout
  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem("token");
    setMenuOpen(false);
    navigate("/login");
  };

  const handleBack = () => {
    navigate(-1); // Go back one step in history
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };

    if (menuOpen) {
      document.addEventListener("click", handleClickOutside);
    } else {
      document.removeEventListener("click", handleClickOutside);
    }

    return () => document.removeEventListener("click", handleClickOutside);
  }, [menuOpen]);

  const dashboardTitle =
    role === "trainer" ? "Trainer Dashboard" : "Participant Dashboard";

  // ✅ Hide back button on specific routes
  const hideBackButton =
    location.pathname === "/dashboard/participant" ||
    location.pathname === "/dashboard/trainer";

  return (
    <nav className="bg-gray-900 text-white p-4 flex justify-between items-center shadow-md relative z-50">
      <div className="flex items-center space-x-4">
        {!hideBackButton && (
          <button
            onClick={handleBack}
            className="flex items-center space-x-1 bg-gray-800 hover:bg-gray-700 px-3 py-1 rounded-md transition"
          >
            <IoArrowBack className="text-lg" />
            <span className="text-sm font-medium">Back</span>
          </button>
        )}
        <div className="text-lg font-semibold">{dashboardTitle}</div>
      </div>

      <div className="relative" ref={menuRef}>
        <button
          className="flex items-center space-x-2 focus:outline-none"
          onClick={() => setMenuOpen((prev) => !prev)}
        >
          <FaUserCircle className="text-2xl" />
        </button>

        <div
          className={`absolute right-0 mt-2 w-48 bg-white text-gray-800 rounded-lg shadow-lg z-50 transform transition-all duration-200 origin-top ${
            menuOpen
              ? "scale-100 opacity-100 visible"
              : "scale-95 opacity-0 invisible"
          }`}
        >
          <div className="px-4 py-2 border-b">
            <p className="text-sm text-gray-600">Signed in as</p>
            <p className="font-medium">{name || "User"}</p>
          </div>
          <button
            onClick={handleLogout}
            className="w-full text-left px-4 py-2 hover:bg-gray-100 transition"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
