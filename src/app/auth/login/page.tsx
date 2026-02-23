import { NewWebsiteWarning } from "@/components/new-website-warning";
import { LoginForm } from "./login-form";

export default function Page() {
  return (
    <div className="flex md:min-h-screen md:items-center md:justify-center">
      <div className="flex flex-col gap-2 max-sm:w-full md:max-w-[50vw] md:m-1">
        <NewWebsiteWarning className="w-full max-w-full" />
        <div className="p-3 md:rounded-xl md:border">
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
