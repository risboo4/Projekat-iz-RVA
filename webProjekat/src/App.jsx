import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { Spinner } from 'react-bootstrap';
import PrivateRoute from './components/PrivateRoute.jsx';
import AdminRoute from './components/AdminRoute.jsx';
import CmsLayout from './components/CmsLayout.jsx';

const CmsLoginPage        = lazy(() => import('./pages/cms/CmsLoginPage.jsx'));
const CmsCategoriesPage   = lazy(() => import('./pages/cms/CmsCategoriesPage.jsx'));
const CmsCategoryFormPage = lazy(() => import('./pages/cms/CmsCategoryFormPage.jsx'));
const CmsArticlesPage     = lazy(() => import('./pages/cms/CmsArticlesPage.jsx'));
const CmsArticleFormPage  = lazy(() => import('./pages/cms/CmsArticleFormPage.jsx'));
const CmsSearchPage       = lazy(() => import('./pages/cms/CmsSearchPage.jsx'));
const CmsUsersPage        = lazy(() => import('./pages/cms/CmsUsersPage.jsx'));
const CmsUserFormPage     = lazy(() => import('./pages/cms/CmsUserFormPage.jsx'));

const PublicLayout        = lazy(() => import('./components/public/PublicLayout.jsx'));
const PublicHomePage      = lazy(() => import('./pages/public/PublicHomePage.jsx'));
const PublicArticlePage   = lazy(() => import('./pages/public/PublicArticlePage.jsx'));
const PublicCategoryPage  = lazy(() => import('./pages/public/PublicCategoryPage.jsx'));
const PublicSearchPage    = lazy(() => import('./pages/public/PublicSearchPage.jsx'));

const fallback = (
    <div className="d-flex justify-content-center align-items-center vh-100">
        <Spinner animation="border" />
    </div>
);

function App() {
    return (
        <Router>
            <Suspense fallback={fallback}>
                <Routes>
                    <Route path="/cms/login" element={<CmsLoginPage />} />
                    <Route path="/cms" element={<PrivateRoute element={<CmsLayout />} />}>
                        <Route path="categories"           element={<CmsCategoriesPage />} />
                        <Route path="categories/new"       element={<CmsCategoryFormPage />} />
                        <Route path="categories/:id/edit"  element={<CmsCategoryFormPage />} />
                        <Route path="articles"             element={<CmsArticlesPage />} />
                        <Route path="articles/new"         element={<CmsArticleFormPage />} />
                        <Route path="articles/:id/edit"    element={<CmsArticleFormPage />} />
                        <Route path="search"               element={<CmsSearchPage />} />
                        <Route path="users"                element={<AdminRoute element={<CmsUsersPage />} />} />
                        <Route path="users/new"            element={<AdminRoute element={<CmsUserFormPage />} />} />
                        <Route path="users/:email/edit"    element={<AdminRoute element={<CmsUserFormPage />} />} />
                    </Route>

                    <Route path="/" element={<PublicLayout />}>
                        <Route index element={<PublicHomePage />} />
                        <Route path="article/:id"  element={<PublicArticlePage />} />
                        <Route path="category/:id" element={<PublicCategoryPage />} />
                        <Route path="search"       element={<PublicSearchPage />} />
                    </Route>
                </Routes>
            </Suspense>
        </Router>
    );
}

export default App;
