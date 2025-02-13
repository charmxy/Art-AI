
import { Suspense,lazy } from "react"; 
import {
  BrowserRouter as Router,
  Navigate,
  Route,
  Routes
} from "react-router-dom";
import Layout from "@/layouts/Layout"; 

const Task = lazy(() => import("@/pages/task"));
function App() { 
  return (
    <Router>
      <Layout>
        <Suspense fallback={<div>Loading...</div>}>
          <Routes> 
            <Route path="/" element={<Task />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </Suspense>
      </Layout>
    </Router>
  );
}

export default App;
