import Reveal from "../components/Reveal";

export default function Contact() {
    return (
        <section className="grid gap-6">
            <Reveal as="header" className="grid gap-2">
                <h1>Contact</h1>
                <p className="m-0 text-(--muted) max-w-[70ch]">
                    For collaboration, research, or opportunities, feel free to reach out.
                </p>
            </Reveal>

            <Reveal className="grid gap-5" delayMs={120}>
                <div className="bg-(--surface) border border-(--border) rounded-(--radius) p-5">
                    <h2 className="text-[1.1rem] font-extrabold mb-2!">Send a message</h2>

                    <form
                        className="grid gap-4"
                        action="https://formspree.io/f/xvzpnjwv"
                        method="POST"
                    >
                        <div className="flex gap-4">
                            <label className="grid gap-2 font-bold flex-1">
                                First Name
                                <input
                                    className="w-full px-3 py-3 rounded-[calc(var(--radius)-4px)] border border-(--border) bg-(--page) text-(--text) transition-[border-color,background-color] duration-(--theme-dur) ease-(--theme-ease) focus:outline-none focus:shadow-(--ring)"
                                    type="text"
                                    name="firstName"
                                    required
                                />
                            </label>
                            <label className="grid gap-2 font-bold flex-1">
                                Last Name
                                <input
                                    className="w-full px-3 py-3 rounded-[calc(var(--radius)-4px)] border border-(--border) bg-(--page) text-(--text) transition-[border-color,background-color] duration-(--theme-dur) ease-(--theme-ease) focus:outline-none focus:shadow-(--ring)"
                                    type="text"
                                    name="lastName"
                                    required
                                />
                            </label>
                        </div>

                        <label className="grid gap-2 font-bold">
                            Email
                            <input
                                className="w-full px-3 py-3 rounded-[calc(var(--radius)-4px)] border border-(--border) bg-(--page) text-(--text) transition-[border-color,background-color] duration-(--theme-dur) ease-(--theme-ease) focus:outline-none focus:shadow-(--ring)"
                                type="email"
                                name="email"
                                required
                            />
                        </label>

                        <label className="grid gap-2 font-bold">
                            Phone Number (optional)
                            <input
                                className="w-full px-3 py-3 rounded-[calc(var(--radius)-4px)] border border-(--border) bg-(--page) text-(--text) transition-[border-color,background-color] duration-(--theme-dur) ease-(--theme-ease) focus:outline-none focus:shadow-(--ring)"
                                type="tel"
                                name="phone"
                            />
                        </label>

                        <label className="grid gap-2 font-bold">
                            Message
                            <textarea
                                className="w-full px-3 py-3 rounded-[calc(var(--radius)-4px)] border border-(--border) bg-(--page) text-(--text) resize-y transition-[border-color,background-color] duration-(--theme-dur) ease-(--theme-ease) focus:outline-none focus:shadow-(--ring)"
                                name="message"
                                rows={5}
                                required
                            />
                        </label>

                        <button
                            className="w-fit px-4 py-3 rounded-[calc(var(--radius)-4px)] bg-(--accent) text-white! font-extrabold border border-(--accent) cursor-pointer hover:bg-(--accent-hover) hover:border-(--accent-hover) transition-[background-color,border-color] duration-(--theme-dur) ease-(--theme-ease)"
                            type="submit"
                        >
                            Send
                        </button>
                    </form>
                </div>
            </Reveal>
        </section>
    );
}
