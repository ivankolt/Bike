import { useEffect, useState } from 'react';

function Profile({ userProfile, onSave }) {
  const [user, setUser] = useState(null);
  const [form, setForm] = useState({
    first_name: '',
    username: '',
    age: '',
    weight: '',
    height: ''
  });

  useEffect(() => {
    if (window.Telegram?.WebApp?.initDataUnsafe?.user) {
      const tgUser = window.Telegram?.WebApp?.initDataUnsafe?.user;
      setUser(tgUser);
      setForm({
        first_name: tgUser.first_name || '',
        username: tgUser.username || '',
        age: userProfile?.age || '',
        weight: userProfile?.weight || '',
        height: userProfile?.height || ''
      });
    } else {
      // Мок-данные для разработки вне Telegram
      setUser({
        id: 123456,
        first_name: "DemoUser",
        username: "demo_user"
      });
      setForm({
        first_name: userProfile?.first_name || 'DemoUser',
        username: userProfile?.username || 'demo_user',
        age: userProfile?.age || '',
        weight: userProfile?.weight || '',
        height: userProfile?.height || ''
      });
    }
  }, [userProfile]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(form);
  };

  let avatarUrl = null;
  if (form.username) {
    avatarUrl = `https://t.me/i/userpic/320/${form.username}.jpg`;
  }

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 350, margin: '40px auto' }}>
      <div style={{ textAlign: 'center' }}>
        {avatarUrl ? (
          <img
            src={avatarUrl}
            alt="avatar"
            style={{
              width: 96,
              height: 96,
              borderRadius: '50%',
              boxShadow: '0 4px 16px rgba(255,102,0,0.10)',
              marginBottom: 16,
              objectFit: 'cover'
            }}
          />
        ) : (
          <div
            style={{
              width: 96,
              height: 96,
              borderRadius: '50%',
              background: '#ffe0cc',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 42,
              color: '#ff6600',
              marginBottom: 16
            }}
          >
            {form.first_name?.[0] || 'U'}
          </div>
        )}
        <h2 style={{ margin: 0 }}>{form.first_name || 'Гость'}</h2>
        <div style={{ color: '#888', marginTop: 6 }}>@{form.username || 'no_username'}</div>
        <div style={{ marginTop: 16, color: '#aaa', fontSize: 14 }}>
          Telegram ID: {user?.id || '—'}
        </div>
      </div>

      <div style={{ marginTop: 24 }}>
        <label style={{ display: 'block', marginBottom: 6, fontWeight: 'bold' }}>Имя</label>
        <input
          type="text"
          name="first_name"
          value={form.first_name}
          onChange={handleChange}
          style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #ccc' }}
          required
        />
      </div>

      <div style={{ marginTop: 16 }}>
        <label style={{ display: 'block', marginBottom: 6, fontWeight: 'bold' }}>Username</label>
        <input
          type="text"
          name="username"
          value={form.username}
          onChange={handleChange}
          style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #ccc' }}
        />
      </div>

      <div style={{ marginTop: 16 }}>
        <label style={{ display: 'block', marginBottom: 6, fontWeight: 'bold' }}>Возраст</label>
        <input
          type="number"
          name="age"
          value={form.age}
          onChange={handleChange}
          style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #ccc' }}
          min={0}
        />
      </div>

      <div style={{ marginTop: 16 }}>
        <label style={{ display: 'block', marginBottom: 6, fontWeight: 'bold' }}>Вес (кг)</label>
        <input
          type="number"
          name="weight"
          value={form.weight}
          onChange={handleChange}
          style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #ccc' }}
          min={1}
        />
      </div>

      <div style={{ marginTop: 16 }}>
        <label style={{ display: 'block', marginBottom: 6, fontWeight: 'bold' }}>Рост (см)</label>
        <input
          type="number"
          name="height"
          value={form.height}
          onChange={handleChange}
          style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #ccc' }}
          min={50}
        />
      </div>

      <button
        type="submit"
        style={{
          marginTop: 24,
          width: '100%',
          padding: 12,
          backgroundColor: '#ff6600',
          color: 'white',
          border: 'none',
          borderRadius: 6,
          fontWeight: 'bold',
          cursor: 'pointer'
        }}
      >
        Сохранить
      </button>
    </form>
  );
}

export default Profile;
