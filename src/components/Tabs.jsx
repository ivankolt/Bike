import { FaUser, FaBiking, FaTrophy, FaMedal } from "react-icons/fa";

const tabList = [
  { name: 'Профиль', key: 'profile', icon: <FaUser /> },
  { name: 'Тренировки', key: 'workouts', icon: <FaBiking /> },
  { name: 'Соревнования', key: 'competitions', icon: <FaTrophy /> },
  { name: 'Рейтинг', key: 'rating', icon: <FaMedal /> },
];

export default function Tabs({ current, onChange }) {
  return (
    <div className="sidebar">
      {tabList.map(tab => (
        <button
          key={tab.key}
          className={`tab${current === tab.key ? ' active' : ''}`}
          onClick={() => onChange(tab.key)}
        >
          {tab.icon}
          <span className="tab-name">{tab.name}</span>
        </button>
      ))}
    </div>
  );
}
