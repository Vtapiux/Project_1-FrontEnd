import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

function Home() {
  const { user, role, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await fetch("http://localhost:8080/auth/accounts/logout", {
      method: "GET",
      credentials: "include", 
    });
    logout();
    navigate("/login");
  };
  console.log(" USER desde Home:", user);
  console.log(" ROLE desde Home:", role);
  
  if (!user || !role) {
    return <p style={{ textAlign: 'center' }}>loading user...</p>;
  }

  return (
    <div>
      <h1>Hola 🥵, {user?.firstName}</h1>
      <p>Tu rol es: {user?.account?.role?.roleName}</p>

      {role === 2 && (
        <div>
          <p>Esta sección solo la ven los MANAGERS</p>
        </div>
      )}

      {role === 1 && (
        <div>
          <p>Esta sección solo la ven los USUARIOS NORMALES</p>
        </div>
      )}

      <button onClick={handleLogout}>Log out</button>
    </div>
  );
}

export default Home;
