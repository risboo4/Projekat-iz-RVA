import { Outlet } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import PublicNavBar from './PublicNavBar.jsx';

const PublicLayout = () => (
    <>
        <PublicNavBar />
        <Container className="mt-4 mb-5">
            <Outlet />
        </Container>
    </>
);

export default PublicLayout;
