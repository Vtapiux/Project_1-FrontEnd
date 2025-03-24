import { useNavigate } from 'react-router-dom';

function Home() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await fetch("http://localhost:8080/auth/accounts/logout", {
      method: "GET",
      credentials: "include", 
    });

    navigate("/login");
  };

  return (
    <div>
      <h1>Login succesful</h1>
      <p>Welcome to your session.</p>
      <button onClick={handleLogout}>Close session</button>
    </div>
  );
}

export default Home;
