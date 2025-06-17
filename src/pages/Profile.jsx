import { useEffect, useState } from 'react';

function Profile() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (window.Telegram?.WebApp?.initDataUnsafe?.user) {
      setUser(window.Telegram.WebApp.initDataUnsafe.user);
    } else {
      // Мок-данные для разработки вне Telegram
      setUser({
        id: 123456,
        first_name: "DemoUser",
        username: "demo_user"
      });
    }
  }, []);

  let avatarUrl = null;
  if (user?.username) {
    avatarUrl = `https://t.me/i/userpic/320/${user.username}.jpg`;
  }

  return (
    <div style={{ textAlign: 'center', marginTop: 40 }}>
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
          {user?.first_name?.[0] || 'U'}
        </div>
      )}
      <h2 style={{ margin: 0 }}>{user?.first_name || 'Гость'}</h2>
      <div style={{ color: '#888', marginTop: 6 }}>
        @{user?.username || 'no_username'}
      </div>
      <div style={{ marginTop: 16, color: '#aaa', fontSize: 14 }}>
        Telegram ID: {user?.id}
      </div>
    </div>
  );
}

export default Profile;
