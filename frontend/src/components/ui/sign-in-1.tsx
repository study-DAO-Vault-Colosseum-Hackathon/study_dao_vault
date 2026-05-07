import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface AuthFormProps extends React.HTMLAttributes<HTMLDivElement> {
  logoSrc: string;
  logoAlt?: string;
  title: string;
  description?: string;
  primaryAction: {
    label: string;
    icon?: React.ReactNode;
    onClick: () => void;
  };
  secondaryActions?: {
    label: string;
    icon?: React.ReactNode;
    onClick: () => void;
  }[];
  skipAction?: {
    label: string;
    onClick: () => void;
  };
  footerContent?: React.ReactNode;
}

const AuthForm = React.forwardRef<HTMLDivElement, AuthFormProps>(
  (
    {
      className,
      logoSrc,
      logoAlt = "Company Logo",
      title,
      description,
      primaryAction,
      secondaryActions,
      skipAction,
      footerContent,
      ...props
    },
    ref,
  ) => {
    return (
      <div className={cn("flex flex-col items-center justify-center", className)}>
        <Card
          ref={ref}
          className={cn(
            "w-full max-w-sm border-white/15 bg-black/55 text-white backdrop-blur-md",
            "animate-in fade-in-0 zoom-in-95 slide-in-from-bottom-4 duration-500",
          )}
          {...props}
        >
          <CardHeader className="text-center">
            <div className="mb-4 flex justify-center">
              <img src={logoSrc} alt={logoAlt} className="h-12 w-12 rounded-[4px] object-contain" />
            </div>
            <CardTitle className="text-2xl font-semibold tracking-tight text-white">{title}</CardTitle>
            {description && <CardDescription className="text-white/75">{description}</CardDescription>}
          </CardHeader>
          <CardContent className="grid gap-4">
            <Button
              onClick={primaryAction.onClick}
              className="h-11 w-full gap-2 bg-purple-600 text-white transition-transform hover:scale-[1.02] hover:bg-purple-700"
            >
              {primaryAction.icon}
              {primaryAction.label}
            </Button>

            {secondaryActions && secondaryActions.length > 0 && (
              <div className="relative my-1">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-white/15" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-black/70 px-2 text-white/60">or</span>
                </div>
              </div>
            )}

            <div className="grid gap-2">
              {secondaryActions?.map((action, index) => (
                <Button
                  key={index}
                  variant="secondary"
                  className="h-11 w-full gap-2 border border-white/20 bg-white/10 text-white transition-transform hover:scale-[1.02] hover:bg-white/15"
                  onClick={action.onClick}
                >
                  {action.icon}
                  {action.label}
                </Button>
              ))}
            </div>
          </CardContent>

          {skipAction && (
            <CardFooter className="flex flex-col">
              <Button
                variant="outline"
                className="h-11 w-full border-white/25 bg-transparent text-white transition-transform hover:scale-[1.02] hover:bg-white/10"
                onClick={skipAction.onClick}
              >
                {skipAction.label}
              </Button>
            </CardFooter>
          )}
        </Card>

        {footerContent && (
          <div className="mt-6 w-full max-w-sm animate-in fade-in-0 zoom-in-95 slide-in-from-bottom-4 px-8 text-center text-sm text-white/70 duration-500 [animation-delay:200ms]">
            {footerContent}
          </div>
        )}
      </div>
    );
  },
);
AuthForm.displayName = "AuthForm";

export { AuthForm };
