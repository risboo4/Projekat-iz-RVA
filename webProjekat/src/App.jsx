import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { lazy, Suspense, useEffect } from 'react';
import { Spinner } from 'react-bootstrap';
import { initSession } from './auth.js';
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
// Chapter 6 - javna platforma:
// const PublicHomePage    = lazy(() => import('./pages/public/PublicHomePage.jsx'));
// const PublicArticlePage = lazy(() => import('./pages/public/PublicArticlePage.jsx'));

const fallback = (
    <div className="d-flex justify-content-center align-items-center vh-100">
        <Spinner animation="border" />
    </div>
);

function App() {
    useEffect(() => { initSession(); }, []);

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

                    {/* Javna platforma (Chapter 6+) */}
                    {/* <Route path="/" element={<PublicHomePage />} /> */}

                    <Route path="*" element={<Navigate to="/cms/login" />} />
                </Routes>
            </Suspense>
        </Router>
    );
}

export default App;
