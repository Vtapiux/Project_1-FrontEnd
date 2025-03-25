import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

function Register() {
  const { login, authStatus } = useContext(AuthContext); 
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    role: { roleId: 1 }
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [pendingRedirect, setPendingRedirect] = useState(false); 
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const response = await fetch("http://localhost:8080/auth/accounts/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(formData)
    });

    let data;
    try {
      data = await response.json();
    } catch (err) {
      const text = await response.text();
      console.error("Respuesta no JSON:", text);
      setError(text || "Respuesta no válida del servidor");
      return;
    }

    if (data["account: "]) {
      setSuccess("Account created successfully.");
    
      const loginRes = await fetch("http://localhost:8080/auth/accounts/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify({
          username: formData.username,
          password: formData.password
        })
      });
    
      if (loginRes.ok) {
        await login(); 
        setPendingRedirect(true); 
      } else {
        setError("Login authentication failed.");
      }
    }
  };

  useEffect(() => {
    if (authStatus === 'authenticated' && pendingRedirect) {
      navigate("/complete-profile");
    }
  }, [authStatus, pendingRedirect, navigate]);

  return (
    <div>
      <h2>Register</h2>
      <form onSubmit={handleRegister}>
        <input
          type="text"
          name="username"
          placeholder="Name of user"
          value={formData.username}
          onChange={handleChange}
          required
        /><br />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
        /><br />
        <button type="submit">Register</button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}
    </div>
  );
}

export default Register;
