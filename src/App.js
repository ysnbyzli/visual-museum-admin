import "antd/dist/antd.css";
import { BrowserRouter } from "react-router-dom";
import Container from "./components/layout/Container";
import Sidebar from "./components/navigation/Sidebar";

function App() {
  return (
    <div className="flex h-full">
      <BrowserRouter>
        <Sidebar />
        <Container />
      </BrowserRouter>
    </div>
  );
}

export default App;
