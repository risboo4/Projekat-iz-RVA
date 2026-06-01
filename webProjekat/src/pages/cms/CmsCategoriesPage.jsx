import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Table, Button, Alert, Spinner } from 'react-bootstrap';
import _axios from '../../axiosInstance.js';
import PaginationControls from '../../components/PaginationControls.jsx';

const PAGE_SIZE = 10;

const CmsCategoriesPage = () => {
    const [categories, setCategories] = useState([]);
    const [totalCount, setTotalCount] = useState(0);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [successMsg, setSuccessMsg] = useState('');

    const fetchCategories = async (p = page) => {
        setLoading(true);
        setError('');
        try {
            const res = await _axios.get(`/api/categories?page=${p}&pageSize=${PAGE_SIZE}`);
            setCategories(res.data.data);
            setTotalCount(res.data.totalCount);
        } catch {
            setError('Greška pri učitavanju kategorija');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchCategories(page); }, [page]);

    const handleDelete = async (id, name) => {
        if (!window.confirm(`Obrisati kategoriju "${name}"?`)) return;
        try {
            await _axios.delete(`/api/categories/${id}`);
            setSuccessMsg(`Kategorija "${name}" je obrisana`);
            fetchCategories(page);
        } catch (err) {
            setError(err.response?.data?.error || 'Greška pri brisanju');
        }
    };

    return (
        <>
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h2>Kategorije</h2>
                <Button as={Link} to="/cms/categories/new" variant="primary">
                    + Dodaj kategoriju
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
                                <th>Ime</th>
                                <th>Opis</th>
                                <th style={{ width: '160px' }}>Akcije</th>
                            </tr>
                        </thead>
                        <tbody>
                            {categories.length === 0 ? (
                                <tr><td colSpan={3} className="text-center text-muted">Nema kategorija</td></tr>
                            ) : categories.map(cat => (
                                <tr key={cat.id}>
                                    <td>
                                        <Link to={`/cms/articles?categoryId=${cat.id}`}>{cat.name}</Link>
                                    </td>
                                    <td>{cat.description}</td>
                                    <td>
                                        <Button
                                            as={Link}
                                            to={`/cms/categories/${cat.id}/edit`}
                                            variant="outline-secondary"
                                            size="sm"
                                            className="me-2"
                                        >
                                            Izmeni
                                        </Button>
                                        <Button
                                            variant="outline-danger"
                                            size="sm"
                                            onClick={() => handleDelete(cat.id, cat.name)}
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

export default CmsCategoriesPage;
