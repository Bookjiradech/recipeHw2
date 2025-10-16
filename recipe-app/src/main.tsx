import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { store } from "./store/store";
import { Provider } from "react-redux";

import Home from "./routes/Home";
import About from "./routes/About";
import Favorites from "./routes/Favorites";
import MenuDetails from "./routes/MenuDetail";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <Home /> },
      { path: "menu/:id", element: <MenuDetails /> },
      { path: "about", element: <About /> },
      { path: "favorites", element: <Favorites /> },
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </StrictMode>
);
