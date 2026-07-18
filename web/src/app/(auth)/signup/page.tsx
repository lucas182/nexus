import Link from "next/link";
import { signup } from "@/lib/actions/auth";

export default async function SignupPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <>
      <h1 className="mb-1 text-lg font-semibold text-text-primary">Criar conta</h1>
      <p className="mb-6 text-sm text-text-tertiary">
        Seu Sistema Operacional Pessoal de Contexto.
      </p>

      {error && (
        <p className="mb-4 rounded-md bg-red-50 px-3 py-2 text-xs text-red-600">
          {error}
        </p>
      )}

      <form action={signup} className="flex flex-col gap-3">
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
          placeholder="Senha (mín. 6 caracteres)"
          required
          minLength={6}
          className="rounded-md border border-border px-3 py-2 text-sm text-text-primary outline-none focus:border-accent"
        />
        <button
          type="submit"
          className="mt-1 rounded-md bg-accent px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-accent-hover"
        >
          Criar conta
        </button>
      </form>

      <p className="mt-5 text-center text-xs text-text-tertiary">
        Já tem conta?{" "}
        <Link href="/login" className="font-medium text-accent">
          Entrar
        </Link>
      </p>
    </>
  );
}
