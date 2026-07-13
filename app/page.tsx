export default function Home() {
  return (
    <div className="flex min-h-screen flex-1 items-center justify-center bg-zinc-50 px-6 font-sans dark:bg-black">
      <main className="flex flex-col items-center text-center">
        <span className="mb-6 rounded-full border border-zinc-200 bg-white px-4 py-1 text-sm font-medium text-zinc-500 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400">
          CCRA
        </span>

        <h1 className="max-w-2xl bg-gradient-to-br from-zinc-900 via-zinc-700 to-zinc-400 bg-clip-text text-5xl font-bold leading-tight tracking-tight text-transparent dark:from-white dark:via-zinc-300 dark:to-zinc-600 sm:text-6xl">
          Welcome to CCRA!
        </h1>

        <p className="mt-6 max-w-md text-lg leading-relaxed text-zinc-500 dark:text-zinc-400">
          The page is loaded. The database is connected. Now its upto you.
        </p>

        <div className="mt-10 h-px w-24 bg-gradient-to-r from-transparent via-zinc-300 to-transparent dark:via-zinc-700" />
      </main>
    </div>
  );
}