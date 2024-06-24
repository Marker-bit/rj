import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import ResetPasswordForm from "./form"

export default async function ResetPassword() {
  return (
    <div className="flex md:min-h-screen md:items-center md:justify-center">
      <Card className="m-2 md:max-w-[70vw] lg:max-w-[50vw]">
        <CardHeader>
          <CardTitle>Сброс пароля</CardTitle>
          <CardDescription>
            Вы можете сбросить пароль, указав информацию об аккаунте. Указанные
            книги не должны быть из группы. Вы должны указать либо название
            книги и количество страниц, либо название книги и автора книги
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResetPasswordForm />
        </CardContent>
      </Card>
    </div>
  )
}
