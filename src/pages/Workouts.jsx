import { useState } from 'react';
import WorkoutHistogram from './WorkoutHistogram'; // импортируй свой компонент гистограммы

// Формула для расчёта мощности
function calculatePower(weight, height, avgSpeed, k = 1.2) {
  if (!weight || !height || !avgSpeed) return null;
  return Math.round((k * weight * avgSpeed) / height * 100) / 100;
}

function WorkoutCard({ workout, onClick, onDelete }) {
  return (
    <div
      onClick={() => onClick(workout)}
      style={{
        cursor: 'pointer',
        background: '#fff',
        padding: 16,
        marginBottom: 12,
        borderRadius: 12,
        boxShadow: '0 2px 8px rgba(255,102,0,0.1)',
        border: '1px solid #ffe0cc',
        position: 'relative'
      }}
    >
      <button 
        onClick={(e) => {
          e.stopPropagation();
          onDelete(workout.id);
        }}
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
        {'\u00D7'}
      </button>
      <h3 style={{ margin: '0 0 8px 0', color: '#333', paddingRight: 30 }}>
        {workout.name}
      </h3>
      <div style={{ color: '#666', fontSize: 14, marginBottom: 8 }}>
        {workout.distance} - {workout.duration} - {workout.date}
      </div>
      {(workout.avg_power || workout.calories || workout.avg_heart_rate) && (
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
          {workout.avg_power && <div>Power: {workout.avg_power}</div>}
          {workout.calories && <div>Calories: {workout.calories}</div>}
          {workout.avg_heart_rate && <div>Heart Rate: {workout.avg_heart_rate}</div>}
          {workout.elevation && <div>Elevation: {workout.elevation}</div>}
        </div>
      )}
    </div>
  );
}

function WorkoutDetailsModal({ workout, userProfile, onClose }) {
  if (!workout) return null;
  const avgSpeed = parseFloat(workout.avg_speed || workout.distance) / (parseFloat(workout.duration) / 60);
const power = workout.avg_power ||
  calculatePower(userProfile.weight, userProfile.height, avgSpeed);

  return (
    <div className="modal" style={{
      position: 'fixed', left: 0, top: 0, right: 0, bottom: 0,
      background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
    }}>
      <div style={{ background: '#fff', padding: 24, borderRadius: 12, minWidth: 300 }}>
        <h2>{workout.name}</h2>
        <div>Дата: {workout.date}</div>
        <div>Время: {workout.duration}</div>
        <div>Дистанция: {workout.distance}</div>
        <div>Средняя скорость: {workout.avg_speed || (avgSpeed ? avgSpeed.toFixed(1) + ' км/ч' : '—')}</div>
        <div>Мощность: {power ? power + ' Вт' : '—'}</div>
        <button onClick={onClose} style={{ marginTop: 16 }}>Закрыть</button>
      </div>
    </div>
  );
}

function Workouts({ workouts, onDeleteWorkout, userProfile }) {
  const [selectedWorkout, setSelectedWorkout] = useState(null);
  const [showReport, setShowReport] = useState(false);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 16 }}>
        <button
          onClick={() => setShowReport(true)}
          style={{
            padding: '8px 20px',
            background: '#ff6600',
            color: '#fff',
            border: 'none',
            borderRadius: 8,
            fontWeight: 'bold',
            cursor: 'pointer',
            fontSize: 16
          }}
        >
          📊 Отчёт
        </button>
      </div>
      <h2>Мои тренировки</h2>
      {workouts.length === 0 ? (
        <div>Пока нет тренировок</div>
      ) : (
        workouts.map(workout => (
          <WorkoutCard
            key={workout.id}
            workout={workout}
            onClick={setSelectedWorkout}
            onDelete={onDeleteWorkout}
          />
        ))
      )}
      {selectedWorkout && (
        <WorkoutDetailsModal
          workout={selectedWorkout}
          userProfile={userProfile}
          onClose={() => setSelectedWorkout(null)}
        />
      )}
      {showReport && (
        <WorkoutHistogram
          workouts={workouts}
          onClose={() => setShowReport(false)}
        />
      )}
    </div>
  );
}

export default Workouts;
