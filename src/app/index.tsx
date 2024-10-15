import { BrowserRouter, Route, Routes } from "react-router-dom";
import { RequestSignPermissions } from "../pages/request-sign-permissions";
import { GetTokenPermissions } from "../pages/get-token-permissions";
import { Index } from "../pages";

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<Index></Index>}></Route>
        <Route
          path="/get_token_permissions"
          element={<GetTokenPermissions></GetTokenPermissions>}
        ></Route>
        <Route
          path="/request_sign_permissions/*"
          element={<RequestSignPermissions></RequestSignPermissions>}
        ></Route>
      </Routes>
    </BrowserRouter>
  );
}
