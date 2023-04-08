import styles from "../styles/home.module.css";
import Image from "next/image";
import heroImg from "../../public/assets/hero.png";
import Head from "next/head";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { GetStaticPaths, GetStaticProps } from "next";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../services/firebaseConfig";

interface HomeProps {
  posts: number;
  comments: number;
}
export default function Home({ posts, comments }: HomeProps) {
  return (
    <div className={styles.container}>
      <Head>
        <title>Tarefas</title>
      </Head>
      <main className={styles.main}>
        <div className={styles.logoContent}>
          <Image
            className={styles.hero}
            src={heroImg}
            alt="Logo Tarefas"
            priority
          />
        </div>
        <h1 className={styles.title}>
          Sistema feito para voce organizar seus estudos e tarefas
        </h1>

        <div className={styles.infoContent}>
          <section className={styles.box}>
            <span>+{posts} posts</span>
          </section>
          <section className={styles.box}>
            <span>+{comments} comentarios</span>
          </section>
        </div>
      </main>
    </div>
  );
}

// gerar paginas estatiscas
// primeira pessoa que acessar vai ser rapido
// e vai ficar em cache
export const getStaticProps: GetStaticProps = async ({}) => {
  const commentRef = collection(db, "comentarios");
  const postRef = collection(db, "tarefas");

  const commentSnap = await getDocs(commentRef);
  const postSnap = await getDocs(postRef);

  return {
    props: {
      posts: postSnap.size || 0,
      comments: commentSnap.size || 0,
    },
    revalidate: 60,
  };
};
