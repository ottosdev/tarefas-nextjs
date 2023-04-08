import styles from "../../styles/dashboard.module.css";
import { GetServerSideProps } from "next";
import { getSession } from "next-auth/react";
import Head from "next/head";
import TextArea from "../../components/TextArea";
import { FiShare2, FiTrash } from "react-icons/fi";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { db } from "../../services/firebaseConfig";
import Error from "next/error";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import Link from "next/link";

interface DashboardProps {
  user: {
    email: string;
  };
}

interface TasksProps {
  id: string;
  tarefa: string;
  public: false;
  user: string;
  created: Date;
}
export default function DashBoard({ user }: DashboardProps) {
  const [input, setInput] = useState<string>("");
  const [publicTask, setPublicTask] = useState<boolean>(false);
  const [tasks, setTasks] = useState<TasksProps[]>([]);
  function handleChangePublic(e: ChangeEvent<HTMLInputElement>) {
    setPublicTask(e.target.checked);
  }

  async function onSubmit(event: FormEvent) {
    event.preventDefault();

    if (input === "") return;

    try {
      await addDoc(collection(db, "tarefas"), {
        tarefa: input,
        created: new Date(),
        user: user.email,
        public: publicTask,
      });

      setInput("");
      setPublicTask(false);
    } catch (error: any) {
      console.log(error.message);
    }
  }

  useEffect(() => {
    async function loadTasks() {
      const tarefasRef = collection(db, "tarefas");
      const q = query(
        tarefasRef,
        orderBy("created", "desc"),
        where("user", "==", user.email)
      );

      onSnapshot(q, (snapShot) => {
        let lista: TasksProps[] = [];

        snapShot.forEach((doc) => {
          lista.push({
            id: doc.id,
            tarefa: doc.data().tarefa,
            created: doc.data().created,
            user: doc.data().user,
            public: doc.data().public,
          });
        });
        setTasks(lista);
      });
    }
    loadTasks();
  }, [user.email]);

 async function handleShare(id: string) {
    await navigator.clipboard.writeText(`http://localhost:3000/task/${id}`);
    
  }

  async function deleteTask(id: string) {
    const docRef = doc(db, 'tarefas', id);
    await deleteDoc(docRef);
    
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>Meu painel</title>
      </Head>
      <main className={styles.main}>
        <section className={styles.content}>
          <div className={styles.contentForm}>
            <h1 className={styles.title}>Qual sua tarefa</h1>
            <form onSubmit={onSubmit}>
              <TextArea
                placeholder="Digite sua tarefa"
                value={input}
                onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
                  setInput(e.target.value)
                }
              />
              <div className={styles.checkboxArea}>
                <input
                  type="checkbox"
                  className={styles.checkbox}
                  checked={publicTask}
                  onChange={handleChangePublic}
                />
                <label> Deixar tarefa publica </label>
              </div>
              <button type="submit" className={styles.button}>
                Registrar
              </button>
            </form>
          </div>
        </section>

        <section className={styles.taskContainer}>
          <h1>Minhas tarefas</h1>
          {tasks.map((item) => (
            <article className={styles.task} key={item.id}>
              {item.public && (
                <div className={styles.tagContainer}>
                  <label className={styles.tag}>Publico</label>
                  <button className={styles.shareButton} onClick={() => handleShare(item.id)}>
                    <FiShare2 size={22} color="#3183ff" />
                  </button>
                </div>
              )}

              <div className={styles.taskContent}>
                {item.public ? (
                  <Link href={`/task/${item.id}`}>
                    {" "}
                    <p>{item.tarefa}</p>
                  </Link>
                ) : (
                  <p>{item.tarefa}</p>
                )}
     
                <button className={styles.trash} onClick={() => deleteTask(item.id)}>
                  <FiTrash size={24} color="#ea3140" />
                </button>
              </div>
            </article>
          ))}
        </section>
      </main>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const session = await getSession({ req });
  // console.log(session);

  if (!session?.user) {
    // Se nao tem usuario vamos redirecionar para  /
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  return {
    props: {
      user: {
        email: session.user.email,
      },
    },
  };
};
