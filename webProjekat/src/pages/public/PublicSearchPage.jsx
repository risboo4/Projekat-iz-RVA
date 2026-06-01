import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Spinner, Alert } from 'react-bootstrap';
import _axios from '../../axiosInstance.js';
import ArticleCard from '../../components/public/ArticleCard.jsx';
import PaginationControls from '../../components/PaginationControls.jsx';

const PAGE_SIZE = 10;

const PublicSearchPage = () => {
    const [searchParams] = useSearchParams();
    const query = searchParams.get('q') || '';
    const [articles, setArticles] = useState([]);
    const [totalCount, setTotalCount] = useState(0);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => { setPage(1); }, [query]);

    useEffect(() => {
        if (!query) return;
        setLoading(true);
        _axios.get(`/api/articles/search?q=${encodeURIComponent(query)}&page=${page}&pageSize=${PAGE_SIZE}`)
            .then(res => {
                setArticles(res.data.data);
                setTotalCount(res.data.totalCount);
            })
            .catch(() => setError('Greška pri pretrazi'))
            .finally(() => setLoading(false));
    }, [query, page]);

    return (
        <>
            <h2 className="mb-1">Rezultati pretrage</h2>
            <p className="text-muted mb-4">
                {query
                    ? <span>Pretraga za: <strong>"{query}"</strong> — {totalCount} rezultat(a)</span>
                    : 'Unesite pojam za pretragu'}
            </p>

            {error && <Alert variant="danger">{error}</Alert>}

            {loading ? (
                <div className="text-center mt-5"><Spinner animation="border" /></div>
            ) : (
                <>
                    {articles.length === 0 && query && <p className="text-muted">Nema rezultata.</p>}
                    {articles.map(article => (
                        <ArticleCard key={article.id} article={article} />
                    ))}
                    <PaginationControls
                        currentPage={page}
                        totalCount={totalCount}
                        pageSize={PAGE_SIZE}
                        onPageChange={setPage}
                    />
                </>
            )}
        </>
    );
};

export default PublicSearchPage;
