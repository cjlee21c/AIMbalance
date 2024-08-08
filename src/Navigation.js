import React from 'react';
import { Navbar, Nav, Container, NavDropdown } from 'react-bootstrap';
import './Navigation.css';
import { FaUserCircle } from "react-icons/fa";
import { useRecoilValue } from 'recoil';
import { isLoggedInStateAtom } from './atoms';

const Navigation = ({ handleLogout }) => {
  const isLoggedIn = useRecoilValue(isLoggedInStateAtom);
  return (
    <Navbar className="navbar-custom" expand="lg">
      <Container fluid>
        <Navbar.Brand href="/" className='brand-container'>
          <span className="brand-aim">AIm</span>
          <span className="brand-balance">balance</span>     
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            <Nav.Link href="/select">Select</Nav.Link>
            <NavDropdown title="Mode" id="basic-nav-dropdown">
              <NavDropdown.Item href="/ShoulderLive">Shoulder Press</NavDropdown.Item>
              <NavDropdown.Item href="/LatPullDown">Lat Pull Down</NavDropdown.Item>
            </NavDropdown>
            {isLoggedIn ? (
              <>
                <Nav.Link onClick={handleLogout}>Log out</Nav.Link>
                <NavDropdown 
                  title={<FaUserCircle style={{ color:'#87e4e4', fontSize:'2rem', marginRight:'10px', marginBottom:'5px'}}/>}
                  id="basic-nav-dropdown"
                  
                >
                  <NavDropdown.Item href="/Data">My Data</NavDropdown.Item>
                </NavDropdown>
              </>
            ) : (
              <Nav.Link href='/login'>Log in</Nav.Link>
            )}
            
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Navigation;
