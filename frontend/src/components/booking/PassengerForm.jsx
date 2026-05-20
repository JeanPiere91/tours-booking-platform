const TYPE_LABEL = {
  adult: { tag: 'Adult · 12+', title: 'Adult' },
  child: { tag: 'Child · 3 to 11', title: 'Child' },
  infant: { tag: 'Infant · 0 to 2', title: 'Infant' },
};

const DOCUMENT_OPTIONS = [
  { value: 'passport', label: 'Passport' },
  { value: 'dni', label: 'DNI' },
  { value: 'id', label: 'ID card' },
];

const COUNTRY_OPTIONS = [
  'Australia',
  'Brazil',
  'Canada',
  'Chile',
  'Colombia',
  'Mexico',
  'Peru',
  'Spain',
  'United Kingdom',
  'United States',
];

export default function PassengerForm({ passenger, index, isHolder, errors = {}, onChange }) {
  const meta = TYPE_LABEL[passenger.type] || TYPE_LABEL.adult;
  const variantClass = passenger.type === 'child'
    ? 'pax-block--child'
    : passenger.type === 'infant'
      ? 'pax-block--infant'
      : '';

  const update = (field) => (event) => onChange(passenger.id, { [field]: event.target.value });

  const fieldError = (field) => errors[`passengers[${index}].${field}`];

  return (
    <fieldset className={`pax-block ${variantClass}`}>
      <legend className="pax-block__head">
        <strong>
          Passenger {index + 1}
          {isHolder ? ' — Holder' : ''}
        </strong>
        <span className="pax-block__tag">{meta.tag}</span>
      </legend>

      <div className="pax-fields">
        <div className="pax-fields__cell">
          <input
            type="text"
            className={`field__input${fieldError('firstName') ? ' field__input--error' : ''}`}
            placeholder="First name"
            value={passenger.firstName}
            onChange={update('firstName')}
            aria-label={`Passenger ${index + 1} first name`}
          />
          {fieldError('firstName') && <p className="field__error">{fieldError('firstName')}</p>}
        </div>
        <div className="pax-fields__cell">
          <input
            type="text"
            className={`field__input${fieldError('lastName') ? ' field__input--error' : ''}`}
            placeholder="Last name"
            value={passenger.lastName}
            onChange={update('lastName')}
            aria-label={`Passenger ${index + 1} last name`}
          />
          {fieldError('lastName') && <p className="field__error">{fieldError('lastName')}</p>}
        </div>

        <div className="pax-fields__cell">
          <select
            className="field__input"
            value={passenger.documentType}
            onChange={update('documentType')}
            aria-label={`Passenger ${index + 1} document type`}
          >
            {DOCUMENT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
        <div className="pax-fields__cell">
          <input
            type="text"
            className={`field__input${fieldError('documentNumber') ? ' field__input--error' : ''}`}
            placeholder="Document number"
            value={passenger.documentNumber}
            onChange={update('documentNumber')}
            aria-label={`Passenger ${index + 1} document number`}
          />
          {fieldError('documentNumber') && (
            <p className="field__error">{fieldError('documentNumber')}</p>
          )}
        </div>

        {passenger.type === 'adult' && (
          <div className="pax-fields__cell pax-fields__cell--full">
            <select
              className={`field__input${fieldError('nationality') ? ' field__input--error' : ''}`}
              value={passenger.nationality}
              onChange={update('nationality')}
              aria-label={`Passenger ${index + 1} nationality`}
            >
              <option value="">Select nationality…</option>
              {COUNTRY_OPTIONS.map((country) => (
                <option key={country} value={country}>
                  {country}
                </option>
              ))}
            </select>
            {fieldError('nationality') && (
              <p className="field__error">{fieldError('nationality')}</p>
            )}
          </div>
        )}

        {(passenger.type === 'child' || passenger.type === 'infant') && (
          <div className="pax-fields__cell pax-fields__cell--full">
            <label className="field__inline-label">
              Date of birth
              <input
                type="date"
                className={`field__input${fieldError('dateOfBirth') ? ' field__input--error' : ''}`}
                value={passenger.dateOfBirth || ''}
                onChange={update('dateOfBirth')}
              />
            </label>
            {fieldError('dateOfBirth') && (
              <p className="field__error">{fieldError('dateOfBirth')}</p>
            )}
          </div>
        )}
      </div>
    </fieldset>
  );
}
