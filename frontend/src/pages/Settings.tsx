import { useTranslation } from 'react-i18next';
import { Settings as SettingsIcon, Globe, Bell, User, Info, Shield, HelpCircle, ChevronRight, Map } from 'lucide-react';
import LanguageSelector from '../components/LanguageSelector';
import { useState, useEffect } from 'react';
import type { MapProvider } from '../types';

export default function Settings() {
  const { t } = useTranslation();
  const [mapProvider, setMapProvider] = useState<MapProvider>(() => {
    return (localStorage.getItem('mapProvider') as MapProvider) || 'google';
  });

  useEffect(() => {
    localStorage.setItem('mapProvider', mapProvider);
  }, [mapProvider]);

  const settingsSections = [
    {
      title: t('settings.account'),
      items: [
        { icon: User, label: t('settings.profile'), action: 'profile' },
        { icon: Bell, label: t('settings.notifications'), action: 'notifications' },
      ],
    },
    {
      title: t('settings.preferences'),
      items: [
        { icon: Globe, label: t('settings.language'), action: 'language', hasCustomContent: true },
        { icon: Map, label: t('settings.mapProvider'), action: 'mapProvider', hasCustomContent: true },
      ],
    },
    {
      title: t('settings.about'),
      items: [
        { icon: Info, label: t('settings.aboutApp'), action: 'about' },
        { icon: Shield, label: t('settings.privacy'), action: 'privacy' },
        { icon: HelpCircle, label: t('settings.help'), action: 'help' },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-20 md:pb-8">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-20 z-40">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center gap-3">
            <SettingsIcon className="w-8 h-8 text-pink-500" />
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                {t('settings.title')}
              </h1>
              <p className="text-sm text-gray-600">
                {t('settings.subtitle')}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {settingsSections.map((section, sectionIndex) => (
          <div key={sectionIndex} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
              <h2 className="font-semibold text-gray-700 text-sm">{section.title}</h2>
            </div>
            <div className="divide-y divide-gray-100">
              {section.items.map((item, itemIndex) => {
                const Icon = item.icon;
                return (
                  <div key={itemIndex}>
                    {item.hasCustomContent ? (
                      <div className="px-4 py-4">
                        <div className="flex items-center gap-3 mb-3">
                          <Icon className="w-5 h-5 text-gray-600" />
                          <span className="font-medium text-gray-800">{item.label}</span>
                        </div>
                        {item.action === 'language' ? (
                          <LanguageSelector />
                        ) : item.action === 'mapProvider' ? (
                          <div className="space-y-3">
                            <p className="text-sm text-gray-600">{t('settings.mapProviderDesc')}</p>
                            <div className="space-y-2">
                              <button
                                onClick={() => setMapProvider('google')}
                                className={`w-full px-4 py-3 rounded-lg border-2 transition-all ${
                                  mapProvider === 'google'
                                    ? 'border-pink-500 bg-pink-50'
                                    : 'border-gray-200 hover:border-gray-300'
                                }`}
                              >
                                <div className="flex items-center justify-between">
                                  <span className="font-medium text-gray-800">{t('settings.googleMaps')}</span>
                                  {mapProvider === 'google' && (
                                    <div className="w-5 h-5 bg-pink-500 rounded-full flex items-center justify-center">
                                      <ChevronRight className="w-3 h-3 text-white rotate-90" />
                                    </div>
                                  )}
                                </div>
                              </button>
                              <button
                                onClick={() => setMapProvider('naver')}
                                className={`w-full px-4 py-3 rounded-lg border-2 transition-all ${
                                  mapProvider === 'naver'
                                    ? 'border-pink-500 bg-pink-50'
                                    : 'border-gray-200 hover:border-gray-300'
                                }`}
                              >
                                <div className="flex items-center justify-between">
                                  <span className="font-medium text-gray-800">{t('settings.naverMaps')}</span>
                                  {mapProvider === 'naver' && (
                                    <div className="w-5 h-5 bg-pink-500 rounded-full flex items-center justify-center">
                                      <ChevronRight className="w-3 h-3 text-white rotate-90" />
                                    </div>
                                  )}
                                </div>
                              </button>
                            </div>
                          </div>
                        ) : null}
                      </div>
                    ) : (
                      <button className="w-full px-4 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors group">
                        <div className="flex items-center gap-3">
                          <Icon className="w-5 h-5 text-gray-600 group-hover:text-pink-500 transition-colors" />
                          <span className="font-medium text-gray-800">{item.label}</span>
                        </div>
                        <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-pink-500 transition-colors" />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}

        {/* App Version */}
        <div className="text-center py-8 text-sm text-gray-500">
          <p>K-Culture Spot</p>
          <p className="mt-1">Version 1.0.0</p>
          <p className="mt-4 text-xs">© 2024 K-Culture Spot. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}
