import Navbar from "../components/Navbar";

const TrainerDashboard = () => {
  return (
    <div>
      <Navbar />
      <div className="p-8">
        <h1 className="text-4xl font-bold mb-6">Trainer Dashboard</h1>
        <p>
          Welcome to the trainer dashboard! Here you can manage your quizzes and
          participants.
        </p>
      </div>
    </div>
  );
};

export default TrainerDashboard;
