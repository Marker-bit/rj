import { RegisterForm } from "./register-form";

export default function Page() {
  return (
    <div className="flex md:min-h-screen md:items-center md:justify-center">
      <div className="md:rounded-xl p-3 md:border md:max-w-[50vw] md:m-1 max-sm:w-full">
        <RegisterForm />
      </div>
    </div>
  );
}
