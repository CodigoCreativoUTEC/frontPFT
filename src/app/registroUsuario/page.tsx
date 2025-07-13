import RegisterForm from "@/components/Helpers/RegisterForm";

export default function RegistroUsuarioPage() {
  return (
    <div className="flex h-screen items-center justify-center bg-gray-100 dark:bg-boxdark">
      <div className="w-full max-w-md">
        <RegisterForm />
      </div>
    </div>
  );
} 