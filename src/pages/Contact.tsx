import styles from "./Contact.module.css";
import { FiMail } from "react-icons/fi";
import { FaGithub, FaLinkedin } from "react-icons/fa";

export default function Contact() {
    return (
        <section className={styles.page}>
            <header className={styles.header}>
                <h1>Contact</h1>
                <p className={styles.subtext}>
                For collaboration, research, or opportunities, feel free to reach out.
                </p>
            </header>

            <div className={styles.grid}>
                <div className={styles.card}>
                    <h2 className={styles.cardTitle}>Send a message</h2>

                    {/* Replace action URL with Formspree endpoint if you use it */}
                    <form className={styles.form} action="#" method="POST">
                        <label className={styles.label}>
                        Name
                        <input className={styles.input} type="text" name="name" required />
                        </label>

                        <label className={styles.label}>
                        Email
                        <input className={styles.input} type="email" name="email" required />
                        </label>

                        <label className={styles.label}>
                        Message
                        <textarea className={styles.textarea} name="message" rows={6} required />
                        </label>

                        <button className={styles.button} type="submit">Send</button>
                    </form>
                </div>

                <aside>
                    <ul className={styles.links}>
                        <li>
                            <a href="mailto:okrisetya@gwu.edu">Email</a>
                            <span><FiMail /></span>
                        </li>
                        <li>
                            <a href="https://github.com/your-username" target="_blank" rel="noreferrer">GitHub</a>
                            <span><FaGithub /></span>
                        </li>
                        <li>
                            <a href="https://linkedin.com/in/your-handle" target="_blank" rel="noreferrer">LinkedIn</a>
                            <span><FaLinkedin /></span>
                        </li>
                    </ul>
                </aside>
            </div>
        </section>
    );
}
