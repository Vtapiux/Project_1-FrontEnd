import { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

function CompleteProfile() {
  const { login, accountId, hasUserProfile } = useContext(AuthContext);
  const navigate = useNavigate();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [createdAt, setCreatedAt] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [profileCreated, setProfileCreated] = useState(false); // 👈 nuevo estado

  const handleCreateUser = async (e) => {
    e.preventDefault();

    const response = await fetch("http://localhost:8080/users", {
      method: 'POST',
      headers: { "Content-Type": "application/json" },
      credentials: 'include',
      body: JSON.stringify({
        firstName,
        lastName,
        email,
        createdAt,
        phone,
        account: { accountId }
      })
    });

    if (response.ok) {
      await login(); // actualiza sessionInfo y hasUserProfile
      setProfileCreated(true); // 👈 marca que ya se creó el perfil
    } else {
      setError("Error in creating the user profile.");
    }
  };

  // 👇 Solo redirige cuando ambas condiciones se cumplen
  useEffect(() => {
    if (hasUserProfile && profileCreated) {
      navigate("/home", { replace: true });
    }
  }, [hasUserProfile, profileCreated, navigate]);

  return (
    <div>
      <h2>Complete your profile</h2>
      <form onSubmit={handleCreateUser}>
        <input placeholder="Name" value={firstName} onChange={e => setFirstName(e.target.value)} required />
        <input placeholder="Last name" value={lastName} onChange={e => setLastName(e.target.value)} required />
        <input placeholder="Mail" value={email} onChange={e => setEmail(e.target.value)} required />
        <input placeholder="Date of creation" value={createdAt} onChange={e => setCreatedAt(e.target.value)} required />
        <input placeholder="Phone" value={phone} onChange={e => setPhone(e.target.value)} required />
        <button type="submit">Save profile</button>
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </form>
    </div>
  );
}

export default CompleteProfile;
