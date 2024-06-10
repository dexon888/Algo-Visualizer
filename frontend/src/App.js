import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import SortingVisualizer from './pages/SortingVisualizer';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/sorting" element={<SortingVisualizer />} />
      </Routes>
    </Router>
  );
}

export default App;
