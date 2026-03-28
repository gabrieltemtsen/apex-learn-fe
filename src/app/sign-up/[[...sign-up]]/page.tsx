import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <div className="min-h-screen bg-[#0f172a] flex items-center justify-center">
      <SignUp />
    </div>
  );
}
