import { BrowserRouter, Route, Routes } from "react-router-dom";
import GameHomeScreen from "./components/snake/GameHomeScreen";
import GamePlayBoard from "./components/snake/GamePlayBoard";

const App = () => {
  return (
    <main>
      <BrowserRouter>
        <Routes>
          <Route index Component={GameHomeScreen} />
          <Route path="/play" Component={GamePlayBoard} />
        </Routes>
      </BrowserRouter>
    </main>
  );
};
export default App;
