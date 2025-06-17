import { useState } from 'react';

function Workouts() {
  const [workouts, setWorkouts] = useState([
    { id: 1, name: "Утренняя поездка", distance: "15 км", date: "2025-06-12" },
    { id: 2, name: "Вечерняя тренировка", distance: "22 км", date: "2025-06-11" },
  ]);

  const addWorkout = () => {
    const newWorkout = {
      id: Date.now(),
      name: `Тренировка ${workouts.length + 1}`,
      distance: "0 км",
      date: new Date().toISOString().split('T')[0]
    };
    setWorkouts([...workouts, newWorkout]);
  };

  return (
    <div>
      <h2 style={{ marginBottom: 20, color: '#ff6600' }}>Мои тренировки</h2>
      
      {workouts.length === 0 ? (
        <div style={{ textAlign: 'center', color: '#888', marginTop: 40 }}>
          Пока нет тренировок. Нажми "+" чтобы добавить первую!
        </div>
      ) : (
        <div>
          {workouts.map(workout => (
            <div key={workout.id} style={{
              background: '#fff',
              padding: 16,
              marginBottom: 12,
              borderRadius: 12,
              boxShadow: '0 2px 8px rgba(255,102,0,0.1)',
              border: '1px solid #ffe0cc'
            }}>
              <h3 style={{ margin: '0 0 8px 0', color: '#333' }}>{workout.name}</h3>
              <div style={{ color: '#666', fontSize: 14 }}>
                Дистанция: {workout.distance} • {workout.date}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Workouts;
