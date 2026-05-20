import { Fragment } from 'react';

export const BOOKING_STEPS = [
  { key: 'tour', label: 'Tour and date' },
  { key: 'passengers', label: 'Passengers and extras' },
  { key: 'contact', label: 'Contact' },
  { key: 'confirmation', label: 'Confirmation' },
];

function stateOf(step, currentIndex, index) {
  if (index < currentIndex) return 'done';
  if (index === currentIndex) return 'active';
  return 'pending';
}

export default function Stepper({ currentStep }) {
  const currentIndex = BOOKING_STEPS.findIndex((s) => s.key === currentStep);

  return (
    <ol className="stepper" aria-label="Booking progress">
      {BOOKING_STEPS.map((step, index) => {
        const state = stateOf(step, currentIndex, index);
        return (
          <Fragment key={step.key}>
            <li
              className={`stepper__step stepper__step--${state}`}
              aria-current={state === 'active' ? 'step' : undefined}
            >
              <span className="stepper__num" aria-hidden="true">
                {state === 'done' ? '✓' : index + 1}
              </span>
              <span className="stepper__label">{step.label}</span>
            </li>
            {index < BOOKING_STEPS.length - 1 && (
              <li className="stepper__divider" aria-hidden="true" />
            )}
          </Fragment>
        );
      })}
    </ol>
  );
}
