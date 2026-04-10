"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";

function ConfirmAccountContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");

  const [status, setStatus] = useState("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setMessage("Invalid confirmation link.");
      return;
    }

    const confirmAccount = async () => {
      try {
        const res = await fetch(`http://localhost:3000/auth/confirm`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token }),
        });
        const data = await res.json();

        if (res.ok) {
          setStatus("success");
          setMessage(data.message || "Your account has been verified!");
        } else {
          setStatus("error");
          setMessage(data.message || "Verification failed or link expired.");
        }
      } catch {
        setStatus("error");
        setMessage("Something went wrong. Please try again.");
      }
    };

    confirmAccount();
  }, [token]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-t gradient-to-t from-chart-1/10 via-white to-white px-4">
      <div className="w-full max-w-[400px] space-y-6">

        <div className="flex justify-center mb-7">
          <Link href="/">
            <Image
              src="/photo/logoVexa.svg"
              alt="Logo"
              width={90}
              height={35}
              priority
              className="object-contain"
            />
          </Link>
        </div>

        <Card className="rounded-3xl border border-slate-200/60 bg-white shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] overflow-hidden">
          <CardContent className="pt-12 pb-10 px-8 flex flex-col items-center">

            {status === "loading" && (
              <div className="flex flex-col items-center gap-4 py-4">
                <Loader2 className="w-12 h-12 text-chart-1 animate-spin opacity-80" />
                <p className="text-slate-500 font-medium text-[14px]">Verifying your account...</p>
              </div>
            )}

            {status !== "loading" && (
              <div className="flex flex-col items-center text-center space-y-4 animate-in fade-in zoom-in duration-300">
                <div className="mb-2">
                  {status === "success" ? (
                    <CheckCircle className="w-16 h-16 text-green-500" />
                  ) : (
                    <XCircle className="w-16 h-16 text-red-500" />
                  )}
                </div>

                <div className="space-y-1">
                  <h1 className="text-xl font-bold text-slate-900 tracking-tight">
                    {status === "success" ? "Verification Success" : "Verification Failed"}
                  </h1>
                  <p className={`text-[13px] font-medium leading-relaxed px-4 ${status === "success" ? "text-slate-500" : "text-red-500"}`}>
                    {message}
                  </p>
                </div>

                <div className="w-full pt-4">
                  {status === "success" ? (
                    <Button
                      className="w-full h-11 rounded-xl bg-slate-900 hover:bg-black text-white font-bold text-[13px] transition-all active:scale-[0.98] shadow-sm"
                      onClick={() => router.push("/auth/sign_in")}
                    >
                      Go to Login
                    </Button>
                  ) : (
                    <Button
                      className="w-full h-11 rounded-xl bg-slate-900 hover:bg-black text-white font-bold text-[13px] transition-all active:scale-[0.98] shadow-sm"
                      onClick={() => router.push("/")}
                    >
                      Back to Home
                    </Button>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function ConfirmAccountPage() {
  return (
    <Suspense fallback={null}>
      <ConfirmAccountContent />
    </Suspense>
  );
}
