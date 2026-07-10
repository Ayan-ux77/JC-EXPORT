import "./globals.css";
import styles from "./layout.module.css";
import Image from "next/image";
import { LuPhone } from "react-icons/lu";
import { CiMail } from "react-icons/ci";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <header className={styles.box}>
          <nav className={styles.nav}>
            <section className={styles.number}>
              <p>
                <LuPhone /> +92 300 1234567
              </p>
              <p>
                <CiMail /> info@jcexport.com
              </p>

            </section>

            <section className={styles.language}>
              <p>
                <span>EN</span>
                <span>اردو</span>
                <span>日本語</span>
              </p>
            </section>

          </nav>

          <section className={styles.logo}>

            <Image
              src="/home/image 1.png"
              alt="logo"
              width={205}
              height={72}
            />

            <section className={styles.navbar}>

              <ul  className={styles.list}>
                <li> Home </li>
                <li>About</li>
                <li>Inventory</li>
                <li>Services</li>
                <li>Contact</li>


              </ul>

                
            </section>

            <section className={styles.btn}>
                <button className={styles.btn1}>Browse Inventory</button>
                <button className={styles.btn2}>Get a Quote &rarr;</button>
              </section>
           


          </section>

        </header>



        <main>{children}</main>
      </body>
    </html>
  );
}