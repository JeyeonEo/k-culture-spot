import { Link } from 'react-router-dom';
import { Tv, Music, Film } from 'lucide-react';
import SpotCarousel from '../components/SpotCarousel';
import type { Spot } from '../types';

// Mock data for demo
const mockFeaturedSpots: Spot[] = [
  {
    id: 1,
    name: '북촌 한옥마을',
    nameEn: 'Bukchon Hanok Village',
    nameJa: '北村韓屋村',
    nameZh: '北村韩屋村',
    description: '도깨비, 사랑의 불시착 등 수많은 드라마 촬영지로 유명한 전통 한옥마을',
    descriptionEn: 'Traditional hanok village famous for dramas like Goblin and Crash Landing on You',
    descriptionJa: 'トッケビ、愛の不時着など数多くのドラマ撮影地として有名な伝統韓屋村',
    descriptionZh: '因鬼怪、爱的迫降等众多电视剧拍摄地而闻名的传统韩屋村',
    address: '서울특별시 종로구 북촌로',
    addressEn: 'Bukchon-ro, Jongno-gu, Seoul',
    latitude: 37.5826,
    longitude: 126.9831,
    category: 'drama',
    imageUrl: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800',
    images: [],
    relatedContent: [],
    tags: ['도깨비', '사랑의 불시착', '한옥'],
    viewCount: 15234,
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
  },
  {
    id: 2,
    name: 'SM타운 코엑스아티움',
    nameEn: 'SMTOWN COEX Artium',
    nameJa: 'SMタウン コエックスアティウム',
    nameZh: 'SMTOWN COEX Artium',
    description: 'SM 엔터테인먼트 소속 아티스트들의 굿즈와 전시를 만날 수 있는 공간',
    descriptionEn: 'Space where you can find goods and exhibitions of SM Entertainment artists',
    descriptionJa: 'SMエンターテインメント所属アーティストのグッズや展示に出会える空間',
    descriptionZh: '可以遇见SM娱乐旗下艺人周边和展览的空间',
    address: '서울특별시 강남구 영동대로 513',
    addressEn: '513 Yeongdong-daero, Gangnam-gu, Seoul',
    latitude: 37.5128,
    longitude: 127.0591,
    category: 'kpop',
    imageUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800',
    images: [],
    relatedContent: [],
    tags: ['SM', 'NCT', 'aespa', 'EXO'],
    viewCount: 23456,
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
  },
  {
    id: 3,
    name: '부산 해운대 해수욕장',
    nameEn: 'Haeundae Beach',
    nameJa: '海雲台海水浴場',
    nameZh: '海云台海水浴场',
    description: '해운대 연인들, 수상한 그녀 등 수많은 영화의 배경이 된 대한민국 대표 해변',
    descriptionEn: "Korea's representative beach featured in many movies like Haeundae and Miss Granny",
    descriptionJa: '海雲台の恋人たち、怪しい彼女など数多くの映画の背景となった韓国代表のビーチ',
    descriptionZh: '成为海云台恋人们、奇怪的她等众多电影背景的韩国代表性海滩',
    address: '부산광역시 해운대구 해운대해변로 264',
    addressEn: '264 Haeundae Beach Road, Haeundae-gu, Busan',
    latitude: 35.1587,
    longitude: 129.1604,
    category: 'movie',
    imageUrl: 'https://images.unsplash.com/photo-1590073242678-70ee3fc28e8e?w=800',
    images: [],
    relatedContent: [],
    tags: ['해운대', '영화', '부산'],
    viewCount: 18765,
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
  },
  {
    id: 4,
    name: '남산타워',
    nameEn: 'N Seoul Tower',
    nameJa: 'Nソウルタワー',
    nameZh: 'N首尔塔',
    description: '별에서 온 그대, 시티헌터 등 수많은 드라마의 로맨틱한 명소',
    descriptionEn: 'Romantic landmark featured in dramas like My Love from the Star and City Hunter',
    descriptionJa: '星から来たあなた、シティーハンターなど数多くのドラマのロマンチックな名所',
    descriptionZh: '来自星星的你、城市猎人等众多电视剧的浪漫景点',
    address: '서울특별시 용산구 남산공원길 105',
    addressEn: '105 Namsangongwon-gil, Yongsan-gu, Seoul',
    latitude: 37.5512,
    longitude: 126.9882,
    category: 'drama',
    imageUrl: 'https://images.unsplash.com/photo-1583474800148-f63511178c87?w=800',
    images: [],
    relatedContent: [],
    tags: ['별에서 온 그대', '시티헌터', '남산'],
    viewCount: 28000,
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
  },
  {
    id: 5,
    name: '경복궁',
    nameEn: 'Gyeongbokgung Palace',
    nameJa: '景福宮',
    nameZh: '景福宫',
    description: '궁, 구르미 그린 달빛 등 사극 드라마의 대표 촬영지',
    descriptionEn: 'Main filming location for historical dramas like The Palace and Moonlight',
    descriptionJa: '宮、雲が描いた月明かりなど時代劇ドラマの代表撮影地',
    descriptionZh: '宫、云画的月光等古装剧的代表拍摄地',
    address: '서울특별시 종로구 사직로 161',
    addressEn: '161 Sajik-ro, Jongno-gu, Seoul',
    latitude: 37.5788,
    longitude: 126.9770,
    category: 'drama',
    imageUrl: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=800',
    images: [],
    relatedContent: [],
    tags: ['궁', '사극', '전통'],
    viewCount: 32000,
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
  },
];

