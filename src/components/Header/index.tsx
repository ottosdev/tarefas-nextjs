import Link from "next/link";
import styles from "../../styles/header.module.css";
import { useSession, signIn, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
export function Header() {

  const { data: session, status } = useSession();

  return (
    <header className={styles.header}>
      <section className={styles.content}>
        <nav className={styles.nav}>
          <Link href="/" className={styles.logo}>
            <h1>
              Tarefas <span>+</span>
            </h1>
          </Link>
          {session?.user && (
            <Link href="/dashboard" className={styles.meuPainel}>
              <h1>Meu Painel</h1>
            </Link>
          )}
        </nav>
        {status === "loading" ? (
          <></>
        ) : session ? (
          <button onClick={() => signOut()} className={styles.acessar}>
            Ola {session.user?.name}
          </button>
        ) : (
          <button onClick={() => signIn("google")} className={styles.acessar}>
            Acessar
          </button>
        )}
      </section>
    </header>
  );
}
