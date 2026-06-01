import { useState, useEffect } from 'react';
import { Spinner, Alert } from 'react-bootstrap';
import _axios from '../../axiosInstance.js';
import ArticleCard from '../../components/public/ArticleCard.jsx';
import PaginationControls from '../../components/PaginationControls.jsx';

const PAGE_SIZE = 10;

const PublicHomePage = () => {
    const [articles, setArticles] = useState([]);
    const [totalCount, setTotalCount] = useState(0);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        setLoading(true);
        _axios.get(`/api/articles?page=${page}&pageSize=${PAGE_SIZE}`)
            .then(res => {
                setArticles(res.data.data);
                setTotalCount(res.data.totalCount);
            })
            .catch(() => setError('Greška pri učitavanju vesti'))
            .finally(() => setLoading(false));
    }, [page]);

    return (
        <>
            <h2 className="mb-4">Najnovije vesti</h2>

            {error && <Alert variant="danger">{error}</Alert>}

            {loading ? (
                <div className="text-center mt-5"><Spinner animation="border" /></div>
            ) : (
                <>
                    {articles.length === 0 && <p className="text-muted">Nema vesti.</p>}
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

export default PublicHomePage;
