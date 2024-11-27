import "./App.css";
import FormPage from "./Pages/FormPage";

function App() {
  return (
    <div className="flex flex-col bg-gray-100  items-center">
      <h1 className=" text-4xl font-bold">Vehicle Booking Form</h1>
      <FormPage />
    </div>
  );
}

export default App;
