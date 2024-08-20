import React, { useState } from 'react';
import Modal from './Modal';
import './App.css';

const App: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="App">
      <button className="save-segment-btn" onClick={() => setIsOpen(true)}>
        Save segment
      </button>
      {isOpen && <Modal onClose={() => setIsOpen(false)} />}
    </div>
  );
};

export default App;


