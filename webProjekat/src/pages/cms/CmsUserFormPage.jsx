import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Form, Button, Alert, Spinner, Row, Col } from 'react-bootstrap';
import _axios from '../../axiosInstance.js';

const CmsUserFormPage = () => {
    const { email: encodedEmail } = useParams();
    const email = encodedEmail ? decodeURIComponent(encodedEmail) : null;
    const isEdit = Boolean(email);
    const navigate = useNavigate();

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [userEmail, setUserEmail] = useState('');
    const [type, setType] = useState('CONTENT_CREATOR');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(isEdit);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (!isEdit) return;
        _axios.get(`/api/users?page=1&pageSize=1000`)
            .then(res => {
                const user = res.data.data.find(u => u.email === email);
                if (user) {
                    setFirstName(user.firstName);
                    setLastName(user.lastName);
                    setUserEmail(user.email);
                    setType(user.type);
                }
            })
            .catch(() => setError('Greška pri učitavanju korisnika'))
            .finally(() => setLoading(false));
    }, [email]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!isEdit) {
            if (password.length < 4) { setError('Lozinka mora imati najmanje 4 karaktera'); return; }
            if (password !== confirmPassword) { setError('Lozinke se ne podudaraju'); return; }
        }

        setSubmitting(true);
        try {
            if (isEdit) {
                await _axios.put(`/api/users/${encodeURIComponent(email)}`, { firstName, lastName, type });
            } else {
                await _axios.post('/api/users', { firstName, lastName, email: userEmail, type, password });
            }
            navigate('/cms/users');
        } catch (err) {
            setError(err.response?.data?.error || 'Greška pri čuvanju korisnika');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <div className="text-center mt-5"><Spinner animation="border" /></div>;

    return (
        <>
            <h2 className="mb-4">{isEdit ? 'Izmena korisnika' : 'Novi korisnik'}</h2>

            {error && <Alert variant="danger">{error}</Alert>}

            <Form onSubmit={handleSubmit} style={{ maxWidth: '600px' }}>
                <Row className="mb-3">
                    <Col>
                        <Form.Group>
                            <Form.Label>Ime</Form.Label>
                            <Form.Control
                                type="text"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                placeholder="Ime"
                                required
                            />
                        </Form.Group>
                    </Col>
                    <Col>
                        <Form.Group>
                            <Form.Label>Prezime</Form.Label>
                            <Form.Control
                                type="text"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                                placeholder="Prezime"
                                required
                            />
                        </Form.Group>
                    </Col>
                </Row>

                {!isEdit && (
                    <Form.Group className="mb-3">
                        <Form.Label>Email</Form.Label>
                        <Form.Control
                            type="email"
                            value={userEmail}
                            onChange={(e) => setUserEmail(e.target.value)}
                            placeholder="email@primer.com"
                            required
                        />
                    </Form.Group>
                )}

                {isEdit && (
                    <Form.Group className="mb-3">
                        <Form.Label>Email</Form.Label>
                        <Form.Control type="email" value={email} disabled />
                    </Form.Group>
                )}

                <Form.Group className="mb-3">
                    <Form.Label>Tip korisnika</Form.Label>
                    <Form.Select value={type} onChange={(e) => setType(e.target.value)}>
                        <option value="CONTENT_CREATOR">Stvaralac sadržaja</option>
                        <option value="ADMIN">Administrator</option>
                    </Form.Select>
                </Form.Group>

                {!isEdit && (
                    <>
                        <Form.Group className="mb-3">
                            <Form.Label>Lozinka</Form.Label>
                            <Form.Control
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Unesite lozinku"
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-4">
                            <Form.Label>Potvrda lozinke</Form.Label>
                            <Form.Control
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="Ponovite lozinku"
                                required
                            />
                        </Form.Group>
                    </>
                )}

                <div className="d-flex gap-2">
                    <Button type="submit" variant="primary" disabled={submitting}>
                        {submitting ? 'Čuvanje...' : 'Sačuvaj'}
                    </Button>
                    <Button variant="secondary" onClick={() => navigate('/cms/users')}>
                        Otkaži
                    </Button>
                </div>
            </Form>
        </>
    );
};

export default CmsUserFormPage;
