import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "../pages/Login";
import Register from "../pages/Register";
import ProtectedRoutes from "./ProtectedRoutes";
import TrainerDashboard from "../pages/TrainerDashboard";
import ParticipantDashboard from "../pages/ParticipantDashboard";
import ResultsPage from "../pages/Results";
import QuizPage from "../pages/QuizPage";

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Routes - Placeholder */}
        <Route
          path="/dashboard/trainer"
          // element={<div>Trainer Dashboard Page (Protected)</div>}
          element={
            <ProtectedRoutes allowedRoles={["trainer"]}>
              <TrainerDashboard />
            </ProtectedRoutes>
          }
        />
        <Route
          path="/dashboard/participant"
          // element={<div>Participant Dashboard Page (Protected)</div>}
          element={
            <ProtectedRoutes allowedRoles={["participant"]}>
              <ParticipantDashboard />
            </ProtectedRoutes>
          }
        />

        <Route
          path="/quiz/take/:quizId"
          element={
            <ProtectedRoutes allowedRoles={["participant"]}>
              <QuizPage />
            </ProtectedRoutes>
          }
        />

        <Route
          path="/quiz/:quizId/results"
          element={
            <ProtectedRoutes allowedRoles={["trainer"]}>
              <ResultsPage />
            </ProtectedRoutes>
          }
        />

        {/* Fallbacks */}
        <Route path="/unauthorized" element={<div>Unauthorized Access</div>} />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
