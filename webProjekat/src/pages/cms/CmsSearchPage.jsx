import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Table, Alert, Spinner } from 'react-bootstrap';
import _axios from '../../axiosInstance.js';
import PaginationControls from '../../components/PaginationControls.jsx';

const PAGE_SIZE = 10;

const CmsSearchPage = () => {
    const [searchParams] = useSearchParams();
    const query = searchParams.get('q') || '';

    const [articles, setArticles] = useState([]);
    const [totalCount, setTotalCount] = useState(0);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const fetchResults = async (p) => {
        if (!query) return;
        setLoading(true);
        setError('');
        try {
            const res = await _axios.get(`/api/articles/search?q=${encodeURIComponent(query)}&page=${p}&pageSize=${PAGE_SIZE}`);
            setArticles(res.data.data);
            setTotalCount(res.data.totalCount);
        } catch {
            setError('Greška pri pretrazi');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { setPage(1); }, [query]);
    useEffect(() => { fetchResults(page); }, [query, page]);

    const formatDate = (dateStr) => dateStr ? dateStr.substring(0, 10) : '';

    return (
        <>
            <h2 className="mb-1">Rezultati pretrage</h2>
            <p className="text-muted mb-3">
                {query ? <>Pretraga za: <strong>"{query}"</strong> — {totalCount} rezultat(a)</> : 'Unesite pojam za pretragu'}
            </p>

            {error && <Alert variant="danger">{error}</Alert>}

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
                                <th>Datum objave</th>
                            </tr>
                        </thead>
                        <tbody>
                            {articles.length === 0 ? (
                                <tr><td colSpan={4} className="text-center text-muted">Nema rezultata</td></tr>
                            ) : articles.map(article => (
                                <tr key={article.id}>
                                    <td><Link to={`/cms/articles/${article.id}/edit`}>{article.title}</Link></td>
                                    <td>{article.authorFirstName} {article.authorLastName}</td>
                                    <td>{article.categoryName}</td>
                                    <td>{formatDate(article.publishedAt)}</td>
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

export default CmsSearchPage;
