import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ShieldCheck } from "lucide-react";

export const Route = createFileRoute("/auth")({
  component: AuthPage,
  head: () => ({
    meta: [
      { title: "Admin sign in — Travel BackOffice Partners" },
      { name: "description", content: "Secure sign in for the Travel BackOffice Partners price administration panel." },
      { name: "robots", content: "noindex, nofollow" },
      { property: "og:title", content: "Admin sign in — Travel BackOffice Partners" },
      { property: "og:description", content: "Secure sign in for the price administration panel." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
});

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ kind: "error" | "ok"; text: string } | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: "/admin" });
    });
  }, [navigate]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setMsg(null);
    if (mode === "signin") {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      setBusy(false);
      if (error) return setMsg({ kind: "error", text: error.message });
      navigate({ to: "/admin" });
    } else {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: `${window.location.origin}/auth` },
      });
      setBusy(false);
      if (error) return setMsg({ kind: "error", text: error.message });
      if (data.session) return navigate({ to: "/admin" });
      setMsg({ kind: "ok", text: "Account created. Check your inbox to confirm your email, then sign in." });
      setMode("signin");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 text-foreground">
      <Card className="glass w-full max-w-md">
        <CardHeader>
          <div className="flex items-center gap-2 text-[var(--teal-glow)]">
            <ShieldCheck className="h-5 w-5" />
            <span className="text-xs font-semibold uppercase tracking-wider">Admin area</span>
          </div>
          <CardTitle className="font-display text-2xl">{mode === "signin" ? "Sign in" : "Create admin account"}</CardTitle>
          <CardDescription>
            {mode === "signin"
              ? "Manage the prices shown on the website."
              : "The first account created becomes the administrator."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={submit} className="space-y-3">
            <Input type="email" required placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <Input
              type="password"
              required
              minLength={8}
              placeholder="Password (min 8 characters)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {msg && (
              <p className={`text-sm ${msg.kind === "error" ? "text-[var(--rose)]" : "text-[var(--teal-glow)]"}`}>{msg.text}</p>
            )}
            <Button type="submit" disabled={busy} className="w-full btn-teal">
              {busy ? "Please wait…" : mode === "signin" ? "Sign in" : "Create account"}
            </Button>
          </form>
          <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
            <button type="button" className="underline-offset-4 hover:underline" onClick={() => setMode(mode === "signin" ? "signup" : "signin")}>
              {mode === "signin" ? "First time? Create account" : "Already have an account? Sign in"}
            </button>
            <Link to="/" className="hover:underline underline-offset-4">Back to site</Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
