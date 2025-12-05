import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About */}
          <div>
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <span>🇰🇷</span>
              HypeSpot
            </h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              {t('footer.aboutText')}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold mb-4">{t('home.categories')}</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/category/drama" className="text-gray-400 hover:text-pink-400 text-sm transition-colors">
                  {t('category.drama')}
                </Link>
              </li>
              <li>
                <Link to="/category/kpop" className="text-gray-400 hover:text-pink-400 text-sm transition-colors">
                  {t('category.kpop')}
                </Link>
              </li>
              <li>
                <Link to="/category/movie" className="text-gray-400 hover:text-pink-400 text-sm transition-colors">
                  {t('category.movie')}
                </Link>
              </li>
              <li>
                <Link to="/category/variety" className="text-gray-400 hover:text-pink-400 text-sm transition-colors">
                  {t('category.variety')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-bold mb-4">{t('footer.contact')}</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-400 hover:text-pink-400 text-sm transition-colors">
                  {t('footer.terms')}
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-pink-400 text-sm transition-colors">
                  {t('footer.privacy')}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-500 text-sm">{t('footer.copyright')}</p>
        </div>
      </div>
    </footer>
  );
}
