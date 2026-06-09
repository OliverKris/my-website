import Reveal from "../components/Reveal";

export default function Contact() {
    return (
        <section className="mx-auto max-w-5xl px-6 pt-10 pb-32">
            <Reveal as="header" className="flex flex-col gap-1 border-b border-layout pb-6 transition-theme">
                <h1 className="text-2xl font-bold tracking-tight text-main transition-theme md:text-3xl">
                    Contact
                </h1>
                <p className="text-muted transition-theme max-w-md">
                    For collaboration, research, or opportunities, feel free to reach out.
                </p>
            </Reveal>

            <Reveal className="mt-12 max-w-2xl" delayMs={120}>
                <div className="rounded-xl border border-layout bg-card p-6 shadow-sm transition-theme">
                    <h2 className="text-lg font-semibold text-main mb-6 transition-theme">Send a message</h2>

                    <form 
                        className="flex flex-col gap-5" 
                        action="https://formspree.io/f/xvzpnjwv"
                        method="POST"
                    >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <label className="flex flex-col gap-1.5 text-xs font-medium text-muted">
                                First Name
                                <input className="rounded-lg border border-layout bg-canvas p-2.5 text-main outline-none focus:ring-2 focus:ring-zinc-400 dark:focus:ring-zinc-600 transition-theme" type="text" name="firstName" required />
                            </label>

                            <label className="flex flex-col gap-1.5 text-xs font-medium text-muted">
                                Last Name
                                <input className="rounded-lg border border-layout bg-canvas p-2.5 text-main outline-none focus:ring-2 focus:ring-zinc-400 dark:focus:ring-zinc-600 transition-theme" type="text" name="lastName" required />
                            </label>
                        </div>

                        <label className="flex flex-col gap-1.5 text-xs font-medium text-muted">
                            Email
                            <input className="rounded-lg border border-layout bg-canvas p-2.5 text-main outline-none focus:ring-2 focus:ring-zinc-400 dark:focus:ring-zinc-600 transition-theme" type="email" name="email" required />
                        </label>

                        <label className="flex flex-col gap-1.5 text-xs font-medium text-muted">
                            Phone Number (optional)
                            <input className="rounded-lg border border-layout bg-canvas p-2.5 text-main outline-none focus:ring-2 focus:ring-zinc-400 dark:focus:ring-zinc-600 transition-theme" type="tel" name="phone" />
                        </label>

                        <label className="flex flex-col gap-1.5 text-xs font-medium text-muted">
                            Message
                            <textarea className="rounded-lg border border-layout bg-canvas p-2.5 text-main outline-none focus:ring-2 focus:ring-zinc-400 dark:focus:ring-zinc-600 transition-theme" name="message" rows={5} required />
                        </label>

                        <button 
                            className="w-full md:w-max rounded-lg bg-zinc-900 dark:bg-zinc-100 px-6 py-2.5 text-sm font-medium text-white dark:text-zinc-900 transition-all hover:opacity-90 active:scale-[0.98]" 
                            type="submit"
                        >
                            Send Message
                        </button>
                    </form>
                </div>
            </Reveal>
        </section>
    );
}