import { Link } from 'react-router-dom';
import { Film, MapPin, Route, Settings } from 'lucide-react';

export default function AdminDashboard() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">관리자 대시보드</h1>
        <p className="text-gray-600">콘텐츠와 투어를 관리하세요</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Link
          to="/admin/contents"
          className="block p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow border-2 border-transparent hover:border-blue-500"
        >
          <div className="flex items-center mb-4">
            <Film className="w-8 h-8 text-blue-600 mr-3" />
            <h2 className="text-xl font-semibold">콘텐츠 관리</h2>
          </div>
          <p className="text-gray-600">
            드라마, 영화, 음악, 예능 콘텐츠를 생성하고 관리합니다.
          </p>
        </Link>

        <Link
          to="/admin/tours"
          className="block p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow border-2 border-transparent hover:border-green-500"
        >
          <div className="flex items-center mb-4">
            <Route className="w-8 h-8 text-green-600 mr-3" />
            <h2 className="text-xl font-semibold">투어 관리</h2>
          </div>
          <p className="text-gray-600">
            투어 코스를 생성하고 장소를 추가하여 관리합니다.
          </p>
        </Link>

        <Link
          to="/spots"
          className="block p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow border-2 border-transparent hover:border-purple-500"
        >
          <div className="flex items-center mb-4">
            <MapPin className="w-8 h-8 text-purple-600 mr-3" />
            <h2 className="text-xl font-semibold">장소 관리</h2>
          </div>
          <p className="text-gray-600">
            등록된 장소를 확인하고 관리합니다.
          </p>
        </Link>

        <Link
          to="/settings"
          className="block p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow border-2 border-transparent hover:border-gray-500"
        >
          <div className="flex items-center mb-4">
            <Settings className="w-8 h-8 text-gray-600 mr-3" />
            <h2 className="text-xl font-semibold">설정</h2>
          </div>
          <p className="text-gray-600">
            시스템 설정 및 환경 설정을 관리합니다.
          </p>
        </Link>
      </div>

      <div className="mt-8 p-6 bg-yellow-50 rounded-lg border border-yellow-200">
        <h3 className="text-lg font-semibold mb-2 text-yellow-800">주의사항</h3>
        <ul className="list-disc list-inside text-yellow-700 space-y-1">
          <li>현재 인증 시스템이 구현되지 않았습니다.</li>
          <li>누구나 관리자 페이지에 접근할 수 있으니 주의하세요.</li>
          <li>프로덕션 환경에서는 반드시 인증을 구현해야 합니다.</li>
        </ul>
      </div>
    </div>
  );
}
