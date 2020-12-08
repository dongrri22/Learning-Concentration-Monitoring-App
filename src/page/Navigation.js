import React from 'react';
import { Navbar, Nav, Form, FormControl, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

function Navigation() {
  return (
    <div className="Navigation">
        <Navbar bg="primary" variant="dark">
            <Navbar.Brand href="#home">Menu</Navbar.Brand>
            <Nav className="mr-auto">
                <Nav.Link href="/">Main</Nav.Link>
                <Nav.Link href="/Monitor">Monitor</Nav.Link>
                <Nav.Link href="/Check">Check</Nav.Link>
            </Nav>
            <Form inline>
                <Button variant="outline-info">LogIn</Button>
                <Button variant="outline-info">SignIn</Button>
            </Form>
        </Navbar>
    </div>
  );
}

export default Navigation;