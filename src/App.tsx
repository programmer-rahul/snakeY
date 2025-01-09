import { BrowserRouter, Route, Routes } from "react-router-dom";
import HomeScreen from "./pages/HomeScreen";
import SnakeGameScreen from "./pages/SnakeGameScreen";

const App = () => {
  return (
    <main>
      <BrowserRouter>
        <Routes>
          <Route index Component={HomeScreen} />
          <Route path="/play" Component={SnakeGameScreen} />
        </Routes>
      </BrowserRouter>
    </main>
  );
};
export default App;
