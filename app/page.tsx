export default function Home() {
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
        </div>
      </div>
    </main>
  );
}

