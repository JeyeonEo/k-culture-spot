import { Link, useLocation } from 'react-router-dom';
import { Compass, Users, Heart, Settings } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function BottomNavigation() {
  const { t } = useTranslation();
  const location = useLocation();

  const navItems = [
    {
      to: '/',
      icon: Compass,
      label: t('bottomNav.explore'),
      key: 'explore',
    },
    {
      to: '/community',
      icon: Users,
      label: t('bottomNav.community'),
      key: 'community',
    },
    {
      to: '/favorites',
      icon: Heart,
      label: t('bottomNav.favorites'),
      key: 'favorites',
    },
    {
      to: '/settings',
      icon: Settings,
      label: t('bottomNav.settings'),
      key: 'settings',
    },
  ];

  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50">
      <div className="flex items-center justify-around h-16 px-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.to);

          return (
            <Link
              key={item.key}
              to={item.to}
              className={`flex flex-col items-center justify-center flex-1 h-full gap-1 transition-all ${
                active
                  ? 'text-pink-500'
                  : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <div className={`relative ${active ? 'scale-110' : ''} transition-transform`}>
                <Icon className="w-6 h-6" strokeWidth={active ? 2.5 : 2} />
                {active && (
                  <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-pink-500 rounded-full" />
                )}
              </div>
              <span className={`text-xs font-medium ${active ? 'font-semibold' : ''}`}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
