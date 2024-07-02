import Link from "next/link";
import { useRouter } from "next/router";
import Login from "./Login";
import { useUser } from "@auth0/nextjs-auth0/client";
import styled from "styled-components";

const NavBar = () => {
  const { user, error, isLoading } = useUser();
  const router = useRouter();

  return (
    <StyledNav>
      <Links className="links">
        <LinkWrapper $active={router.pathname === "/"}>
          <Link href="/">Find Pub</Link>
        </LinkWrapper>
        <LinkWrapper $active={router.pathname === "/add-pub"}>
          <Link
            href={user ? "/add-pub" : "/api/auth/login?returnTo=%2Fadd-pub"}
          >
            Add Pub
          </Link>
        </LinkWrapper>
        {user && (
          <LinkWrapper $active={router.pathname === "/pubs-admin"}>
            <Link href="/pubs-admin">Pubs Admin</Link>
          </LinkWrapper>
        )}
      </Links>
      <Title className="title">Pubs with pool tables</Title>
      <Login />
    </StyledNav>
  );
};

const StyledNav = styled.nav`
  height: 40px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 0;
  background-color: #333;
  color: #fff;
  font-size: 1.2rem;
`;

const Links = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: row;
  width: fit-content;
`;

const Title = styled.div`
  position: absolute;
  left: calc(50% - 80px);
`;

const LinkWrapper = styled.div<{ $active: boolean }>`
  margin-left: 1rem;
  width: fit-content;

  a {
    width: fit-content;
    color: ${(props) => (props.$active ? "#fff" : "#ccc")};
    text-decoration: none;
  }

  a:hover {
    text-decoration: underline;
  }
`;

export default NavBar;
