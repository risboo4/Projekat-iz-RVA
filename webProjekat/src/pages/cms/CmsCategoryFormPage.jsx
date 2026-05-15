import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Form, Button, Alert, Spinner } from 'react-bootstrap';
import _axios from '../../axiosInstance.js';

const CmsCategoryFormPage = () => {
    const { id } = useParams();
    const isEdit = Boolean(id);
    const navigate = useNavigate();

    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(isEdit);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (!isEdit) return;
        _axios.get(`/api/categories/${id}`)
            .then(res => {
                setName(res.data.name);
                setDescription(res.data.description);
            })
            .catch(() => setError('Greška pri učitavanju kategorije'))
            .finally(() => setLoading(false));
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSubmitting(true);
        try {
            if (isEdit) {
                await _axios.put(`/api/categories/${id}`, { name, description });
            } else {
                await _axios.post('/api/categories', { name, description });
            }
            navigate('/cms/categories');
        } catch (err) {
            setError(err.response?.data?.error || 'Greška pri čuvanju kategorije');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <div className="text-center mt-5"><Spinner animation="border" /></div>;

    return (
        <>
            <h2 className="mb-4">{isEdit ? 'Izmena kategorije' : 'Nova kategorija'}</h2>

            {error && <Alert variant="danger">{error}</Alert>}

            <Form onSubmit={handleSubmit} style={{ maxWidth: '600px' }}>
                <Form.Group className="mb-3">
                    <Form.Label>Ime kategorije</Form.Label>
                    <Form.Control
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Unesite ime kategorije"
                        required
                    />
                </Form.Group>

                <Form.Group className="mb-4">
                    <Form.Label>Opis</Form.Label>
                    <Form.Control
                        as="textarea"
                        rows={3}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Unesite opis kategorije"
                        required
                    />
                </Form.Group>

                <div className="d-flex gap-2">
                    <Button type="submit" variant="primary" disabled={submitting}>
                        {submitting ? 'Čuvanje...' : 'Sačuvaj'}
                    </Button>
                    <Button variant="secondary" onClick={() => navigate('/cms/categories')}>
                        Otkaži
                    </Button>
                </div>
            </Form>
        </>
    );
};

export default CmsCategoryFormPage;
