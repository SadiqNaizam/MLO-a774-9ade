import React from 'react';
import { cn } from '@/lib/utils';
import { CheckCircle, Dot } from 'lucide-react';

interface CheckoutProgressStepperProps {
  currentStep: number; // 0-indexed
  steps: string[]; // e.g., ["Delivery", "Payment", "Review"]
  className?: string;
}

const CheckoutProgressStepper: React.FC<CheckoutProgressStepperProps> = ({
  currentStep,
  steps,
  className,
}) => {
  console.log("Rendering CheckoutProgressStepper, Current Step:", currentStep);

  if (!steps || steps.length === 0) return null;

  return (
    <nav aria-label="Progress" className={cn("flex items-center justify-between p-4", className)}>
      <ol role="list" className="flex w-full items-center">
        {steps.map((stepName, stepIdx) => (
          <li
            key={stepName}
            className={cn(
              stepIdx !== steps.length - 1 ? 'pr-8 sm:pr-20' : '',
              'relative w-full'
            )}
          >
            {stepIdx < currentStep ? ( // Completed step
              <>
                <div className="absolute inset-0 flex items-center" aria-hidden="true">
                  <div className="h-0.5 w-full bg-orange-500" />
                </div>
                <span
                  className="relative flex h-8 w-8 items-center justify-center rounded-full bg-orange-500 hover:bg-orange-600"
                >
                  <CheckCircle className="h-5 w-5 text-white" aria-hidden="true" />
                  <span className="sr-only">{stepName} - Completed</span>
                </span>
              </>
            ) : stepIdx === currentStep ? ( // Current step
              <>
                <div className="absolute inset-0 flex items-center" aria-hidden="true">
                  <div className="h-0.5 w-full bg-gray-200" />
                </div>
                <span
                  className="relative flex h-8 w-8 items-center justify-center rounded-full border-2 border-orange-500 bg-white"
                  aria-current="step"
                >
                  <span className="h-2.5 w-2.5 rounded-full bg-orange-500" aria-hidden="true" />
                  <span className="sr-only">{stepName} - Current</span>
                </span>
              </>
            ) : ( // Upcoming step
              <>
                <div className="absolute inset-0 flex items-center" aria-hidden="true">
                  <div className="h-0.5 w-full bg-gray-200" />
                </div>
                <span
                  className="group relative flex h-8 w-8 items-center justify-center rounded-full border-2 border-gray-300 bg-white hover:border-gray-400"
                >
                  <Dot className="h-5 w-5 text-gray-400 group-hover:text-gray-500" aria-hidden="true" />
                  <span className="sr-only">{stepName} - Upcoming</span>
                </span>
              </>
            )}
             <p className={cn(
                "absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs font-medium whitespace-nowrap",
                 stepIdx === currentStep ? "text-orange-600" : "text-gray-500"
             )}>
                {stepName}
            </p>
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default CheckoutProgressStepper;