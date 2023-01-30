import Regristration from "./pages/Regristration";
import {
  createBrowserRouter,
  RouterProvider,
  createRoutesFromElements,
  Route,
} from "react-router-dom";
import Login from "./pages/Login";
import { ToastContainer, toast } from "react-toastify";
import Home from "./pages/Home";
import RootLayout from "./components/RootLayout";
import Message from "./pages/Message";

let router = createBrowserRouter(
  createRoutesFromElements(
    <Route>
      <Route path="/" element={<Regristration />}></Route>
      <Route path="/login" element={<Login />}></Route>
      
      <Route path="/pachel" element={<RootLayout />}>
      <Route index element={<Home />}></Route>
      <Route path="message" element={<Message />}></Route>

      </Route>
    </Route>
  ) 
);

function App() {
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
