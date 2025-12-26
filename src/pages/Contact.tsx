import styles from "./Contact.module.css";
// import { FiMail } from "react-icons/fi";
// import { FaGithub, FaLinkedin } from "react-icons/fa";
import Reveal from "../components/Reveal"

export default function Contact() {
    return (
        <section className={styles.page}>
            <Reveal as="header" className={styles.header}>
                <h1>Contact</h1>
                <p className={styles.subtext}>
                For collaboration, research, or opportunities, feel free to reach out.
                </p>
            </Reveal>

            <Reveal className={styles.grid} delayMs={120}>
                <div className={styles.card}>
                    <h2 className={styles.cardTitle}>Send a message</h2>

                    <form 
                        className={styles.form} 
                        action="https://formspree.io/f/xvzpnjwv"
                        method="POST"
                    >
                        <div className={styles.nameFields}>
                            <label className={styles.label}>
                                First Name
                                <input className={styles.input} type="text" name="name" required />
                            </label>

                            <label className={styles.label}>
                                Last Name
                                <input className={styles.input} type="text" name="name" required />
                            </label>
                        </div>

                        <label className={styles.label}>
                            Email
                            <input className={styles.input} type="email" name="email" required />
                        </label>

                        <label className={styles.label}>
                            Phone Number (optional)
                            <input className={styles.input} type="tel" name="phone" />
                        </label>

                        <label className={styles.label}>
                            Message
                            <textarea className={styles.textarea} name="message" rows={5} required />
                        </label>

                        <button className={styles.button} type="submit">Send</button>
                    </form>
                </div>

                {/* <aside>
                    <ul className={styles.links}>
                        <a 
                            className={styles.contactBtn} 
                            href="mailto:you@gwu.edu"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <span className={styles.left}>
                                <span className={styles.label}>Email</span>
                            </span>
                            <span className={styles.iconWrap} aria-hidden="true">
                                <FiMail />
                            </span>
                        </a>

                        <a 
                            className={styles.contactBtn} 
                            href="https://linkin.com/in/okrisetya"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <span className={styles.left}>
                                <span className={styles.label}>LinkedIn</span>
                            </span>
                            <span className={styles.iconWrap} aria-hidden="true">
                                <FaLinkedin />
                            </span>
                        </a>

                        <a 
                            className={styles.contactBtn} 
                            href="https://github.com/OliverKris"
                            target="_blank"
                            rel="noopener noreferrer"
                            >
                            <span className={styles.left}>
                                <span className={styles.label}>GitHub</span>
                            </span>
                            <span className={styles.iconWrap} aria-hidden="true">
                                <FaGithub />
                            </span>
                        </a>
                    </ul>
                </aside> */}
            </Reveal>
        </section>
    );
}
