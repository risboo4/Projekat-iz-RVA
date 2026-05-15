import { useState } from 'react';
import { Navbar, Nav, Container, Button, Form, FormControl } from 'react-bootstrap';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { getRole, getFullName, logout } from '../auth.js';

const CmsNavBar = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const isAdmin = getRole() === 'ADMIN';
    const [searchQuery, setSearchQuery] = useState('');

    const isActive = (path) => location.pathname.startsWith(path) ? 'active' : '';

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/cms/search?q=${encodeURIComponent(searchQuery.trim())}`);
        }
    };

    return (
        <Navbar bg="dark" variant="dark" expand="lg">
            <Container>
                <Navbar.Brand>RAF Novosti — CMS</Navbar.Brand>
                <Navbar.Toggle aria-controls="cms-nav" />
                <Navbar.Collapse id="cms-nav">
                    <Nav className="me-auto">
                        <Nav.Link as={Link} to="/cms/categories" className={isActive('/cms/categories')}>
                            Kategorije
                        </Nav.Link>
                        <Nav.Link as={Link} to="/cms/articles" className={isActive('/cms/articles')}>
                            Vesti
                        </Nav.Link>
                        {isAdmin && (
                            <Nav.Link as={Link} to="/cms/users" className={isActive('/cms/users')}>
                                Korisnici
                            </Nav.Link>
                        )}
                    </Nav>

                    <Form className="d-flex me-3" onSubmit={handleSearch}>
                        <FormControl
                            type="search"
                            placeholder="Pretraži vesti..."
                            className="me-2"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <Button type="submit" variant="outline-light">Traži</Button>
                    </Form>

                    <Nav className="align-items-center gap-3">
                        <span className="text-light">{getFullName()}</span>
                        <Button variant="outline-light" size="sm" onClick={() => logout(navigate)}>
                            Odjavi se
                        </Button>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default CmsNavBar;
