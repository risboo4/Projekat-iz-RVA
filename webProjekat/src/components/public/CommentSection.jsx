import { useState, useEffect } from 'react';
import { Card, Form, Button, Alert, Spinner } from 'react-bootstrap';
import _axios from '../../axiosInstance.js';
import PaginationControls from '../PaginationControls.jsx';

const PAGE_SIZE = 10;

const CommentSection = ({ articleId }) => {
    const [comments, setComments] = useState([]);
    const [totalCount, setTotalCount] = useState(0);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [authorName, setAuthorName] = useState('');
    const [content, setContent] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState('');

    const fetchComments = async (p) => {
        setLoading(true);
        try {
            const res = await _axios.get(`/api/articles/${articleId}/comments?page=${p}&pageSize=${PAGE_SIZE}`);
            setComments(res.data.data);
            setTotalCount(res.data.totalCount);
        } catch {
            setError('Greška pri učitavanju komentara');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchComments(page); }, [page, articleId]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!authorName.trim() || !content.trim()) {
            setSubmitError('Ime i komentar su obavezni');
            return;
        }
        setSubmitError('');
        setSubmitting(true);
        try {
            await _axios.post(`/api/articles/${articleId}/comments`, {
                authorName: authorName.trim(),
                content: content.trim()
            });
            setAuthorName('');
            setContent('');
            setPage(1);
            fetchComments(1);
        } catch {
            setSubmitError('Greška pri slanju komentara');
        } finally {
            setSubmitting(false);
        }
    };

    const formatDate = (dateStr) => dateStr ? dateStr.substring(0, 16).replace('T', ' ') : '';

    return (
        <div className="mt-4">
            <h5 className="mb-3">Komentari ({totalCount})</h5>

            {error && <Alert variant="danger">{error}</Alert>}

            {loading ? (
                <div className="text-center"><Spinner size="sm" /></div>
            ) : (
                <>
                    {comments.map(comment => (
                        <Card key={comment.id} className="mb-2">
                            <Card.Body>
                                <div className="mb-1">
                                    <strong>{comment.authorName}</strong>
                                    <span className="text-muted ms-2 small">{formatDate(comment.createdAt)}</span>
                                </div>
                                <p className="mb-0">{comment.content}</p>
                            </Card.Body>
                        </Card>
                    ))}

                    <PaginationControls
                        currentPage={page}
                        totalCount={totalCount}
                        pageSize={PAGE_SIZE}
                        onPageChange={setPage}
                    />
                </>
            )}

            <Card className="mt-3">
                <Card.Header>Dodaj komentar</Card.Header>
                <Card.Body>
                    {submitError && <Alert variant="danger" className="py-2">{submitError}</Alert>}
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-2">
                            <Form.Control
                                type="text"
                                placeholder="Vaše ime"
                                value={authorName}
                                onChange={e => setAuthorName(e.target.value)}
                            />
                        </Form.Group>
                        <Form.Group className="mb-2">
                            <Form.Control
                                as="textarea"
                                rows={3}
                                placeholder="Vaš komentar..."
                                value={content}
                                onChange={e => setContent(e.target.value)}
                            />
                        </Form.Group>
                        <Button type="submit" variant="primary" size="sm" disabled={submitting}>
                            {submitting ? 'Slanje...' : 'Pošalji komentar'}
                        </Button>
                    </Form>
                </Card.Body>
            </Card>
        </div>
    );
};

export default CommentSection;
