// src/components/Login.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Login() {
    
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();

    const res = await fetch("http://localhost:8080/auth/accounts/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include", 
      body: JSON.stringify({ username, password }),
    });

    const data = await res.json();

    if (data["account: "]) {
      console.log("Login exitoso");
      navigate("/home");
    } else {
      setError(data["error: "] || "Invalid credentials from front");
    }
  };

  return (
    <div>
      <h2>Log in</h2>
      <form onSubmit={handleLogin}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        /><br/>
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        /><br/>
        <button type="submit">Login</button>
      </form>
      {error && <p style={{color: "red"}}>{error}</p>}
    </div>
  );
}

export default Login;
