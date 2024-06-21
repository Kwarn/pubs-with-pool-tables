import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import DraggableComponent from "./DraggableComponent";
import AddPubForm from "./AddPubForm";

const NavBar = () => {
  const router = useRouter();
  const [isAddPubVisible, setIsAddPubVisible] = useState<boolean>(false);

  const toggleAddPub = () => {
    setIsAddPubVisible(!isAddPubVisible);
  };

  return (
    <nav style={styles.nav}>
      <Link
        href="/"
        style={router.pathname === "/" ? styles.activeLink : styles.link}
      >
        Find Pub
      </Link>
      <Link
        href="/add-pub"
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
      {/* <button onClick={toggleAddPub}>Add Pub</button> */}
      {/* <DraggableComponent
        isVisiable={isAddPubVisible}
        toggleIsVisiable={toggleAddPub}
      >
        <AddPubForm />
      </DraggableComponent> */}
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
