import Head from "next/head";
import styles from "../../styles/task.module.css";
import { GetServerSideProps } from "next";
import { db } from "../../services/firebaseConfig";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import TextArea from "../../components/TextArea";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { useSession } from "next-auth/react";

import { FiTrash2 } from "react-icons/fi";

interface TasksProps {
  task: {
    tarefa: string;
    public: boolean;
    user: string;
    created: Date;
    taskId: string;
  };
  allComments: CommentsProps[];
}
interface CommentsProps {
  id: string;
  comment: string;
  name: string | null | undefined;
  user: string | null | undefined;
  taskId: string;
}

export default function Task({ task, allComments }: TasksProps) {
  const [input, setInput] = useState<string>("");
  const [comments, setComments] = useState<CommentsProps[]>(allComments || []);

  const { data: sessiion } = useSession();

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();

    if (input === "") return;

    try {
      await addDoc(collection(db, "comentarios"), {
        comment: input,
        created: new Date(),
        user: sessiion?.user?.email,
        name: sessiion?.user?.name,
        taskId: task?.taskId,
      }).then((docRef) => {
        const data = {
          id: docRef.id,
          comment: input,
          user: sessiion?.user?.email,
          name: sessiion?.user?.name,
          taskId: task?.taskId,
        };

        setComments((prev) => [...prev, data]);
      });

      setInput("");
    } catch (error) {}
  }

  async function handleDeleteComments(id: string) {
    try {
      const docRef = doc(db, 'comentarios', id);
      await deleteDoc(docRef);
      const deleteComments = comments.filter((item) => item.id != id)

      setComments(deleteComments);
    } catch (error) {
    }
  }

  const disabled = input.length < 10 ? true : false;

  return (
    <div className={styles.container}>
      <Head>
        <title>Tarefa</title>
      </Head>

      <main className={styles.main}>
        <h1>Tarefa</h1>
        <article className={styles.task}>
          <p>{task.tarefa}</p>
        </article>
      </main>

      <section className={styles.comentarios}>
        <h1>Deixar Comentario</h1>
        <form onSubmit={handleSubmit}>
          <TextArea
            placeholder="Deixar seu comentario"
            value={input}
            onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
              setInput(e.target.value)
            }
          />
          <button type="submit" disabled={disabled}>
            Comentar
          </button>
        </form>
      </section>
      <section className={styles.respostaContainer}>
        <h2>Todos os comentarios</h2>

        {comments.length === 0 && (
          <span>Nenhum comentarios foi encontrado</span>
        )}

        {comments.map((item) => (
          <article key={item.id} className={styles.resposta}>
            <div>
              <label>{item.name}</label>
              {item.user === sessiion?.user?.email && (
                <button  onClick={() => handleDeleteComments(item.id)}>
                  <FiTrash2 size={22} color="red" />
                </button>
              )}
            </div>
            <p>{item.comment}</p>
          </article>
        ))}
      </section>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async ({
  req,
  params,
}) => {
  const id = params?.id as string;
  const q = query(collection(db, "comentarios"), where("taskId", "==", id));
  const snapShotComments = await getDocs(q);

  let allComments: CommentsProps[] = [];

  snapShotComments.forEach((doc) => {
    allComments.push({
      id: doc.id,
      comment: doc.data()?.comment,
      name: doc.data()?.name,
      user: doc.data()?.user,
      taskId: doc.data()?.taskId,
    });
  });

  const docRef = doc(db, "tarefas", id);
  const snapShot = await getDoc(docRef);

  if (snapShot.data() === undefined) {
    return {
      redirect: {
        destination: "/", // mandar para um tela de error
        permanent: false,
      },
    };
  }

  if (!snapShot.data()?.public) {
    return {
      redirect: {
        destination: "/", // mandar para um tela de error
        permanent: false,
      },
    };
  }
  const miliseconds = snapShot.data()?.created?.seconds * 1000;
  const task = {
    tarefa: snapShot.data()?.tarefa,
    created: new Date(miliseconds).toLocaleDateString(),
    user: snapShot.data()?.user,
    public: snapShot.data()?.public,
    taskId: snapShot.id,
  };

  return {
    props: {
      task,
      allComments: allComments,
    },
  };
};
