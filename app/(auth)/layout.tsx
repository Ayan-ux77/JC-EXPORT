import styles from "./layout.module.css"
import Image from "next/image"

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <>
            <header className={styles.box}>
                <nav className={styles.nav}>
                    <Image
                        src="/logo.png"
                        alt="JC Export Logo"
                        width={121}
                        height={45}
                    />




                    <div className={styles.right}>
                        <ul className={styles.list}>
                            <li><button>MARKETING ▼</button></li>
                            <li><button>INVENTORY ▼</button></li>
                            <li><button className={styles.authBtn}>AUTHENTICATION ▼</button></li>
                            <li><button>DASHBOARD ▼</button></li>
                        </ul>

                    </div>


                </nav>
            </header>

            <main>
                {children}
            </main>
        </>
    )
}