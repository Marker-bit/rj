"use client";

import { Loader } from "lucide-react";
import { useEffect, useState } from "react";
import type { User } from "lucia";
import { validateRequest } from "@/lib/validate-request";

export default function Page() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    validateRequest().then((res) => {
      setUser(res.user);
    });
    setLoading(false);
  }, []);

  function signUp() {
    setLoading(true);
    fetch("/api/auth", {
      body: JSON.stringify({
        username: "mark",
        password: "hello-world",
      }),
      method: "POST",
    }).then(() => {
      validateRequest().then((res) => {
        setUser(res.user);
        setLoading(false);
      });
    });
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader className="w-6 h-6 animate-spin" />
      </div>
    );
  }

  if (user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        You are signed up as @{user.username}
        <button
          onClick={() => {
            setLoading(true);
            fetch("/api/auth/", {
              method: "DELETE",
            }).then(() => {
              validateRequest().then((res) => {
                setUser(res.user);
                setLoading(false);
              });
            });
          }}
        >
          Log out
        </button>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      {loading ? (
        <Loader className="w-6 h-6 animate-spin" />
      ) : (
        <button onClick={signUp}>Login</button>
      )}
    </div>
  );
}
