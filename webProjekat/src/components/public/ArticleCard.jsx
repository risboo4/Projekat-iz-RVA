import { Link } from 'react-router-dom';
import { Card, Badge } from 'react-bootstrap';

const ArticleCard = ({ article }) => {
    const snippet = article.content?.length > 200
        ? article.content.substring(0, 200) + '...'
        : article.content;
    const date = article.publishedAt ? article.publishedAt.substring(0, 10) : '';

    return (
        <Card className="mb-3 shadow-sm">
            <Card.Body>
                <Card.Title>
                    <Link to={`/article/${article.id}`} className="text-decoration-none">
                        {article.title}
                    </Link>
                </Card.Title>
                <div className="text-muted small mb-2">
                    <Badge bg="primary" className="me-2">{article.categoryName}</Badge>
                    {article.authorFirstName} {article.authorLastName} &bull; {date}
                </div>
                <Card.Text>{snippet}</Card.Text>
            </Card.Body>
        </Card>
    );
};

export default ArticleCard;
