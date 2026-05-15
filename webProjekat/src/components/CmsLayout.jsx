import { Outlet } from 'react-router-dom';
import CmsNavBar from './CmsNavBar.jsx';
import { Container } from 'react-bootstrap';

const CmsLayout = () => (
    <>
        <CmsNavBar />
        <Container className="mt-4">
            <Outlet />
        </Container>
    </>
);

export default CmsLayout;
