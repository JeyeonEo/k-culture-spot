import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { ArrowLeft, Save } from 'lucide-react';
import { contentApi } from '../../api/client';
import type { ContentType, ContentCreateData } from '../../types';

export default function AdminContentForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditing = id !== 'new';

  const [formData, setFormData] = useState<ContentCreateData>({
    contentType: 'drama',
    title: '',
    titleEn: '',
    titleJa: '',
    titleZh: '',
    description: '',
    descriptionEn: '',
    descriptionJa: '',
    descriptionZh: '',
    year: undefined,
    imageUrl: '',
    images: [],
    director: '',
    directorEn: '',
    cast: [],
    castEn: [],
    genre: [],
    network: '',
    episodes: undefined,
    tags: [],
  });

  const { data: existingContent, isLoading } = useQuery({
    queryKey: ['content', id],
    queryFn: () => contentApi.getContentById(Number(id)),
    enabled: isEditing,
  });

  useEffect(() => {
    if (existingContent) {
      setFormData({
        contentType: existingContent.contentType,
        title: existingContent.title,
        titleEn: existingContent.titleEn || '',
        titleJa: existingContent.titleJa || '',
        titleZh: existingContent.titleZh || '',
        description: existingContent.description || '',
        descriptionEn: existingContent.descriptionEn || '',
        descriptionJa: existingContent.descriptionJa || '',
        descriptionZh: existingContent.descriptionZh || '',
        year: existingContent.year,
        imageUrl: existingContent.imageUrl || '',
        images: existingContent.images || [],
        director: existingContent.director || '',
        directorEn: existingContent.directorEn || '',
        cast: existingContent.cast || [],
        castEn: existingContent.castEn || [],
        genre: existingContent.genre || [],
        network: existingContent.network || '',
        episodes: existingContent.episodes,
        tags: existingContent.tags || [],
      });
    }
  }, [existingContent]);

  const createMutation = useMutation({
    mutationFn: (data: ContentCreateData) => contentApi.createContent(data),
    onSuccess: () => {
      alert('콘텐츠가 생성되었습니다.');
      navigate('/admin/contents');
    },
    onError: () => {
      alert('콘텐츠 생성에 실패했습니다.');
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: ContentCreateData) => contentApi.updateContent(Number(id), data),
    onSuccess: () => {
      alert('콘텐츠가 수정되었습니다.');
      navigate('/admin/contents');
    },
    onError: () => {
      alert('콘텐츠 수정에 실패했습니다.');
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

  const handleArrayInput = (field: keyof ContentCreateData, value: string) => {
    setFormData({
      ...formData,
      [field]: value.split(',').map((v) => v.trim()).filter(Boolean),
    });
  };

  if (isEditing && isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">로딩 중...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <button
        onClick={() => navigate('/admin/contents')}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
      >
        <ArrowLeft size={20} />
        목록으로 돌아가기
      </button>

      <h1 className="text-3xl font-bold mb-6">
        {isEditing ? '콘텐츠 수정' : '새 콘텐츠 추가'}
      </h1>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              콘텐츠 타입 *
            </label>
            <select
              value={formData.contentType}
              onChange={(e) =>
                setFormData({ ...formData, contentType: e.target.value as ContentType })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="drama">드라마</option>
              <option value="movie">영화</option>
              <option value="music">음악</option>
              <option value="variety">예능</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              방영 년도
            </label>
            <input
              type="number"
              value={formData.year || ''}
              onChange={(e) =>
                setFormData({ ...formData, year: e.target.value ? Number(e.target.value) : undefined })
              }
              placeholder="2024"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              제목 (한국어) *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="예: 사랑의 불시착"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              placeholder="예: Crash Landing on You"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              감독 (한국어)
            </label>
            <input
              type="text"
              value={formData.director || ''}
              onChange={(e) => setFormData({ ...formData, director: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              방송사/플랫폼
            </label>
            <input
              type="text"
              value={formData.network || ''}
              onChange={(e) => setFormData({ ...formData, network: e.target.value })}
              placeholder="예: tvN, Netflix"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              출연진 (쉼표로 구분)
            </label>
            <input
              type="text"
              value={formData.cast?.join(', ') || ''}
              onChange={(e) => handleArrayInput('cast', e.target.value)}
              placeholder="예: 현빈, 손예진"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              장르 (쉼표로 구분)
            </label>
            <input
              type="text"
              value={formData.genre?.join(', ') || ''}
              onChange={(e) => handleArrayInput('genre', e.target.value)}
              placeholder="예: 로맨스, 드라마"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
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
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
            placeholder="예: K-드라마, 로맨스"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex justify-end gap-4 pt-6 border-t">
          <button
            type="button"
            onClick={() => navigate('/admin/contents')}
            className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            취소
          </button>
          <button
            type="submit"
            disabled={createMutation.isPending || updateMutation.isPending}
            className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            <Save size={20} />
            {isEditing ? '수정' : '생성'}
          </button>
        </div>
      </form>
    </div>
  );
}
