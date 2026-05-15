import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Table, Button, Alert, Spinner, Badge } from 'react-bootstrap';
import _axios from '../../axiosInstance.js';
import PaginationControls from '../../components/PaginationControls.jsx';

const PAGE_SIZE = 10;

const CmsUsersPage = () => {
    const [users, setUsers] = useState([]);
    const [totalCount, setTotalCount] = useState(0);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [successMsg, setSuccessMsg] = useState('');

    const fetchUsers = async (p = page) => {
        setLoading(true);
        setError('');
        try {
            const res = await _axios.get(`/api/users?page=${p}&pageSize=${PAGE_SIZE}`);
            setUsers(res.data.data);
            setTotalCount(res.data.totalCount);
        } catch {
            setError('Greška pri učitavanju korisnika');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchUsers(page); }, [page]);

    const handleToggleStatus = async (user) => {
        const action = user.status === 'ACTIVE' ? 'deaktivirati' : 'aktivirati';
        if (!window.confirm(`Da li želite da ${action} korisnika ${user.firstName} ${user.lastName}?`)) return;
        try {
            await _axios.put(`/api/users/${encodeURIComponent(user.email)}/toggle-status`);
            setSuccessMsg(`Korisnik ${user.firstName} ${user.lastName} je ${user.status === 'ACTIVE' ? 'deaktiviran' : 'aktiviran'}`);
            fetchUsers(page);
        } catch (err) {
            setError(err.response?.data?.error || 'Greška pri promeni statusa');
        }
    };

    return (
        <>
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h2>Korisnici</h2>
                <Button as={Link} to="/cms/users/new" variant="primary">
                    + Dodaj korisnika
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
                                <th>Ime i prezime</th>
                                <th>Email</th>
                                <th>Tip</th>
                                <th>Status</th>
                                <th style={{ width: '200px' }}>Akcije</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.length === 0 ? (
                                <tr><td colSpan={5} className="text-center text-muted">Nema korisnika</td></tr>
                            ) : users.map(user => (
                                <tr key={user.email}>
                                    <td>{user.firstName} {user.lastName}</td>
                                    <td>{user.email}</td>
                                    <td>
                                        <Badge bg={user.type === 'ADMIN' ? 'danger' : 'primary'}>
                                            {user.type === 'ADMIN' ? 'Administrator' : 'Stvaralac sadržaja'}
                                        </Badge>
                                    </td>
                                    <td>
                                        <Badge bg={user.status === 'ACTIVE' ? 'success' : 'secondary'}>
                                            {user.status === 'ACTIVE' ? 'Aktivan' : 'Neaktivan'}
                                        </Badge>
                                    </td>
                                    <td>
                                        <Button
                                            as={Link}
                                            to={`/cms/users/${encodeURIComponent(user.email)}/edit`}
                                            variant="outline-secondary"
                                            size="sm"
                                            className="me-2"
                                        >
                                            Izmeni
                                        </Button>
                                        {user.type === 'CONTENT_CREATOR' && (
                                            <Button
                                                variant={user.status === 'ACTIVE' ? 'outline-warning' : 'outline-success'}
                                                size="sm"
                                                onClick={() => handleToggleStatus(user)}
                                            >
                                                {user.status === 'ACTIVE' ? 'Deaktiviraj' : 'Aktiviraj'}
                                            </Button>
                                        )}
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

export default CmsUsersPage;
