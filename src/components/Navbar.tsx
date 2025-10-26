import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../redux/store";
import { logout } from "../redux/userSlice";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { FaUserCircle } from "react-icons/fa";

const Logout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { name, role } = useSelector((state: RootState) => state.user);

  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem("token");
    navigate("/login");
  };

  const dashboardTitle =
    role === "trainer" ? "Trainer Dashboard" : "Participant Dashboard";
  return (
    <nav className="bg-gray-900 text-white p-4 flex justify-between items-center shadow-md">
      <div className="text-lg font-semibold">{dashboardTitle}</div>
      <div className="relative">
        <button
          className="flex items-center space-x-2 focus:outline-none"
          onClick={() => setMenuOpen((prev) => !prev)}
        >
          <FaUserCircle className="text-2xl" />
        </button>

        {menuOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-white text-gray-800 rounded-lg shadow-lg">
            <div className="px-4 py-2 border-b">
              <p className="text-sm text-gray-600">Signed in as</p>
              <p className="font-medium">{name || "User"}</p>
            </div>
            <button
              onClick={handleLogout}
              className="w-full text-left px-4 py-2 hover:bg-gray-100"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Logout;
