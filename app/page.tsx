'use client';

import { useState } from 'react';

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleCreateSheet = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('/api/create-sheet', {
        method: 'POST',
      });

      const data = await response.json();

      if (data.success) {
        setResult(data);
      } else {
        const errorMsg = data.details || data.error || 'Bir hata oluştu';
        setError(errorMsg);
        console.error('Sheet creation error:', data);
      }
    } catch (err) {
      setError('Sheet oluşturulurken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-8">
      <div className="max-w-2xl w-full bg-white rounded-lg shadow-xl p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          Şirinyer Sürücü Kursu
        </h1>
        <h2 className="text-xl text-gray-600 mb-6">
          Retell AI Sesli Asistan Sistemi
        </h2>
        <div className="space-y-4">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="text-green-800 font-semibold">✓ Sistem Aktif</p>
            <p className="text-green-600 text-sm mt-1">
              API Endpoint: /api/schedule
            </p>
          </div>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-blue-800 font-semibold">📋 Özellikler</p>
            <ul className="text-blue-600 text-sm mt-2 space-y-1 list-disc list-inside">
              <li>Retell AI entegrasyonu</li>
              <li>Google Sheets veri yönetimi</li>
              <li>Otomatik slot hesaplama</li>
              <li>Eğitmen yönetimi</li>
            </ul>
          </div>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-yellow-800 font-semibold mb-2">🚀 Google Sheet Oluştur</p>
            <p className="text-yellow-700 text-sm mb-3">
              Google Sheet'i otomatik olarak oluştur ve Config sheet'ini hazırla
            </p>
            <button
              onClick={handleCreateSheet}
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-2 px-4 rounded transition-colors"
            >
              {loading ? 'Oluşturuluyor...' : 'Google Sheet Oluştur'}
            </button>
            {result && (
              <div className="mt-4 p-3 bg-green-100 border border-green-300 rounded">
                <p className="text-green-800 font-semibold text-sm mb-2">
                  ✓ Sheet başarıyla oluşturuldu!
                </p>
                <p className="text-green-700 text-xs mb-2">
                  <strong>Sheet ID:</strong> {result.spreadsheetId}
                </p>
                <a
                  href={result.spreadsheetUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline text-xs block mb-2"
                >
                  Sheet'i aç →
                </a>
                <div className="text-green-700 text-xs space-y-1">
                  <p className="font-semibold">Yapılacaklar:</p>
                  <ol className="list-decimal list-inside space-y-1 ml-2">
                    {result.instructions?.map((instruction: string, idx: number) => (
                      <li key={idx} className="text-xs">
                        {instruction}
                      </li>
                    ))}
                  </ol>
                </div>
              </div>
            )}
            {error && (
              <div className="mt-4 p-3 bg-red-100 border border-red-300 rounded">
                <p className="text-red-800 font-semibold text-sm mb-1">❌ Hata:</p>
                <p className="text-red-700 text-sm">{error}</p>
                <p className="text-red-600 text-xs mt-2">
                  Lütfen service-account.json dosyasının doğru yolda olduğundan ve Google Sheets API'nin aktif olduğundan emin olun.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
