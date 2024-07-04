import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { routeMap } from './routes/routeMap';

const App: React.FC = () => {
  return (
    <Router>
      <div className="App">
        <Routes>
          {Object.values(routeMap).map(route => (
            <Route key={route.id} path={route.path} element={<route.component />} />
          ))}
        </Routes>
      </div>
    </Router>
  );
};

export default App;
