import { Component } from "react";
import { Container, Nav } from "react-bootstrap";

class Footer extends Component {
  render() {
    return (
      <footer className="px-0 px-lg-3">
        <Container fluid>
          <Nav className="justify-content-center">
            <Nav.Item>
              <Nav.Link href="/" onClick={(e) => e.preventDefault()}>
                Home
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link href="/" onClick={(e) => e.preventDefault()}>
                Company
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link href="/" onClick={(e) => e.preventDefault()}>
                Portfolio
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link href="/" onClick={(e) => e.preventDefault()}>
                Blog
              </Nav.Link>
            </Nav.Item>
          </Nav>
            <p className="copyright text-center">
              © {new Date().getFullYear()}{" "}
              <a href="/">dogdev</a>, made with love for better development
            </p>
        </Container>
      </footer>
    );
  }
}

export default Footer;