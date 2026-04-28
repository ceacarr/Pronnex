import { useAuth } from "@/provider/auth-context";
import { Navigate, Outlet } from "react-router";

const AuthLayout = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" />;
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-slate-100">
      <div className="absolute -top-24 -left-24 h-64 w-64 rounded-full bg-cyan-300/35 blur-3xl animate-[authFloat_10s_ease-in-out_infinite]" />
      <div className="absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-blue-400/35 blur-3xl animate-[authFloat_12s_ease-in-out_infinite_reverse]" />

      <div className="relative grid min-h-screen lg:grid-cols-2">
        <section className="flex items-center justify-center p-4 sm:p-8 lg:p-12">
          <div className="w-full max-w-md">
            <Outlet />
          </div>
        </section>

        <section className="relative hidden overflow-hidden lg:flex">
          <img
            src="/images/auth-side.jpg"
            alt="Auth visual"
            className="absolute inset-0 h-full w-full object-cover"
            onError={(event) => {
              const target = event.currentTarget;
              target.style.display = "none";
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-br from-sky-800/95 via-blue-700/92 to-cyan-500/90" />
          <div className="absolute -left-24 top-10 h-80 w-80 rounded-full bg-cyan-300/50 blur-3xl animate-[authFloat_9s_ease-in-out_infinite]" />
          <div className="absolute -right-28 bottom-12 h-[26rem] w-[26rem] rounded-full bg-blue-500/45 blur-3xl animate-[authFloat_11s_ease-in-out_infinite_reverse]" />
          <div className="absolute left-1/3 top-1/4 h-60 w-60 rounded-full bg-indigo-400/35 blur-3xl animate-[authPulse_6s_ease-in-out_infinite]" />
          <div className="auth-shine absolute -left-1/2 top-0 h-full w-1/2" />

          <div className="relative z-10 flex h-full w-full flex-col justify-between p-12 text-white">
            <div className="inline-flex w-fit items-center gap-2 rounded-full bg-white/15 px-5 py-3 text-ls uppercase tracking-[0.18em]">
              <div className="flex items-center justify-between">
                <img
                  src="/abstract-shape.png"
                  className="rounded-lg bg-amber-50 opacity-100"
                  width={30}
                  height={30}
                  alt=""
                />
              </div>
              Pronnex 
            </div>
           
            <div>
              <h2 className="animate-[authFadeUp_.7s_ease-out_forwards] text-5xl font-semibold leading-tight opacity-0 [animation-delay:.08s]">
                Build Faster With Better Project Focus
              </h2>
              <p className="mt-5 max-w-md animate-[authFadeUp_.7s_ease-out_forwards] text-base leading-relaxed text-white/85 opacity-0 [animation-delay:.2s]">
                Keep work visible, align your team, and ship confidently with one clean workspace.
              </p>

              <div className="mt-8 grid gap-3 text-sm text-white/90">
                <p className="animate-[authFadeUp_.7s_ease-out_forwards] opacity-0 [animation-delay:.5s]">
                  ✓ Track team progress in real time
                </p>
                <p className="animate-[authFadeUp_.7s_ease-out_forwards] opacity-0 [animation-delay:.6s]">
                  ✓ Assign members and roles instantly
                </p>
                <p className="animate-[authFadeUp_.7s_ease-out_forwards] opacity-0 [animation-delay:.7s]">
                  ✓ Move from planning to delivery smoothly
                </p>
              </div>

              <p className="mt-8 animate-[authFadeUp_.7s_ease-out_forwards] text-xs tracking-wide text-white/75 opacity-0 [animation-delay:.8s]">
                Secure and role-based collaboration for every workspace.
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
};

export default AuthLayout;
