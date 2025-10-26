import AppRoutes from "./routes/AppRoutes";
import useAuthInitializer from "./hooks/useAuthInitializer";

function App() {
  const initialized = useAuthInitializer();

  if (!initialized) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Loading...
      </div>
    );
  }
  return (
    <>
      <AppRoutes />
    </>
  );
}

export default App;
