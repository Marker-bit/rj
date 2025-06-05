import { LoginForm } from "./login-form";

export default function Page() {
  return (
    <div className="flex md:min-h-screen md:items-center md:justify-center">
      <div className="p-3 max-sm:w-full md:m-1 md:max-w-[50vw] md:rounded-xl md:border">
        <LoginForm />
      </div>
    </div>
  );
}
