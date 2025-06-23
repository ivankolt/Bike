import { useState } from 'react';

function WorkoutCard({ workout, onDelete }) {
  return (
    <div style={{
      background: '#fff',
      padding: 16,
      marginBottom: 12,
      borderRadius: 12,
      boxShadow: '0 2px 8px rgba(255,102,0,0.1)',
      border: '1px solid #ffe0cc',
      position: 'relative'
    }}>
      <button 
        onClick={() => onDelete(workout.id)}
        style={{
          position: 'absolute',
          top: 8,
          right: 8,
          background: '#ff4444',
          color: 'white',
          border: 'none',
          borderRadius: '50%',
          width: 24,
          height: 24,
          fontSize: 12,
          cursor: 'pointer'
        }}
      >
        ×
      </button>
      
      <h3 style={{ margin: '0 0 8px 0', color: '#333', paddingRight: 30 }}>
        {workout.name}
      </h3>
      
      <div style={{ color: '#666', fontSize: 14, marginBottom: 8 }}>
        🚴 {workout.distance} • ⏱️ {workout.duration} • 📅 {workout.date}
      </div>
      
      {/* Дополнительные показатели */}
      {(workout.avgPower || workout.calories || workout.avgHeartRate) && (
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', 
          gap: 8,
          fontSize: 12,
          color: '#888',
          marginTop: 8,
          paddingTop: 8,
          borderTop: '1px solid #f0f0f0'
        }}>
          {workout.avgPower && <div>⚡ {workout.avgPower}</div>}
          {workout.calories && <div>🔥 {workout.calories}</div>}
          {workout.avgHeartRate && <div>❤️ {workout.avgHeartRate}</div>}
          {workout.elevation && <div>⛰️ {workout.elevation}</div>}
        </div>
      )}
    </div>
  );
}
function Workouts({ workouts, onDeleteWorkout }) {
  return (
    <div>
      <h2>Мои тренировки</h2>
      {workouts.length === 0 ? (
        <div>Пока нет тренировок</div>
      ) : (
        workouts.map(workout => (
          <WorkoutCard key={workout.id} workout={workout} onDelete={onDeleteWorkout} />
        ))
      )}
    </div>
  );
}
    

export default Workouts;
