import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { login } from "../redux/userSlice";

const useAuthInitializer = () => {
  const dispatch = useDispatch();
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
        const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");

    if (token && user) {
      const parsedUser = JSON.parse(user);
      dispatch(login(parsedUser));
    }
    setInitialized(true);
  }, [dispatch]);

  return initialized;
};

export default useAuthInitializer;
