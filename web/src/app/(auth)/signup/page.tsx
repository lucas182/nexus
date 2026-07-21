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
      <h1 className="mb-1 text-base font-semibold text-text-primary">Criar conta</h1>
      <p className="mb-6 text-sm text-text-tertiary">
        Seu Sistema Operacional Pessoal de Contexto.
      </p>

      {error && (
        <p className="mb-4 rounded-md bg-red-soft px-3 py-2 text-xs text-red">
          {error}
        </p>
      )}

      <form action={signup} className="flex flex-col gap-3">
        <input
          name="email"
          type="email"
          placeholder="Email"
          required
          className="h-10 rounded-md border border-border bg-surface px-3 text-sm text-text-primary outline-none transition-all duration-150 placeholder:text-text-quaternary focus:border-accent"
        />
        <input
          name="password"
          type="password"
          placeholder="Senha (mín. 6 caracteres)"
          required
          minLength={6}
          className="h-10 rounded-md border border-border bg-surface px-3 text-sm text-text-primary outline-none transition-all duration-150 placeholder:text-text-quaternary focus:border-accent"
        />
        <button
          type="submit"
          className="mt-1 h-10 rounded-md bg-accent px-3 text-sm font-medium text-white transition-colors hover:bg-accent-hover active:scale-[0.98]"
        >
          Criar conta
        </button>
      </form>

      <p className="mt-6 text-center text-xs text-text-tertiary">
        Já tem conta?{" "}
        <Link href="/login" className="font-medium text-accent hover:underline">
          Entrar
        </Link>
      </p>
    </>
  );
}
