import './App.css';
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
import Login from './Components/Login';


function App() {
  
  return (
      <BrowserRouter className="App">
        <Routes>
          <Route index element={<Login />}></Route>
        </Routes>
      </BrowserRouter>
  );
}

export default App;
