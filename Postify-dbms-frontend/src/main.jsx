import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import {
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";
import Home from "./pages/Home.jsx";
import About from "./pages/About.jsx";
import SignUp from "./pages/SignUp.jsx";
import SignIn from "./pages/SignIn.jsx";
import { persistor, store } from "./redux/store.js";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import Profile from "./pages/Profile.jsx";
import PrivateRoute from "./components/PrivateRoute/privateroute.jsx";
import AddBlog from "./pages/AddBlog.jsx";
import EditBlog from "./pages/EditBlog.jsx";
import BlogPost from "./pages/BlogPost.jsx";
import PersonalPage from "./pages/PersonalPage.jsx";
import LandingPage from "./pages/LandingPage.jsx";

// const router = createBrowserRouter([{
//   path: "/",
//   element: <App />,
//   children: [{ path: "", element: <Home /> }, ],
// }]);

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>

      <Route path="/" element={<LandingPage />} />
      <Route path="/home" element={<Home />} />
      <Route path="about" element={<About />} />
      <Route path="signup" element={<SignUp />} />
      <Route path="signin" element={<SignIn />} />
      <Route path="blog/:blogId" element={<BlogPost />} />
      <Route element={<PrivateRoute />}>
        <Route path="profile" element={<Profile />} />
        <Route path="create-blog" element={<AddBlog />} />
        <Route path="personal-page" element={<PersonalPage />} />
        <Route path="edit-blog/:blogId" element={<EditBlog/>} />
      </Route>
    </Route>
  )
);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate persistor={persistor} loading={null}>
        <RouterProvider router={router} />
      </PersistGate>
    </Provider>
  </React.StrictMode>
);
