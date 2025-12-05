import { useTranslation } from 'react-i18next';
import { Settings as SettingsIcon, Globe, Bell, User, Info, Shield, HelpCircle, ChevronRight } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import LanguageSelector from '../components/LanguageSelector';

interface SettingsItem {
  icon: LucideIcon;
  label: string;
  action: string;
  hasCustomContent?: boolean;
}

interface SettingsSection {
  title: string;
  items: SettingsItem[];
}

export default function Settings() {
  const { t } = useTranslation();

  const settingsSections: SettingsSection[] = [
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
                        <LanguageSelector />
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
          <p>HypeSpot</p>
          <p className="mt-1">Version 1.0.0</p>
          <p className="mt-4 text-xs">© 2024 HypeSpot. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}
