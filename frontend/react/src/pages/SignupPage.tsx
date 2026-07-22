import SignupForm from "../components/SignupForm";
import UnauthorizedLayout from "../layouts/UnauthorizedLayout";

export default function SignupPage() {
  return (
    <UnauthorizedLayout>
      <div className="grid place-items-center h-screen">
        <SignupForm />
      </div>
    </UnauthorizedLayout>
  )
}