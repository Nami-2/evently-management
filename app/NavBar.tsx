import React from "react";
import Link from "next/link";

const NavBar = () => {
  return (
    <>
      <nav>
        <Link href="/">Logo</Link>
        <ul>
            <li><Link href="/">Dashboard</Link></li>
            <li><Link href="/"></Link></li>
        </ul>
      </nav>
    </>
  );
};

export default NavBar;
