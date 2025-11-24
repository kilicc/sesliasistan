'use client';

import { useState, useEffect } from 'react';

interface ScheduleRow {
  week: string;
  trainer: string;
  day: string;
  start: string;
  end: string;
  student: string;
  phone: string;
}

interface Config {
  workStart: string;
  workEnd: string;
  slotDuration: number;
  trainers: string[];
}

export default function Dashboard() {
  const [schedules, setSchedules] = useState<ScheduleRow[]>([]);
  const [config, setConfig] = useState<Config | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedWeek, setSelectedWeek] = useState<string>('');

  // Get current week key
  const getCurrentWeekKey = () => {
    const now = new Date();
    const year = now.getFullYear();
    const startOfYear = new Date(year, 0, 1);
    const pastDaysOfYear = (now.getTime() - startOfYear.getTime()) / 86400000;
    const weekNumber = Math.ceil((pastDaysOfYear + startOfYear.getDay() + 1) / 7);
    return `${year}_${weekNumber.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    const weekKey = selectedWeek || getCurrentWeekKey();
    setSelectedWeek(weekKey);
    loadData(weekKey);
  }, []);

  const loadData = async (weekKey: string) => {
    setLoading(true);
    setError(null);

    try {
      // Load config
      const configRes = await fetch('/api/config');
      if (configRes.ok) {
        const configData = await configRes.json();
        setConfig(configData);
      }

      // Load schedule
      const scheduleRes = await fetch(`/api/schedule/list?week=${weekKey}`);
      if (scheduleRes.ok) {
        const scheduleData = await scheduleRes.json();
        setSchedules(scheduleData.schedules || []);
      } else {
        setError('Randevu verileri yüklenemedi');
      }
    } catch (err) {
      setError('Veri yüklenirken hata oluştu');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleWeekChange = (weekKey: string) => {
    setSelectedWeek(weekKey);
    loadData(weekKey);
  };

  // Generate week options (current week and next 4 weeks)
  const generateWeekOptions = () => {
    const options = [];
    const now = new Date();
    
    for (let i = 0; i < 5; i++) {
      const date = new Date(now);
      date.setDate(date.getDate() + (i * 7));
      const year = date.getFullYear();
      const startOfYear = new Date(year, 0, 1);
      const pastDaysOfYear = (date.getTime() - startOfYear.getTime()) / 86400000;
      const weekNumber = Math.ceil((pastDaysOfYear + startOfYear.getDay() + 1) / 7);
      const weekKey = `${year}_${weekNumber.toString().padStart(2, '0')}`;
      const weekLabel = `Hafta ${weekNumber} (${date.toLocaleDateString('tr-TR', { month: 'short', day: 'numeric' })})`;
      options.push({ value: weekKey, label: weekLabel });
    }
    
    return options;
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-xl p-8 mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Şirinyer Sürücü Kursu
          </h1>
          <h2 className="text-xl text-gray-600 mb-6">
            Randevu Yönetim Paneli
          </h2>

          {/* Config Info */}
          {config && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <h3 className="font-semibold text-blue-800 mb-2">⚙️ Sistem Ayarları</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="text-blue-600 font-medium">Çalışma Saati:</span>
                  <p className="text-blue-800">{config.workStart} - {config.workEnd}</p>
                </div>
                <div>
                  <span className="text-blue-600 font-medium">Slot Süresi:</span>
                  <p className="text-blue-800">{config.slotDuration} dakika</p>
                </div>
                <div>
                  <span className="text-blue-600 font-medium">Eğitmen Sayısı:</span>
                  <p className="text-blue-800">{config.trainers.length}</p>
                </div>
                <div>
                  <span className="text-blue-600 font-medium">Eğitmenler:</span>
                  <p className="text-blue-800">{config.trainers.join(', ')}</p>
                </div>
              </div>
            </div>
          )}

          {/* Week Selector */}
          <div className="mb-6">
            <label htmlFor="week-selector" className="block text-sm font-medium text-gray-700 mb-2">
              Hafta Seçin:
            </label>
            <select
              id="week-selector"
              value={selectedWeek}
              onChange={(e) => handleWeekChange(e.target.value)}
              className="block w-full md:w-64 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              title="Hafta seçin"
            >
              {generateWeekOptions().map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <p className="mt-2 text-gray-600">Yükleniyor...</p>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <p className="text-red-800">❌ {error}</p>
            </div>
          )}

          {/* Schedule Table */}
          {!loading && !error && (
            <div className="overflow-x-auto">
              {schedules.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <p>Bu hafta için randevu bulunmuyor.</p>
                </div>
              ) : (
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Gün
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Saat
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Eğitmen
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Öğrenci
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Telefon
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {schedules.map((schedule, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {schedule.day}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {schedule.start} - {schedule.end}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {schedule.trainer}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {schedule.student}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {schedule.phone}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <a
            href="/"
            className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow"
          >
            <h3 className="font-semibold text-gray-800 mb-2">🏠 Ana Sayfa</h3>
            <p className="text-sm text-gray-600">Ana sayfaya dön</p>
          </a>
          <a
            href="/api/schedule/test"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow"
          >
            <h3 className="font-semibold text-gray-800 mb-2">🧪 Test Endpoint</h3>
            <p className="text-sm text-gray-600">API test sayfası</p>
          </a>
          <a
            href="https://docs.google.com/spreadsheets/d/1hKDO3QrszclE6NDMIiZvy01_tNstgZExSt2j0jTjO6I"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow"
          >
            <h3 className="font-semibold text-gray-800 mb-2">📊 Google Sheet</h3>
            <p className="text-sm text-gray-600">Google Sheets'i aç</p>
          </a>
        </div>
      </div>
    </main>
  );
}

