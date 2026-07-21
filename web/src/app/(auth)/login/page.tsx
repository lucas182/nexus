import Link from "next/link";
import { login } from "@/lib/actions/auth";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; confirm?: string }>;
}) {
  const { error, confirm } = await searchParams;

  return (
    <>
      <h1 className="mb-1 text-base font-semibold text-text-primary">Entrar</h1>
      <p className="mb-6 text-sm text-text-tertiary">
        Capturar primeiro. Organizar depois.
      </p>

      {confirm && (
        <p className="mb-4 rounded-md bg-green-soft px-3 py-2 text-xs text-green">
          Conta criada. Confirme seu email antes de entrar.
        </p>
      )}
      {error && (
        <p className="mb-4 rounded-md bg-red-soft px-3 py-2 text-xs text-red">
          {error}
        </p>
      )}

      <form action={login} className="flex flex-col gap-3">
        <input
          name="email"
          type="email"
          placeholder="Email"
          required
          className="h-10 rounded-md border border-border bg-surface px-3 text-sm text-text-primary outline-none transition-all placeholder:text-text-tertiary focus:border-accent focus:ring-2 focus:ring-accent-muted/50"
        />
        <input
          name="password"
          type="password"
          placeholder="Senha"
          required
          className="h-10 rounded-md border border-border bg-surface px-3 text-sm text-text-primary outline-none transition-all placeholder:text-text-tertiary focus:border-accent focus:ring-2 focus:ring-accent-muted/50"
        />
        <button
          type="submit"
          className="mt-1 h-10 rounded-md bg-accent px-3 text-sm font-medium text-white transition-colors hover:bg-accent-hover active:scale-[0.98]"
        >
          Entrar
        </button>
      </form>

      <p className="mt-6 text-center text-xs text-text-tertiary">
        Ainda não tem conta?{" "}
        <Link href="/signup" className="font-medium text-accent hover:underline">
          Criar conta
        </Link>
      </p>
    </>
  );
}
