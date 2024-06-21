import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import Login from "./Login";
import { useUser } from "@auth0/nextjs-auth0/client";

const NavBar = () => {
  const { user, error, isLoading } = useUser();
  const router = useRouter();

  return (
    <nav style={styles.nav}>
      <Link
        href="/"
        style={router.pathname === "/" ? styles.activeLink : styles.link}
      >
        Find Pub
      </Link>
      <Link
        href={user ? "/add-pub" : "/api/auth/login"}
        style={router.pathname === "/add-pub" ? styles.activeLink : styles.link}
      >
        Add Pub
      </Link>
      <Link
        href="/pubs"
        style={router.pathname === "/pubs" ? styles.activeLink : styles.link}
      >
        Pubs
      </Link>
      <Login />
    </nav>
  );
};

const styles = {
  nav: {
    display: "flex",
    padding: "1rem",
    backgroundColor: "#333",
  },
  link: {
    color: "#fff",
    textDecoration: "none",
    padding: "0.5rem 1rem",
  },
  activeLink: {
    color: "#fff",
    textDecoration: "underline",
    padding: "0.5rem 1rem",
  },
};

export default NavBar;
