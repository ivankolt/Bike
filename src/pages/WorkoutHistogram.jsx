import { Bar } from 'react-chartjs-2';
import { Chart, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js';
import { useState } from 'react';

// Регистрация компонентов Chart.js
Chart.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

// Функция для подготовки данных
function getHistogramData(workouts, period = 'week') {
  const grouped = {};
  workouts.forEach(w => {
    const date = w.date;
    const km = parseFloat((w.distance || '').replace(/[^\d.]/g, '')) || 0;
    if (!grouped[date]) grouped[date] = 0;
    grouped[date] += km;
  });

  const today = new Date();
  let days = [];
  if (period === 'week') {
    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const key = d.toISOString().split('T')[0];
      days.push(key);
    }
  } else if (period === 'month') {
    for (let i = 29; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const key = d.toISOString().split('T')[0];
      days.push(key);
    }
  }
  const data = days.map(date => grouped[date] || 0);
  const total = data.reduce((sum, val) => sum + val, 0); // сумма км

  return {
    labels: days,
    data,
    total
  };
}

export default function WorkoutHistogram({ workouts, onClose }) {
  const [period, setPeriod] = useState('week');
  const { labels, data } = getHistogramData(workouts, period);

  const chartData = {
    labels,
    datasets: [
      {
        label: 'Километры за день',
        data,
        backgroundColor: 'rgba(255,102,0,0.7)',
        borderRadius: 8,
        borderSkipped: false,
      },
    ],
  };

  const options = {
    responsive: true,
    animation: {
      duration: 1000,
      easing: 'easeOutQuart'
    },
    plugins: {
      legend: { display: false },
      tooltip: { enabled: true }
    },
    scales: {
      x: {
        title: { display: true, text: 'Дата' },
        grid: { display: false }
      },
      y: {
        title: { display: true, text: 'Километры' },
        beginAtZero: true,
        grid: { color: '#ffe0cc' }
      }
    }
  };

  return (
    <div style={{
      position: 'fixed',
      left: 0, top: 0, right: 0, bottom: 0,
      background: 'rgba(0,0,0,0.4)',
      zIndex: 2000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <div style={{
        background: '#fff',
        borderRadius: 16,
        padding: 32,
        maxWidth: 700,
        width: '95%',
        boxShadow: '0 4px 24px rgba(0,0,0,0.15)',
        position: 'relative'
      }}>
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: 16,
            right: 16,
            background: '#ff6600',
            color: '#fff',
            border: 'none',
            borderRadius: '50%',
            width: 36,
            height: 36,
            fontSize: 20,
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
        >×</button>
        <h2 style={{ textAlign: 'center', color: '#ff6600', marginBottom: 24 }}>Отчёт по тренировкам</h2>
        <div style={{ display: 'flex', gap: 16, justifyContent: 'center', marginBottom: 16 }}>
          <button
            onClick={() => setPeriod('week')}
            style={{
              padding: '8px 16px',
              background: period === 'week' ? '#ff6600' : '#fff',
              color: period === 'week' ? '#fff' : '#ff6600',
              border: '2px solid #ff6600',
              borderRadius: 8,
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            Неделя
          </button>
          <button
            onClick={() => setPeriod('month')}
            style={{
              padding: '8px 16px',
              background: period === 'month' ? '#ff6600' : '#fff',
              color: period === 'month' ? '#fff' : '#ff6600',
              border: '2px solid #ff6600',
              borderRadius: 8,
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            Месяц
          </button>
        </div>
        <Bar data={chartData} options={options} />
      </div>
    </div>
  );
}
