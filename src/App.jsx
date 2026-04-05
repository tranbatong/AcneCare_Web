import { Routes, Route } from "react-router-dom";
import LandingPage from "./pages/landing";
import LoginPage from "./pages/login/LoginPage";
import RegisterStep1 from "./pages/register/RegisterStep1";
import RegisterStep2 from "./pages/register/RegisterStep2";
import ProfilePage from "./pages/profile/ProfilePage";
import RegisterPage from "./pages/register/RegisterPage";
import ViewPostPage from "./pages/posts/ViewPostPage";
import CreatePostPage from "./pages/posts/CreatePostPage";
import EditPostPage from "./pages/posts/EditPostPage";
import AcnePrediction from "./pages/acne-prediction/AcnePrediction";
import AcneHistoryList from "./pages/acne-prediction/AcneHistoryList";
import AcneHistoryDetail from "./pages/acne-prediction/AcneHistoryDetail";
import Admin from "./pages/admin/admin";

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterStep1 />} />
      <Route path="/register/profile" element={<RegisterStep2 />} />
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/posts/create" element={<CreatePostPage />} />
      <Route path="/posts/:postId/edit" element={<EditPostPage />} />
      <Route path="/posts/:postId?" element={<ViewPostPage />} />
      <Route path="/phan-tich" element={<AcnePrediction />} />
      <Route path="/lich-su" element={<AcneHistoryList />} />
      <Route path="/lich-su/:id" element={<AcneHistoryDetail />} />
      <Route path="/admin/*" element={<Admin />} />
    </Routes>
  );
}

export default App;
