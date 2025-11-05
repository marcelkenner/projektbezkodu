import "./ui.css";

export interface StepperStep {
  title: string;
  description?: string;
}

interface StepperProps {
  steps: StepperStep[];
}

export function Stepper({ steps }: StepperProps) {
  return (
    <div className="pbk-stepper" role="list">
      {steps.map((step, index) => (
        <div className="pbk-stepper__step" key={step.title} role="listitem">
          <span className="pbk-stepper__index">{index + 1}</span>
          <div className="pbk-stack pbk-stack--tight">
            <h3>{step.title}</h3>
            {step.description ? <p>{step.description}</p> : null}
          </div>
        </div>
      ))}
    </div>
  );
}
