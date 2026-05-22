import { useEffect, useState } from "react";
import {
  collection,
  deleteDoc,
  doc,
  limit,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
} from "firebase/firestore";
import { db } from "../../../../firebase";
import styles from "./styles.module.css";

export function EmailSection() {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const messagesQuery = query(
      collection(db, "messages"),
      orderBy("createdAt", "desc"),
      limit(6)
    );

    const unsubscribe = onSnapshot(messagesQuery, (snapshot) => {
      const messageList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setMessages(messageList);
    });

    return unsubscribe;
  }, []);

  const unreadMessages = messages.filter((message) => !message.read).length;

  async function handleMarkAsRead(messageId) {
    await updateDoc(doc(db, "messages", messageId), {
      read: true,
    });
  }

  async function handleDelete(messageId) {
    await deleteDoc(doc(db, "messages", messageId));
  }

  return (
    <section className={styles.email}>
      <div className={styles.emailHeader}>
        <div>
          <h2>Últimas mensagens</h2>
          <span>{unreadMessages} não lidas</span>
        </div>
      </div>

      <div className={styles.emailList}>
        {messages.length === 0 ? (
          <p className={styles.emptyMessage}>Nenhuma mensagem recebida.</p>
        ) : (
          messages.map((message) => (
            <article
              className={`${styles.emailItem} ${
                message.read ? styles.emailItemRead : ""
              }`}
              key={message.id}
            >
              <div className={styles.messageMeta}>
                <strong>{message.name}</strong>
                <span>{message.email}</span>
              </div>

              <h3>{message.subject}</h3>
              <p>{message.message || "Sem mensagem adicional."}</p>

              <div className={styles.messageActions}>
                {!message.read && (
                  <button
                    type="button"
                    onClick={() => handleMarkAsRead(message.id)}
                  >
                    Marcar como lida
                  </button>
                )}

                <button
                  className={styles.deleteButton}
                  type="button"
                  onClick={() => handleDelete(message.id)}
                >
                  Apagar
                </button>
              </div>
            </article>
          ))
        )}
      </div>
    </section>
  );
}
