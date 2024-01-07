import React from "react";
import './Header.css'; // Make sure to create a corresponding CSS file
import { Link } from "react-router-dom";
import { useAuth } from '../components/auth/AuthContext'; // Import your AuthContext
import { getAuth, signOut } from "firebase/auth"; // Import Firebase Authentication functions


const Header = () => {
  const { currentUser } = useAuth();

  const handleSignOut = async () => {
    const auth = getAuth();
    try {
      await signOut(auth);
      console.log("User signed out");
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  return (
    <div className="header-box">
      <div className="header-nav">
        <Link
          className="nav-link active"
          style={{ color: 'var(--text-color)'}}
          aria-current="page"
          to="/"
        >
          home
        </Link> |

        {currentUser ? (
          <div>
            <div className="dropdown">
              <button 
              style={{ color: 'var(--text-color)'}} 
              className="dropbtn" 
              tabIndex="0">
                area riservata
              </button>
                <div className="dropdown-content">
                  <Link 
                  className="nav-link active"
                  style={{ color: 'var(--text-color)'}}
                  aria-current="page"
                  to="/crea">crea</Link>
                  <Link 
                  className="nav-link active"
                  style={{ color: 'var(--text-color)'}}
                  aria-current="page"
                  to="/modifica">modifica</Link>
                  <button
                  className="button-dropdown"
                  onClick={handleSignOut}
                  >
                  esci
                </button>
              </div>
            </div>
          </div>
        ) : (
          <Link
          className="nav-link active"
          style={{ color: 'var(--text-color)'}}
          aria-current="page"
          to="/login"
        >login</Link>
        )}
      </div>
    </div>
  );
};

export default Header;