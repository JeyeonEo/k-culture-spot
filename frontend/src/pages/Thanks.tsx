import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function Thanks() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white">
      <div className="max-w-3xl mx-auto px-4 py-16">
        <Link
          to="/"
          className="inline-flex items-center text-gray-600 hover:text-pink-500 mb-8 transition-colors"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          {t('common.back')}
        </Link>

        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            {t('thanks.title')}
          </h1>

          <div className="prose prose-lg text-gray-600 space-y-6">
            <p className="text-xl leading-relaxed">
              {t('thanks.story1')}
            </p>

            <div className="bg-pink-50 rounded-xl p-6 border-l-4 border-pink-400">
              <p className="text-pink-800 font-medium">
                {t('thanks.highlight')}
              </p>
            </div>

            <p className="leading-relaxed">
              {t('thanks.story2')}
            </p>

            <p className="leading-relaxed">
              {t('thanks.story3')}
            </p>
          </div>

          <div className="mt-10 pt-8 border-t border-gray-100">
            <p className="text-gray-500 text-sm">
              {t('thanks.signature')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
