import sectionStyles from "../section-shell.module.css";
import workflowStyles from "../workflow.module.css";

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
    <section
      className={sectionStyles["homepage-section"]}
      aria-labelledby="workflow-heading"
    >
      <div className="pbk-container">
        <h2 id="workflow-heading">{copy.heading}</h2>
        <ol className={workflowStyles["homepage-workflow__list"]}>
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
    <li className={workflowStyles["homepage-workflow__item"]}>
      <span className={workflowStyles["homepage-workflow__number"]}>
        {index + 1}
      </span>
      <div className={workflowStyles["homepage-workflow__body"]}>
        <h3 className={workflowStyles["homepage-workflow__title"]}>
          {step.title}
        </h3>
        <p className={workflowStyles["homepage-workflow__description"]}>
          {step.description}
        </p>
      </div>
    </li>
  );
}
