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
      <h1 className="mb-1 text-lg font-semibold text-text-primary">Entrar</h1>
      <p className="mb-6 text-sm text-text-tertiary">
        Capturar primeiro. Organizar depois.
      </p>

      {confirm && (
        <p className="mb-4 rounded-md bg-accent-soft px-3 py-2 text-xs text-accent">
          Conta criada. Confirme seu email antes de entrar.
        </p>
      )}
      {error && (
        <p className="mb-4 rounded-md bg-red-50 px-3 py-2 text-xs text-red-600">
          {error}
        </p>
      )}

      <form action={login} className="flex flex-col gap-3">
        <input
          name="email"
          type="email"
          placeholder="Email"
          required
          className="rounded-md border border-border px-3 py-2 text-sm text-text-primary outline-none focus:border-accent"
        />
        <input
          name="password"
          type="password"
          placeholder="Senha"
          required
          className="rounded-md border border-border px-3 py-2 text-sm text-text-primary outline-none focus:border-accent"
        />
        <button
          type="submit"
          className="mt-1 rounded-md bg-accent px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-accent-hover"
        >
          Entrar
        </button>
      </form>

      <p className="mt-5 text-center text-xs text-text-tertiary">
        Ainda não tem conta?{" "}
        <Link href="/signup" className="font-medium text-accent">
          Criar conta
        </Link>
      </p>
    </>
  );
}
