import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Spinner, Alert } from 'react-bootstrap';
import _axios from '../../axiosInstance.js';
import ArticleCard from '../../components/public/ArticleCard.jsx';
import PaginationControls from '../../components/PaginationControls.jsx';

const PAGE_SIZE = 10;

const PublicCategoryPage = () => {
    const { id } = useParams();
    const [articles, setArticles] = useState([]);
    const [totalCount, setTotalCount] = useState(0);
    const [categoryName, setCategoryName] = useState('');
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        setPage(1);
    }, [id]);

    useEffect(() => {
        setLoading(true);
        Promise.all([
            _axios.get(`/api/articles?categoryId=${id}&page=${page}&pageSize=${PAGE_SIZE}`),
            _axios.get(`/api/categories/${id}`).catch(() => ({ data: { name: '' } })),
        ])
        .then(([artRes, catRes]) => {
            setArticles(artRes.data.data);
            setTotalCount(artRes.data.totalCount);
            setCategoryName(catRes.data.name);
        })
        .catch(() => setError('Greška pri učitavanju'))
        .finally(() => setLoading(false));
    }, [id, page]);

    return (
        <>
            <h2 className="mb-4">Kategorija: {categoryName}</h2>

            {error && <Alert variant="danger">{error}</Alert>}

            {loading ? (
                <div className="text-center mt-5"><Spinner animation="border" /></div>
            ) : (
                <>
                    {articles.length === 0 && <p className="text-muted">Nema vesti u ovoj kategoriji.</p>}
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

export default PublicCategoryPage;
