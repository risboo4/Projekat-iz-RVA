import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Spinner, Alert, Badge } from 'react-bootstrap';
import _axios from '../../axiosInstance.js';
import CommentSection from '../../components/public/CommentSection.jsx';

const PublicArticlePage = () => {
    const { id } = useParams();
    const [article, setArticle] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        setLoading(true);
        setError('');
        _axios.get(`/api/articles/${id}`)
            .then(res => setArticle(res.data))
            .catch(() => setError('Greška pri učitavanju vesti'))
            .finally(() => setLoading(false));
    }, [id]);

    if (loading) return <div className="text-center mt-5"><Spinner animation="border" /></div>;
    if (error) return <Alert variant="danger">{error}</Alert>;
    if (!article) return null;

    const date = article.publishedAt ? article.publishedAt.substring(0, 10) : '';

    return (
        <>
            <h1 className="mb-3">{article.title}</h1>

            <div className="text-muted mb-3">
                <Badge bg="primary" className="me-2">{article.categoryName}</Badge>
                {article.authorFirstName} {article.authorLastName} &bull; {date}
            </div>

            <div style={{ whiteSpace: 'pre-wrap', lineHeight: '1.7' }} className="mb-4">
                {article.content}
            </div>

            <hr />
            <CommentSection articleId={parseInt(id)} />
        </>
    );
};

export default PublicArticlePage;