// Mock poster data for dashboard
const mockPosters = [
  {
    id: 1,
    title: '도깨비',
    titleEn: 'Goblin',
    category: 'drama',
    imageUrl: 'https://images.unsplash.com/photo-1594908900066-3f47337549d8?w=400&h=600&fit=crop',
  },
  {
    id: 2,
    title: '사랑의 불시착',
    titleEn: 'Crash Landing on You',
    category: 'drama',
    imageUrl: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=400&h=600&fit=crop',
  },
  {
    id: 3,
    title: '오징어 게임',
    titleEn: 'Squid Game',
    category: 'drama',
    imageUrl: 'https://images.unsplash.com/photo-1574267432644-f610f0ac8c99?w=400&h=600&fit=crop',
  },
  {
    id: 4,
    title: '기생충',
    titleEn: 'Parasite',
    category: 'movie',
    imageUrl: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=400&h=600&fit=crop',
  },
  {
    id: 5,
    title: '부산행',
    titleEn: 'Train to Busan',
    category: 'movie',
    imageUrl: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=400&h=600&fit=crop',
  },
  {
    id: 6,
    title: '건축학개론',
    titleEn: 'Architecture 101',
    category: 'movie',
    imageUrl: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=400&h=600&fit=crop',
  },
  {
    id: 7,
    title: '이태원 클라쓰',
    titleEn: 'Itaewon Class',
    category: 'drama',
    imageUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&h=600&fit=crop',
  },
  {
    id: 8,
    title: '경이로운 소문',
    titleEn: 'The Uncanny Counter',
    category: 'drama',
    imageUrl: 'https://images.unsplash.com/photo-1514782831304-632d84503f6f?w=400&h=600&fit=crop',
  },
];

const categoryButtons = [
  {
    id: 'drama',
    label: 'K-Drama',
    icon: Tv,
    gradient: 'from-pink-400 to-rose-400',
  },
  {
    id: 'kpop',
    label: 'K-Pop',
    icon: Music,
    gradient: 'from-purple-400 to-violet-400',
  },
  {
    id: 'movie',
    label: 'K-Movie',
    icon: Film,
    gradient: 'from-blue-400 to-cyan-400',
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Carousel Section - Featured Spots */}
      <SpotCarousel spots={mockFeaturedSpots} />

      {/* Category Buttons Section */}
      <section className="py-12 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 text-gray-800">
            카테고리 둘러보기
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
            {categoryButtons.map((category) => {
              const Icon = category.icon;
              return (
                <Link
                  key={category.id}
                  to={`/category/${category.id}`}
                  className="group relative overflow-hidden rounded-2xl p-8 bg-gradient-to-br from-white to-gray-50 border-2 border-gray-100 hover:border-transparent hover:shadow-xl transition-all duration-300"
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${category.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
                  <div className="relative flex flex-col items-center gap-3">
                    <div className={`p-4 rounded-full bg-gradient-to-br ${category.gradient} text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className="w-8 h-8" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 group-hover:text-gray-900">
                      {category.label}
                    </h3>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Poster Dashboard Section */}
      <section className="py-16 px-4 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-10">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
              인기 드라마 & 영화
            </h2>
            <Link
              to="/spots"
              className="text-pink-500 hover:text-pink-600 font-medium flex items-center gap-1 group"
            >
              전체보기
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </Link>
          </div>

          {/* Poster Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-4 md:gap-6">
            {mockPosters.map((poster) => (
              <Link
                key={poster.id}
                to={`/category/${poster.category}`}
                className="group relative aspect-[2/3] rounded-xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300"
              >
                <img
                  src={poster.imageUrl}
                  alt={poster.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <h3 className="text-white font-bold text-lg mb-1">{poster.title}</h3>
                    <p className="text-white/80 text-sm">{poster.titleEn}</p>
                  </div>
                </div>
                {/* Category Badge */}
                <div className="absolute top-3 right-3">
                  <span className="px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-semibold text-gray-700 capitalize">
                    {poster.category}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-pink-400 via-purple-400 to-blue-400">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            K-Culture 여행을 시작하세요
          </h2>
          <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
            좋아하는 드라마와 영화의 촬영지를 직접 방문하고, K-POP 스타들의 발자취를 따라가보세요
          </p>
          <Link
            to="/spots"
            className="inline-flex items-center gap-2 bg-white text-purple-600 px-8 py-4 rounded-full font-bold hover:bg-gray-100 transition-all shadow-lg hover:shadow-xl hover:scale-105"
          >
            모든 스팟 둘러보기
          </Link>
        </div>
      </section>
    </div>
  );
}
