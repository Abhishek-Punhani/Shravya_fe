import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { io } from "socket.io-client";
//Pages
import Home from "./pages/home";
import Login from "./pages/login";
import Register from "./pages/register";
import { useSelector } from "react-redux";
import SocketContext from "./contexts/SocketContext";
function App() {
  const { user } = useSelector((state) => state.user);
  const { token } = user;
  const socket = io(process.env.REACT_APP_AUTH_ENDPOINT);
  return (
    <div className="dark">
      <SocketContext.Provider value={socket}>
        <Router>
          <Routes>
            <Route
              exact
              path="/"
              element={
                token ? <Home socket={socket} /> : <Navigate to="/login" />
              }
            />
            <Route
              exact
              path="/login"
              element={!token ? <Login /> : <Navigate to="/" />}
            />
            <Route
              exact
              path="/register"
              element={!token ? <Register /> : <Navigate to="/" />}
            />
          </Routes>
        </Router>
      </SocketContext.Provider>
    </div>
  );
}

export default App;
