import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery, useMutation } from '@tantml:react-query';
import { ArrowLeft, Save } from 'lucide-react';
import { tourApi } from '../../api/client';
import type { TourCreateData } from '../../types';

export default function AdminTourForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditing = id !== 'new';

  const [formData, setFormData] = useState<TourCreateData>({
    title: '',
    titleEn: '',
    titleJa: '',
    titleZh: '',
    description: '',
    descriptionEn: '',
    descriptionJa: '',
    descriptionZh: '',
    durationHours: undefined,
    distanceKm: undefined,
    imageUrl: '',
    images: [],
    difficulty: '',
    tags: [],
    contentId: undefined,
    isFeatured: false,
    tourSpots: [],
  });

  const { data: existingTour, isLoading } = useQuery({
    queryKey: ['tour', id],
    queryFn: () => tourApi.getTourById(Number(id)),
    enabled: isEditing,
  });

  useEffect(() => {
    if (existingTour) {
      setFormData({
        title: existingTour.title,
        titleEn: existingTour.titleEn || '',
        titleJa: existingTour.titleJa || '',
        titleZh: existingTour.titleZh || '',
        description: existingTour.description || '',
        descriptionEn: existingTour.descriptionEn || '',
        descriptionJa: existingTour.descriptionJa || '',
        descriptionZh: existingTour.descriptionZh || '',
        durationHours: existingTour.durationHours,
        distanceKm: existingTour.distanceKm,
        imageUrl: existingTour.imageUrl || '',
        images: existingTour.images || [],
        difficulty: existingTour.difficulty || '',
        tags: existingTour.tags || [],
        contentId: existingTour.contentId,
        isFeatured: existingTour.isFeatured || false,
        tourSpots: [],
      });
    }
  }, [existingTour]);

  const createMutation = useMutation({
    mutationFn: (data: TourCreateData) => tourApi.createTour(data),
    onSuccess: () => {
      alert('투어가 생성되었습니다.');
      navigate('/admin/tours');
    },
    onError: () => {
      alert('투어 생성에 실패했습니다.');
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: TourCreateData) => tourApi.updateTour(Number(id), data),
    onSuccess: () => {
      alert('투어가 수정되었습니다.');
      navigate('/admin/tours');
    },
    onError: () => {
      alert('투어 수정에 실패했습니다.');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      alert('제목을 입력해주세요.');
      return;
    }

    if (isEditing) {
      updateMutation.mutate(formData);
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleArrayInput = (field: keyof TourCreateData, value: string) => {
    setFormData({
      ...formData,
      [field]: value.split(',').map((v) => v.trim()).filter(Boolean),
    });
  };

  if (isEditing && isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">로딩 중...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <button
        onClick={() => navigate('/admin/tours')}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
      >
        <ArrowLeft size={20} />
        목록으로 돌아가기
      </button>

      <h1 className="text-3xl font-bold mb-6">
        {isEditing ? '투어 수정' : '새 투어 추가'}
      </h1>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              제목 (한국어) *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="예: 드라마 촬영지 투어"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              제목 (영어)
            </label>
            <input
              type="text"
              value={formData.titleEn || ''}
              onChange={(e) => setFormData({ ...formData, titleEn: e.target.value })}
              placeholder="예: K-Drama Filming Location Tour"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            설명 (한국어)
          </label>
          <textarea
            value={formData.description || ''}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={4}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              소요시간 (시간)
            </label>
            <input
              type="number"
              step="0.5"
              value={formData.durationHours || ''}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  durationHours: e.target.value ? Number(e.target.value) : undefined,
                })
              }
              placeholder="예: 3.5"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              총 거리 (km)
            </label>
            <input
              type="number"
              step="0.1"
              value={formData.distanceKm || ''}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  distanceKm: e.target.value ? Number(e.target.value) : undefined,
                })
              }
              placeholder="예: 12.5"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              난이도
            </label>
            <select
              value={formData.difficulty || ''}
              onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="">선택 안 함</option>
              <option value="easy">쉬움</option>
              <option value="moderate">보통</option>
              <option value="hard">어려움</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            이미지 URL
          </label>
          <input
            type="url"
            value={formData.imageUrl || ''}
            onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
            placeholder="https://example.com/image.jpg"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            태그 (쉼표로 구분)
          </label>
          <input
            type="text"
            value={formData.tags?.join(', ') || ''}
            onChange={(e) => handleArrayInput('tags', e.target.value)}
            placeholder="예: 서울, 도보, 가족"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="isFeatured"
            checked={formData.isFeatured}
            onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
            className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
          />
          <label htmlFor="isFeatured" className="ml-2 block text-sm text-gray-900">
            추천 투어로 설정
          </label>
        </div>

        {isEditing && (
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-sm text-blue-700">
              💡 투어에 장소를 추가하거나 순서를 변경하려면, 투어를 생성한 후 투어 상세 페이지에서 관리할 수 있습니다.
            </p>
          </div>
        )}

        <div className="flex justify-end gap-4 pt-6 border-t">
          <button
            type="button"
            onClick={() => navigate('/admin/tours')}
            className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            취소
          </button>
          <button
            type="submit"
            disabled={createMutation.isPending || updateMutation.isPending}
            className="flex items-center gap-2 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
          >
            <Save size={20} />
            {isEditing ? '수정' : '생성'}
          </button>
        </div>
      </form>
    </div>
  );
}
