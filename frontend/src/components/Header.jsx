import React from 'react';
import { Link } from 'react-router-dom';

const Header = ({ user, onLogout }) => {
  return (
    <header className="bg-primary text-white p-3">
      <div className="container d-flex justify-content-between align-items-center">
        <h1>Simply Vegan</h1>
        <nav>
          <ul className="list-inline mb-0">
            <li className="list-inline-item"><Link to="/" className="text-white">Home</Link></li>
            {user && (
              <>
                <li className="list-inline-item"><Link to="/favorites" className="text-white">Favorites</Link></li>
                <li className="list-inline-item">
                  <button onClick={onLogout} className="btn btn-outline-light">Logout</button>
                </li>
              </>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;