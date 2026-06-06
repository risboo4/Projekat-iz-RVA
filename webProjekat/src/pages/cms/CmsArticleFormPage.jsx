import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Form, Button, Alert, Spinner, Badge } from 'react-bootstrap';
import _axios from '../../axiosInstance.js';

const CmsArticleFormPage = () => {
    const { id } = useParams();
    const isEdit = Boolean(id);
    const navigate = useNavigate();

    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [categoryId, setCategoryId] = useState('');
    const [categories, setCategories] = useState([]);
    const [tags, setTags] = useState([]);
    const [tagInput, setTagInput] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        const fetchCategories = _axios.get('/api/categories?page=1&pageSize=100');
        const fetchArticle = isEdit ? _axios.get(`/api/articles/${id}`) : Promise.resolve(null);

        Promise.all([fetchCategories, fetchArticle])
            .then(([catRes, artRes]) => {
                setCategories(catRes.data.data);
                if (artRes) {
                    const a = artRes.data;
                    setTitle(a.title);
                    setContent(a.content);
                    setCategoryId(String(a.categoryId));
                    setTags(a.tags || []);
                }
            })
            .catch(() => setError('Greška pri učitavanju podataka'))
            .finally(() => setLoading(false));
    }, [id]);

    const addTag = () => {
        const trimmed = tagInput.trim();
        if (trimmed && !tags.includes(trimmed)) {
            setTags([...tags, trimmed]);
        }
        setTagInput('');
    };

    const removeTag = (tag) => {
        setTags(tags.filter(t => t !== tag));
    };

    const handleTagKeyDown = (e) => {
        if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault();
            addTag();
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!categoryId) { setError('Odaberite kategoriju'); return; }
        setError('');
        setSubmitting(true);
        try {
            const payload = { title, content, categoryId: parseInt(categoryId), tags };
            if (isEdit) {
                await _axios.put(`/api/articles/${id}`, payload);
            } else {
                await _axios.post('/api/articles', payload);
            }
            navigate('/cms/articles');
        } catch (err) {
            setError(err.response?.data?.error || 'Greška pri čuvanju vesti');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <div className="text-center mt-5"><Spinner animation="border" /></div>;

    return (
        <>
            <h2 className="mb-4">{isEdit ? 'Izmena vesti' : 'Nova vest'}</h2>

            {error && <Alert variant="danger">{error}</Alert>}

            <Form onSubmit={handleSubmit} style={{ maxWidth: '800px' }}>
                <Form.Group className="mb-3">
                    <Form.Label>Naslov</Form.Label>
                    <Form.Control
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Unesite naslov vesti"
                        required
                    />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Kategorija</Form.Label>
                    <Form.Select
                        value={categoryId}
                        onChange={(e) => setCategoryId(e.target.value)}
                        required
                    >
                        <option value="">-- Odaberite kategoriju --</option>
                        {categories.map(cat => (
                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))}
                    </Form.Select>
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Tekst vesti</Form.Label>
                    <Form.Control
                        as="textarea"
                        rows={8}
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="Unesite tekst vesti"
                        required
                    />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Tagovi</Form.Label>
                    <div className="d-flex gap-2 mb-2">
                        <Form.Control
                            type="text"
                            value={tagInput}
                            onChange={(e) => setTagInput(e.target.value)}
                            onKeyDown={handleTagKeyDown}
                            placeholder="Unesite tag i pritisnite Enter"
                        />
                        <Button type="button" variant="outline-secondary" onClick={addTag}>
                            Dodaj
                        </Button>
                    </div>
                    <div className="d-flex flex-wrap gap-1">
                        {tags.map(tag => (
                            <Badge
                                key={tag}
                                bg="secondary"
                                className="d-flex align-items-center gap-1"
                                style={{ fontSize: '0.85rem', cursor: 'default' }}
                            >
                                {tag}
                                <span
                                    style={{ cursor: 'pointer', marginLeft: '4px' }}
                                    onClick={() => removeTag(tag)}
                                >
                                    &times;
                                </span>
                            </Badge>
                        ))}
                    </div>
                </Form.Group>

                <div className="d-flex gap-2">
                    <Button type="submit" variant="primary" disabled={submitting}>
                        {submitting ? 'Čuvanje...' : 'Sačuvaj'}
                    </Button>
                    <Button variant="secondary" onClick={() => navigate('/cms/articles')}>
                        Otkaži
                    </Button>
                </div>
            </Form>
        </>
    );
};

export default CmsArticleFormPage;
