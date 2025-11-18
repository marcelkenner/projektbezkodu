export interface WorkflowStep {
  title: string;
  description: string;
}

export interface WorkflowCopy {
  heading: string;
  steps: WorkflowStep[];
}

export function WorkflowSection({ copy }: { copy: WorkflowCopy }) {
  if (!copy.steps.length) {
    return null;
  }

  return (
    <section className="homepage-section" aria-labelledby="workflow-heading">
      <div className="pbk-container">
        <h2 id="workflow-heading">{copy.heading}</h2>
        <ol className="homepage-workflow__list">
          {copy.steps.map((step, index) => (
            <WorkflowStepItem key={step.title} index={index} step={step} />
          ))}
        </ol>
      </div>
    </section>
  );
}

function WorkflowStepItem({
  index,
  step,
}: {
  index: number;
  step: WorkflowStep;
}) {
  return (
    <li className="homepage-workflow__item">
      <span className="homepage-workflow__number">{index + 1}</span>
      <div className="homepage-workflow__body">
        <h3 className="homepage-workflow__title">{step.title}</h3>
        <p className="homepage-workflow__description">{step.description}</p>
      </div>
    </li>
  );
}
