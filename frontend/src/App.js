// import React, { useEffect, useState } from 'react';

// function App() {
//   const [backendData, setBackendData] = useState(null);

//   useEffect(() => {
//     fetch("/api")
//       .then(response => response.json())
//       .then(data => {
//         setBackendData(data);
//       });
//   }, []);

//   return (
//     <div>
//       {backendData === null ? (
//         <p>Loading...</p>
//       ) : (
//         backendData.users.map((user, i) => (
//           <p key={i}>{user}</p>
//         ))
//       )}
//     </div>
//   );
// }

// export default App;

import React from 'react'; 
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import MainPage from './pages/main';
import Profile from './pages/profile';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/profile" element={<Profile />} />
        <Route path="/" element={<MainPage />} />
      </Routes>
    </Router>
  );
};

export default App;



