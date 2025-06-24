import { useState } from 'react';
import Header from './components/Header';
import Tabs from './components/Tabs';
import FloatingButton from './components/FloatingButton';
import './App.css';
import Profile from './pages/Profile';
import Workouts from './pages/Workouts';
import { supabase } from './supabaseClient';
import { upsertUserProfile } from './supabaseApi';
import { insertWorkout } from './supabaseApi';

import { useEffect } from 'react';



function App() {
  const [tab, setTab] = useState('profile');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [workouts, setWorkouts] = useState([]);
  const [userProfile, setUserProfile] = useState({
    first_name: '',
    username: '',
    age: '',
    weight: '',
    height: '',
    telegram_id: ''
  });
  useEffect(() => {
    if (window.Telegram && window.Telegram.WebApp) {
      window.Telegram.WebApp.ready();
      const tgUser = window.Telegram.WebApp.initDataUnsafe?.user;
      if (tgUser) {
        setUserProfile(prev => ({
          ...prev,
          first_name: tgUser.first_name || '',
          username: tgUser.username || '',
          telegram_id: tgUser.id || ''
        }));
      }
    }
  }, []);

  const handleAddWorkout = () => {
    setShowCreateModal(true);
  };
  const handleSaveProfile = async (profile) => {
  try {
    // telegram_id можно брать из userProfile или из profile, оба варианта ок
    const profileWithId = { ...profile, telegram_id: userProfile.telegram_id };
    const savedProfile = await upsertUserProfile(profileWithId);
    setUserProfile(savedProfile);
    alert('Профиль сохранён!');
  } catch (err) {
    alert('Ошибка сохранения профиля: ' + err.message);
  }
};
  

 const addWorkout = async (newWorkout) => {
  try {
    if (!userProfile?.id) {
      alert('Сначала сохраните профиль!');
      return;
    }
    const workout = {
      ...newWorkout,
      user_id: userProfile.id // обязательно для связи с пользователем
    };
    const savedWorkout = await insertWorkout(workout);
    setWorkouts([...workouts, savedWorkout]);
    setShowCreateModal(false);
  } catch (err) {
    alert('Ошибка сохранения тренировки: ' + err.message);
  }
};

  const deleteWorkout = (id) => {
    setWorkouts(workouts.filter(workout => workout.id !== id));
  };

  const renderContent = () => {
    switch (tab) {
      case 'profile':
      return <Profile userProfile={userProfile} onSave={handleSaveProfile} />;
      case 'workouts':
        return (
          <Workouts
            workouts={workouts}
            onDeleteWorkout={deleteWorkout}
            userProfile={userProfile}
          />
        );
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
      
      {/* Модальное окно создания тренировки */}
      {showCreateModal && (
        <CreateWorkoutModal 
          onClose={() => setShowCreateModal(false)}
          onSave={addWorkout}
        />
      )}
    </>
  );
}
// Компонент модального окна с выбором способа создания
function CreateWorkoutModal({ onClose, onSave }) {
  const [creationMode, setCreationMode] = useState('manual'); // 'manual' или 'file'
  const [newWorkout, setNewWorkout] = useState({
    name: '',
    distance: '',
    duration: '',
    date: new Date().toISOString().split('T')[0],
    // Дополнительные поля для файловой загрузки
    avgPower: '',
    maxPower: '',
    avgHeartRate: '',
    maxHeartRate: '',
    calories: '',
    elevation: '',
    avgSpeed: '',
    maxSpeed: ''
  });

  const [uploadedFile, setUploadedFile] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const newWorkoutClear = {
  name: '',
  distance: '',
  duration: '',
  date: new Date().toISOString().split('T')[0],
  avgPower: '',
  maxPower: '',
  avgHeartRate: '',
  maxHeartRate: '',
  calories: '',
  elevation: '',
  avgSpeed: '',
  maxSpeed: ''
};

  const handleSave = async () => {
  setIsProcessing(true);
  try {
    await addWorkout(newWorkout); // addWorkout должен быть асинхронной функцией, сохраняющей в Supabase
    // Можно сбросить форму или закрыть модалку
    setNewWorkout(newWorkoutClear);
    onClose();
  } catch (err) {
    alert('Ошибка сохранения: ' + err.message);
  } finally {
    setIsProcessing(false);
  }
};


 return (
  <div style={{
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0,0,0,0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000
  }}>
    <div style={{
      background: 'white',
      padding: 24,
      borderRadius: 16,
      width: '90%',
      maxWidth: 500,
      maxHeight: '90vh',
      overflowY: 'auto',
      boxShadow: '0 4px 20px rgba(0,0,0,0.3)'
    }}>
      <h3 style={{ margin: '0 0 20px 0', color: '#ff6600' }}>Новая тренировка</h3>
      
      {/* Переключатель режима создания */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
          <button
            type="button"
            onClick={() => setCreationMode('manual')}
            style={{
              flex: 1,
              padding: 12,
              border: '2px solid #ff6600',
              background: creationMode === 'manual' ? '#ff6600' : 'white',
              color: creationMode === 'manual' ? 'white' : '#ff6600',
              borderRadius: 8,
              fontSize: 14,
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            📝 Ручной ввод
          </button>
          <button
            type="button"
            onClick={() => setCreationMode('file')}
            style={{
              flex: 1,
              padding: 12,
              border: '2px solid #ff6600',
              background: creationMode === 'file' ? '#ff6600' : 'white',
              color: creationMode === 'file' ? 'white' : '#ff6600',
              borderRadius: 8,
              fontSize: 14,
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            📁 Загрузить файл
          </button>
        </div>
      </div>

      <form
        onSubmit={e => {
          e.preventDefault();
          if (!newWorkout.name || !newWorkout.distance || isProcessing) return;
          handleSave();
        }}
      >
        {creationMode === 'file' ? (
          <FileUploadSection 
            uploadedFile={uploadedFile}
            setUploadedFile={setUploadedFile}
            newWorkout={newWorkout}
            setNewWorkout={setNewWorkout}
            isProcessing={isProcessing}
            setIsProcessing={setIsProcessing}
          />
        ) : (
          <ManualInputSection 
            newWorkout={newWorkout}
            setNewWorkout={setNewWorkout}
          />
        )}

        {/* Кнопки управления */}
        <div style={{ display: 'flex', gap: 12, marginTop: 20 }}>
          <button
            type="button"
            onClick={onClose}
            style={{
              flex: 1,
              padding: 12,
              border: '2px solid #ff6600',
              background: 'white',
              color: '#ff6600',
              borderRadius: 8,
              fontSize: 16,
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            Отмена
          </button>
          <button
            type="submit"
            disabled={!newWorkout.name || !newWorkout.distance || isProcessing}
            style={{
              flex: 1,
              padding: 12,
              border: 'none',
              background: (newWorkout.name && newWorkout.distance && !isProcessing) ? '#ff6600' : '#ccc',
              color: 'white',
              borderRadius: 8,
              fontSize: 16,
              cursor: (newWorkout.name && newWorkout.distance && !isProcessing) ? 'pointer' : 'not-allowed',
              fontWeight: 'bold'
            }}
          >
            {isProcessing ? 'Обработка...' : 'Создать'}
          </button>
        </div>
      </form>
    </div>
  </div>
);

}


function FileUploadSection({ uploadedFile, setUploadedFile, newWorkout, setNewWorkout, isProcessing, setIsProcessing }) {
  const [dragActive, setDragActive] = useState(false);

  const handleFileChange = (file) => {
    if (file) {
      setUploadedFile(file);
      processFile(file);
    }
  };

  const processFile = async (file) => {
    setIsProcessing(true);
    
    try {
      const fileExtension = file.name.split('.').pop().toLowerCase();
      
      if (fileExtension === 'fit') {
        await processFitFile(file);
      } else if (fileExtension === 'gpx') {
        await processGpxFile(file);
      } else if (fileExtension === 'tcx') {
        await processTcxFile(file);
      } else if (fileExtension === 'json') {
        await processJsonFile(file);
      } else {
        alert('Поддерживаемые форматы: .fit, .gpx, .tcx, .json');
        setUploadedFile(null);
      }
    } catch (error) {
      console.error('Ошибка обработки файла:', error);
      alert('Ошибка при обработке файла');
      setUploadedFile(null);
    } finally {
      setIsProcessing(false);
    }
  };

  const processFitFile = async (file) => {
    // Здесь будет логика обработки .fit файлов
    // Можно использовать библиотеку fit-decoder
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        // Примерная обработка FIT файла
        const arrayBuffer = e.target.result;
        // const fitData = fitDecoder.fit2json(arrayBuffer);
        // const parsedData = fitDecoder.parseRecords(fitData);
        
        // Пока заполним тестовыми данными
        setNewWorkout(prev => ({
          ...prev,
          name: file.name.replace('.fit', ''),
          distance: '25.3 км',
          duration: '68 мин',
          avgPower: '245 Вт',
          maxPower: '420 Вт',
          avgHeartRate: '145 уд/мин',
          maxHeartRate: '178 уд/мин',
          calories: '856 ккал',
          elevation: '450 м',
          avgSpeed: '22.4 км/ч',
          maxSpeed: '54.2 км/ч'
        }));
      } catch (error) {
        console.error('Ошибка парсинга FIT файла:', error);
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const processGpxFile = async (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const gpxContent = e.target.result;
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(gpxContent, 'text/xml');
        
        // Извлекаем данные из GPX
        const trackPoints = xmlDoc.getElementsByTagName('trkpt');
        const name = xmlDoc.getElementsByTagName('name')[0]?.textContent || file.name.replace('.gpx', '');
        
        // Простой расчет дистанции и времени
        let totalDistance = 0;
        let startTime = null;
        let endTime = null;
        
        if (trackPoints.length > 0) {
          startTime = new Date(trackPoints[0].getElementsByTagName('time')[0]?.textContent);
          endTime = new Date(trackPoints[trackPoints.length - 1].getElementsByTagName('time')[0]?.textContent);
          
          // Примерный расчет дистанции
          totalDistance = trackPoints.length * 0.01; // Упрощенный расчет
        }
        
        const duration = endTime && startTime ? Math.round((endTime - startTime) / 60000) : 0;
        
        setNewWorkout(prev => ({
          ...prev,
          name: name,
          distance: `${totalDistance.toFixed(1)} км`,
          duration: `${duration} мин`,
          avgSpeed: duration > 0 ? `${(totalDistance / (duration / 60)).toFixed(1)} км/ч` : '',
        }));
      } catch (error) {
        console.error('Ошибка парсинга GPX файла:', error);
      }
    };
    reader.readAsText(file);
  };

  const processJsonFile = async (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const jsonData = JSON.parse(e.target.result);
        
        // Обработка JSON файла с данными тренировки
        setNewWorkout(prev => ({
          ...prev,
          name: jsonData.name || file.name.replace('.json', ''),
          distance: jsonData.distance || '',
          duration: jsonData.duration || '',
          avgPower: jsonData.avgPower || '',
          maxPower: jsonData.maxPower || '',
          avgHeartRate: jsonData.avgHeartRate || '',
          maxHeartRate: jsonData.maxHeartRate || '',
          calories: jsonData.calories || '',
          elevation: jsonData.elevation || '',
          avgSpeed: jsonData.avgSpeed || '',
          maxSpeed: jsonData.maxSpeed || ''
        }));
      } catch (error) {
        console.error('Ошибка парсинга JSON файла:', error);
      }
    };
    reader.readAsText(file);
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  return (
    <div>
      {/* Область загрузки файла */}
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        style={{
          border: `2px dashed ${dragActive ? '#ff6600' : '#ffe0cc'}`,
          borderRadius: 12,
          padding: 40,
          textAlign: 'center',
          background: dragActive ? '#fff5f0' : '#fafafa',
          marginBottom: 20,
          cursor: 'pointer',
          transition: 'all 0.3s ease'
        }}
        onClick={() => document.getElementById('fileInput').click()}
      >
        <input
          id="fileInput"
          type="file"
          accept=".fit,.gpx,.tcx,.json"
          onChange={(e) => handleFileChange(e.target.files[0])}
          style={{ display: 'none' }}
        />
        
        {isProcessing ? (
          <div>
            <div style={{ fontSize: 24, marginBottom: 8 }}>⏳</div>
            <div style={{ color: '#666' }}>Обработка файла...</div>
          </div>
        ) : uploadedFile ? (
          <div>
            <div style={{ fontSize: 24, marginBottom: 8 }}>✅</div>
            <div style={{ color: '#333', fontWeight: 'bold' }}>{uploadedFile.name}</div>
            <div style={{ color: '#666', fontSize: 14 }}>Файл успешно загружен</div>
          </div>
        ) : (
          <div>
            <div style={{ fontSize: 24, marginBottom: 8 }}>📁</div>
            <div style={{ color: '#333', fontWeight: 'bold', marginBottom: 4 }}>
              Перетащите файл сюда или нажмите для выбора
            </div>
            <div style={{ color: '#666', fontSize: 14 }}>
              Поддерживаемые форматы: .fit, .gpx, .tcx, .json
            </div>
          </div>
        )}
      </div>

      {/* Предварительный просмотр данных из файла */}
      {uploadedFile && !isProcessing && (
        <div style={{ marginBottom: 20 }}>
          <h4 style={{ margin: '0 0 12px 0', color: '#ff6600' }}>Данные из файла:</h4>
          <div style={{ 
            background: '#f8f9fa', 
            padding: 16, 
            borderRadius: 8,
            fontSize: 14,
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 8
          }}>
            <div><strong>Название:</strong> {newWorkout.name}</div>
            <div><strong>Дистанция:</strong> {newWorkout.distance}</div>
            <div><strong>Время:</strong> {newWorkout.duration}</div>
            <div><strong>Средняя скорость:</strong> {newWorkout.avgSpeed}</div>
            {newWorkout.avgPower && <div><strong>Средняя мощность:</strong> {newWorkout.avgPower}</div>}
            {newWorkout.calories && <div><strong>Калории:</strong> {newWorkout.calories}</div>}
          </div>
        </div>
      )}
    </div>
  );
}

function ManualInputSection({ newWorkout, setNewWorkout }) {
  const inputStyle = {
    width: '100%',
    padding: 12,
    border: '2px solid #ffe0cc',
    borderRadius: 8,
    fontSize: 16,
    outline: 'none',
    boxSizing: 'border-box'
  };

  const labelStyle = {
    display: 'block',
    marginBottom: 8,
    color: '#333',
    fontWeight: 'bold'
  };

  return (
    <div>
      {/* Основные поля */}
      <div style={{ marginBottom: 16 }}>
        <label style={labelStyle}>Название тренировки *</label>
        <input
          type="text"
          value={newWorkout.name}
          onChange={(e) => setNewWorkout({...newWorkout, name: e.target.value})}
          placeholder="Например: Утренняя поездка"
          style={inputStyle}
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
        <div>
          <label style={labelStyle}>Дистанция *</label>
          <input
            type="text"
            value={newWorkout.distance}
            onChange={(e) => setNewWorkout({...newWorkout, distance: e.target.value})}
            placeholder="15 км"
            style={inputStyle}
          />
        </div>
        <div>
          <label style={labelStyle}>Продолжительность</label>
          <input
            type="text"
            value={newWorkout.duration}
            onChange={(e) => setNewWorkout({...newWorkout, duration: e.target.value})}
            placeholder="45 мин"
            style={inputStyle}
          />
        </div>
      </div>

      <div style={{ marginBottom: 16 }}>
        <label style={labelStyle}>Дата</label>
        <input
          type="date"
          value={newWorkout.date}
          onChange={(e) => setNewWorkout({...newWorkout, date: e.target.value})}
          style={inputStyle}
        />
      </div>

      {/* Дополнительные поля */}
      <details style={{ marginBottom: 16 }}>
        <summary style={{ cursor: 'pointer', fontWeight: 'bold', color: '#ff6600', marginBottom: 12 }}>
          📊 Дополнительные показатели
        </summary>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
          <div>
            <label style={labelStyle}>Средняя мощность</label>
            <input
              type="text"
              value={newWorkout.avgPower}
              onChange={(e) => setNewWorkout({...newWorkout, avgPower: e.target.value})}
              placeholder="200 Вт"
              style={inputStyle}
            />
          </div>
          <div>
            <label style={labelStyle}>Максимальная мощность</label>
            <input
              type="text"
              value={newWorkout.maxPower}
              onChange={(e) => setNewWorkout({...newWorkout, maxPower: e.target.value})}
              placeholder="350 Вт"
              style={inputStyle}
            />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
          <div>
            <label style={labelStyle}>Средний пульс</label>
            <input
              type="text"
              value={newWorkout.avgHeartRate}
              onChange={(e) => setNewWorkout({...newWorkout, avgHeartRate: e.target.value})}
              placeholder="140 уд/мин"
              style={inputStyle}
            />
          </div>
          <div>
            <label style={labelStyle}>Максимальный пульс</label>
            <input
              type="text"
              value={newWorkout.maxHeartRate}
              onChange={(e) => setNewWorkout({...newWorkout, maxHeartRate: e.target.value})}
              placeholder="175 уд/мин"
              style={inputStyle}
            />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div>
            <label style={labelStyle}>Калории</label>
            <input
              type="text"
              value={newWorkout.calories}
              onChange={(e) => setNewWorkout({...newWorkout, calories: e.target.value})}
              placeholder="650 ккал"
              style={inputStyle}
            />
          </div>
          <div>
            <label style={labelStyle}>Набор высоты</label>
            <input
              type="text"
              value={newWorkout.elevation}
              onChange={(e) => setNewWorkout({...newWorkout, elevation: e.target.value})}
              placeholder="350 м"
              style={inputStyle}
            />
          </div>
        </div>
      </details>
    </div>
  );
}

// Компонент модального окна


export default App;
