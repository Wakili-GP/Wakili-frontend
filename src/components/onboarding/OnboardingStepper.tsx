import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

interface OnboardingStepperProps {
  currentStep: number;
  completedSteps?: number[];
  steps: { title: string; description: string }[];
  onStepClick?: (step: number) => void;
}

const OnboardingStepper = ({
  currentStep,
  completedSteps = [],
  steps,
  onStepClick,
}: OnboardingStepperProps) => {
  return (
    <div className="w-full py-4 flex justify-center">
      <div className="flex items-center">
        {steps.map((step, index) => {
          const stepNumber = index + 1;
          const isCompleted = completedSteps.includes(stepNumber);
          const isCurrent = currentStep === stepNumber;
          const isClickable = isCompleted && onStepClick;

          return (
            <div key={index} className="flex items-center">
              <div className="flex flex-col items-center">
                <div
                  onClick={() => isClickable && onStepClick(stepNumber)}
                  className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all",
                    isCompleted
                      ? "bg-primary text-primary-foreground"
                      : isCurrent
                        ? "bg-primary text-primary-foreground ring-4 ring-primary/20"
                        : "bg-muted text-muted-foreground",
                    isClickable && "cursor-pointer hover:opacity-80",
                  )}
                >
                  {isCompleted ? <Check className="w-5 h-5" /> : stepNumber}
                </div>

                <div className="mt-2 text-center hidden md:block">
                  <p
                    className={cn(
                      "text-sm font-medium",
                      isCurrent || isCompleted
                        ? "text-foreground"
                        : "text-muted-foreground",
                    )}
                  >
                    {step.title}
                  </p>
                  <p className="text-xs text-muted-foreground max-w-[100px]">
                    {step.description}
                  </p>
                </div>
              </div>

              {index < steps.length - 1 && (
                <div
                  className={cn(
                    "w-20 h-1 mx-3 rounded-full transition-all",
                    isCompleted ? "bg-primary" : "bg-muted",
                  )}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default OnboardingStepper;
