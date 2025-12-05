import { useTranslation } from 'react-i18next';
import { Users, MessageCircle, Heart, Share2 } from 'lucide-react';

export default function Community() {
  const { t } = useTranslation();

  const mockPosts = [
    {
      id: 1,
      author: '드라마러버',
      avatar: '👩',
      content: '어제 북촌 한옥마을 다녀왔어요! 도깨비 촬영지라서 너무 설렜어요 ✨',
      likes: 24,
      comments: 5,
      timeAgo: '2시간 전',
    },
    {
      id: 2,
      author: 'K-POP팬',
      avatar: '🧑',
      content: 'SM타운 아티움에서 NCT 굿즈 겟! 너무 행복해요 💚',
      likes: 18,
      comments: 3,
      timeAgo: '5시간 전',
    },
    {
      id: 3,
      author: '영화마니아',
      avatar: '👨',
      content: '해운대 해수욕장 일몰 진짜 예술이네요 🌅 기생충 보고 부산 왔는데 최고!',
      likes: 31,
      comments: 8,
      timeAgo: '1일 전',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-20 md:pb-8">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-20 z-40">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center gap-3">
            <Users className="w-8 h-8 text-pink-500" />
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                {t('community.title')}
              </h1>
              <p className="text-sm text-gray-600">
                {t('community.subtitle')}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Create Post Button */}
        <button className="w-full mb-6 p-4 bg-white border-2 border-dashed border-gray-300 rounded-xl hover:border-pink-400 hover:bg-pink-50 transition-all group">
          <div className="flex items-center gap-3 text-gray-600 group-hover:text-pink-600">
            <MessageCircle className="w-5 h-5" />
            <span className="font-medium">{t('community.createPost')}</span>
          </div>
        </button>

        {/* Posts Feed */}
        <div className="space-y-4">
          {mockPosts.map((post) => (
            <div
              key={post.id}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 hover:shadow-md transition-shadow"
            >
              {/* Author Info */}
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-pink-400 to-purple-400 rounded-full flex items-center justify-center text-xl">
                  {post.avatar}
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-gray-800">{post.author}</div>
                  <div className="text-xs text-gray-500">{post.timeAgo}</div>
                </div>
              </div>

              {/* Post Content */}
              <p className="text-gray-700 mb-4">{post.content}</p>

              {/* Actions */}
              <div className="flex items-center gap-6 pt-3 border-t border-gray-100">
                <button className="flex items-center gap-2 text-gray-600 hover:text-pink-500 transition-colors">
                  <Heart className="w-5 h-5" />
                  <span className="text-sm font-medium">{post.likes}</span>
                </button>
                <button className="flex items-center gap-2 text-gray-600 hover:text-purple-500 transition-colors">
                  <MessageCircle className="w-5 h-5" />
                  <span className="text-sm font-medium">{post.comments}</span>
                </button>
                <button className="flex items-center gap-2 text-gray-600 hover:text-blue-500 transition-colors ml-auto">
                  <Share2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Coming Soon Notice */}
        <div className="mt-8 p-6 bg-gradient-to-br from-pink-50 to-purple-50 rounded-xl text-center">
          <p className="text-gray-600 font-medium">
            {t('community.comingSoon')}
          </p>
        </div>
      </div>
    </div>
  );
}
