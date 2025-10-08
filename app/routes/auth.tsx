import { getAuth, getRedirectResult } from "firebase/auth";
import { Outlet, redirect } from "react-router";
import app from "~/firebase";
import type { Route } from "./+types/auth";

export async function clientLoader() {
  const auth = getAuth(app);

  await auth.authStateReady();
  let user = auth.currentUser;

  // let user: UserInfo | null = await new Promise((resolve) => {
  //   const unsubscribe = auth.onAuthStateChanged((user) => {
  //     if (user?.email) {
  //       resolve(user);
  //     } else {
  //       resolve(null);
  //     }
  //     unsubscribe();
  //   });
  // });

  if (!user) {
    if (!import.meta.env.DEV) {
      const result = await getRedirectResult(auth);
      if (!result) {
        return redirect("/login");
      }
      user = result.user;
    } else {
      return redirect("/login");
    }
  }

  return {
    user,
  };
}

export default function Auth({ loaderData }: Route.ComponentProps) {
  if (!loaderData.user) {
    return null;
  }

  return <Outlet />;
}
