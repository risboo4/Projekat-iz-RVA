import { useState, useEffect } from 'react';
import { Navbar, Nav, Container, Form, FormControl, Button, NavDropdown } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import _axios from '../../axiosInstance.js';

const PublicNavBar = () => {
    const [categories, setCategories] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        _axios.get('/api/categories?page=1&pageSize=100')
            .then(res => setCategories(res.data.data || []))
            .catch(() => {});
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
            setSearchQuery('');
        }
    };

    return (
        <Navbar bg="dark" variant="dark" expand="lg" sticky="top">
            <Container>
                <Navbar.Brand as={Link} to="/" className="fw-bold">RAF Novosti</Navbar.Brand>
                <Navbar.Toggle aria-controls="public-nav" />
                <Navbar.Collapse id="public-nav">
                    <Nav className="me-auto">
                        <Nav.Link as={Link} to="/">Početna</Nav.Link>
                        {categories.length > 0 && (
                            <NavDropdown title="Kategorije" id="categories-dropdown">
                                {categories.map(cat => (
                                    <NavDropdown.Item
                                        key={cat.id}
                                        as={Link}
                                        to={`/category/${cat.id}`}
                                    >
                                        {cat.name}
                                    </NavDropdown.Item>
                                ))}
                            </NavDropdown>
                        )}
                    </Nav>

                    <Form className="d-flex me-3" onSubmit={handleSearch}>
                        <FormControl
                            type="search"
                            placeholder="Pretraži vesti..."
                            className="me-2"
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                        />
                        <Button type="submit" variant="outline-light">Traži</Button>
                    </Form>

                    <Nav>
                        <Nav.Link as={Link} to="/cms/login" className="text-light">CMS</Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default PublicNavBar;
