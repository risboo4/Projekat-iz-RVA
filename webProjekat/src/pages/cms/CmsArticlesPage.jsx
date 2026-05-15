import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Table, Button, Alert, Spinner, Badge } from 'react-bootstrap';
import _axios from '../../axiosInstance.js';
import PaginationControls from '../../components/PaginationControls.jsx';

const PAGE_SIZE = 10;

const CmsArticlesPage = () => {
    const [searchParams] = useSearchParams();
    const categoryId = searchParams.get('categoryId');

    const [articles, setArticles] = useState([]);
    const [totalCount, setTotalCount] = useState(0);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [successMsg, setSuccessMsg] = useState('');

    const fetchArticles = async (p = page) => {
        setLoading(true);
        setError('');
        try {
            const url = categoryId
                ? `/api/articles?categoryId=${categoryId}&page=${p}&pageSize=${PAGE_SIZE}`
                : `/api/articles?page=${p}&pageSize=${PAGE_SIZE}`;
            const res = await _axios.get(url);
            setArticles(res.data.data);
            setTotalCount(res.data.totalCount);
        } catch {
            setError('Greška pri učitavanju vesti');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { setPage(1); fetchArticles(1); }, [categoryId]);
    useEffect(() => { fetchArticles(page); }, [page]);

    const handleDelete = async (id, title) => {
        if (!window.confirm(`Obrisati vest "${title}"?`)) return;
        try {
            await _axios.delete(`/api/articles/${id}`);
            setSuccessMsg(`Vest "${title}" je obrisana`);
            fetchArticles(page);
        } catch (err) {
            setError(err.response?.data?.error || 'Greška pri brisanju');
        }
    };

    const formatDate = (dateStr) => dateStr ? dateStr.substring(0, 10) : '';

    return (
        <>
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h2>Vesti {categoryId ? '(filtrirano po kategoriji)' : ''}</h2>
                <Button as={Link} to="/cms/articles/new" variant="primary">
                    + Nova vest
                </Button>
            </div>

            {error && <Alert variant="danger" dismissible onClose={() => setError('')}>{error}</Alert>}
            {successMsg && <Alert variant="success" dismissible onClose={() => setSuccessMsg('')}>{successMsg}</Alert>}

            {loading ? (
                <div className="text-center mt-5"><Spinner animation="border" /></div>
            ) : (
                <>
                    <Table striped bordered hover responsive>
                        <thead className="table-dark">
                            <tr>
                                <th>Naslov</th>
                                <th>Autor</th>
                                <th>Kategorija</th>
                                <th>Tagovi</th>
                                <th>Datum objave</th>
                                <th style={{ width: '160px' }}>Akcije</th>
                            </tr>
                        </thead>
                        <tbody>
                            {articles.length === 0 ? (
                                <tr><td colSpan={6} className="text-center text-muted">Nema vesti</td></tr>
                            ) : articles.map(article => (
                                <tr key={article.id}>
                                    <td>
                                        {/* U Chapter 6 ovaj link vodi na javnu stranicu vesti */}
                                        <Link to={`/article/${article.id}`}>{article.title}</Link>
                                    </td>
                                    <td>{article.authorFirstName} {article.authorLastName}</td>
                                    <td>{article.categoryName}</td>
                                    <td>
                                        {article.tags?.map(tag => (
                                            <Badge key={tag} bg="secondary" className="me-1">{tag}</Badge>
                                        ))}
                                    </td>
                                    <td>{formatDate(article.publishedAt)}</td>
                                    <td>
                                        <Button
                                            as={Link}
                                            to={`/cms/articles/${article.id}/edit`}
                                            variant="outline-secondary"
                                            size="sm"
                                            className="me-2"
                                        >
                                            Izmeni
                                        </Button>
                                        <Button
                                            variant="outline-danger"
                                            size="sm"
                                            onClick={() => handleDelete(article.id, article.title)}
                                        >
                                            Obriši
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>

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

export default CmsArticlesPage;
