import Navbar from "../components/Navbar";

const ParticipantDashboard = () => {
  return (
    <div>
      <Navbar />
      <div className="p-8">
        <h1 className="text-4xl font-bold mb-6">Participant Dashboard</h1>
        <p>
          Welcome to the participant dashboard! Here you can view your quizzes
          and results.
        </p>
      </div>
    </div>
  );
};

export default ParticipantDashboard;
