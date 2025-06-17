import { useState } from 'react';
import Header from './components/Header';
import Tabs from './components/Tabs';
import FloatingButton from './components/FloatingButton';
import './App.css';
import Profile from './pages/Profile';
import Workouts from './pages/Workouts';

function App() {
  const [tab, setTab] = useState('profile');
  const [workoutsRef, setWorkoutsRef] = useState(null);

   const handleAddWorkout = () => {
    if (tab === 'workouts' && workoutsRef) {
      workoutsRef.addWorkout();
    } else {
      alert('Добавление тренировки');
    }
  }

  const renderContent = () => {
    switch (tab) {
      case 'profile':
        return <Profile />;
      case 'workouts':
        return <Workouts ref={setWorkoutsRef} />;
      case 'competitions':
        return <div>Список соревнований</div>;
      case 'rating':
        return <div>Общий рейтинг</div>;
      default:
        return null;
    }
  };

  const showFab = tab === 'workouts' || tab === 'competitions';

  return (
      <>
        <Header />
        <div className="main-layout">
          <Tabs current={tab} onChange={setTab} />
          <div className="content">
            {renderContent()}
          </div>
        </div>
        {showFab && <FloatingButton onClick={handleAddWorkout} />}
      </>
    );
  
}

export default App;
