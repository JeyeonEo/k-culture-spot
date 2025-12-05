import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Header from './components/Header';
import Footer from './components/Footer';
import BottomNavigation from './components/BottomNavigation';
import Home from './pages/Home';
import SpotList from './pages/SpotList';
import SpotDetail from './pages/SpotDetail';
import CategoryPage from './pages/CategoryPage';
import SearchPage from './pages/SearchPage';
import Community from './pages/Community';
import Favorites from './pages/Favorites';
import Settings from './pages/Settings';
import ContentDetail from './pages/ContentDetail';
import ContentSpotsList from './pages/ContentSpotsList';
import ContentToursList from './pages/ContentToursList';
import TourDetail from './pages/TourDetail';
import Thanks from './pages/Thanks';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <div className="flex flex-col min-h-screen">
          <Header />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/spots" element={<SpotList />} />
              <Route path="/spots/:id" element={<SpotDetail />} />
              <Route path="/content/:id" element={<ContentDetail />} />
              <Route path="/content/:id/spots" element={<ContentSpotsList />} />
              <Route path="/content/:id/tours" element={<ContentToursList />} />
              <Route path="/tours/:id" element={<TourDetail />} />
              <Route path="/category/:category" element={<CategoryPage />} />
              <Route path="/search" element={<SearchPage />} />
              <Route path="/community" element={<Community />} />
              <Route path="/favorites" element={<Favorites />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/thanks" element={<Thanks />} />
            </Routes>
          </main>
          <Footer />
          <BottomNavigation />
        </div>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
