import { BrowserRouter, Routes, Route } from "react-router-dom";
import EmployeeList from "./components/EmployeeList";
import CreateEmployee from "./components/CreateEmployee";
import ViewEmployee from "./components/ViewEmployee";
import EditEmployee from "./components/EditEmployee";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<EmployeeList />} />
        <Route path="/create" element={<CreateEmployee />} />
        <Route path="/view/:id" element={<ViewEmployee />} />
        <Route path="/edit/:id" element={<EditEmployee />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
