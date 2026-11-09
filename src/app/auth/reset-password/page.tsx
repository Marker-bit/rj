import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import ResetPasswordForm from "./form";

export default async function ResetPassword() {
  return (
    <div className="flex md:min-h-screen md:items-center md:justify-center">
      <Card className="m-2 md:max-w-[70vw] lg:max-w-[50vw]">
        <CardHeader>
          <CardTitle>
            <h1>Сброс пароля</h1>
          </CardTitle>
          <CardDescription>
            Для сброса пароля нужны три разные личные книги, уже добавленные в
            аккаунт. Книги из группы не подходят. Для каждой книги укажите
            точное название и автора или точное название и количество страниц.
            Если заполняете автора, проверяется именно он.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <aside className="mb-6 space-y-2 rounded-lg border bg-muted/50 p-4 text-sm">
            <h2 className="font-semibold">
              Если у вас меньше трёх личных книг
            </h2>
            <p>
              Эта форма не сможет сбросить пароль. Если аккаунт открыт на другом
              устройстве, обратитесь в поддержку с него и опишите проблему со
              входом. Доступ к поддержке требует входа в аккаунт.
            </p>
            <div className="flex flex-wrap gap-x-4 gap-y-2">
              <Link className="underline underline-offset-4" href="/auth/login">
                Вернуться ко входу
              </Link>
            </div>
          </aside>
          <ResetPasswordForm />
        </CardContent>
      </Card>
    </div>
  );
}
