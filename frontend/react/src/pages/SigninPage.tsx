import SigninForm from "../components/SigninForm";
import UnauthorizedLayout from "../layouts/UnauthorizedLayout";

export default function SigninPage() {
  return (
    <UnauthorizedLayout>
      <div className="grid place-items-center h-screen">
        <SigninForm />
      </div>
    </UnauthorizedLayout>
  )
}