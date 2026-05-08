import { Chrome, Github, Mail } from "lucide-react";
import { AuthForm } from "@/components/ui/sign-in-1";

const AuthFormDemo = () => {
  const companyLogoSrc = "/image.png";

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-background p-4">
      <AuthForm
        logoSrc={companyLogoSrc}
        logoAlt="EduChainNP Logo"
        title="Welcome Back"
        description="Continue to EduChainNP."
        primaryAction={{
          label: "Continue with Google",
          icon: <Chrome className="mr-2 h-4 w-4" />,
          onClick: () => alert("Google login clicked"),
        }}
        secondaryActions={[
          {
            label: "Continue with Email",
            icon: <Mail className="mr-2 h-4 w-4" />,
            onClick: () => alert("Email login clicked"),
          },
          {
            label: "Continue with Github",
            icon: <Github className="mr-2 h-4 w-4" />,
            onClick: () => alert("Github login clicked"),
          },
        ]}
        skipAction={{
          label: "Skip for now",
          onClick: () => alert("Skip clicked"),
        }}
      />
    </div>
  );
};

export default AuthFormDemo;
