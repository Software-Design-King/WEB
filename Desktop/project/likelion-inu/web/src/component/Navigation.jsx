import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import styled from "@emotion/styled";
import "./Nav.css";
export default function NavBar() {
  return (
    <StyledNavbar expand="lg" data-bs-theme="light">
      <StyledContainer>
        <Navbar.Brand href="#home" className="me-auto">
          <img src="/Logo.png" width="200px" height="auto" alt="Logo" />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse
          id="basic-navbar-nav"
          style={{ justifyContent: "flex-end" }}
        >
          <StyledNav>
            <StyledNavLink href="#About Us">About Us</StyledNavLink>
            <StyledNavLink href="#Roadmap">Roadmap</StyledNavLink>
            <StyledNavLink href="#Activity">Activity</StyledNavLink>
            <ApplyButton href="/apply">지원하기</ApplyButton>
          </StyledNav>
        </Navbar.Collapse>
      </StyledContainer>
    </StyledNavbar>
  );
}

/* Styled Components */
const StyledNavbar = styled(Navbar)`
  background-color: white;
  position: fixed;
  width: 100%;
  top: 0;
  z-index: 1000;
`;

const StyledContainer = styled(Container)`
  width: 80%;
`;

const StyledNav = styled(Nav)`
  display: flex;
  gap: 20px;
  justify-content: center;
  align-items: flex-end;
`;

const StyledNavLink = styled(Nav.Link)`
  color: black;
  text-decoration: none;
  font-weight: 500;
  &:hover {
    color: rgb(255, 119, 16);
  }
`;

const ApplyButton = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  border: none;
  outline: none;
  margin-bottom: 3px;
  padding: 5.5px 12px;
  height: 32px;
  cursor: pointer;
  color: rgb(255, 255, 255);
  background-color: rgb(255, 119, 16);
  border-radius: 4px;
  transition: box-shadow 0.3s ease, transform 0.3s ease;
  :hover {
    opacity: 0.7;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    transform: translateY(-2px);
  }
`;
