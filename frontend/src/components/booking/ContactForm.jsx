export default function ContactForm({ value, onChange, errors = {} }) {
  const update = (field) => (event) => {
    const next = field === 'acceptTerms' ? event.target.checked : event.target.value;
    onChange({ ...value, [field]: next });
  };

  const fieldError = (field) => errors[`contact.${field}`];

  return (
    <div className="contact-form">
      <div className="field">
        <label className="field__label" htmlFor="contact-email">
          <span aria-hidden="true">✉</span> Email
        </label>
        <input
          id="contact-email"
          type="email"
          className={`field__input${fieldError('email') ? ' field__input--error' : ''}`}
          placeholder="you@example.com"
          value={value.email}
          onChange={update('email')}
          required
        />
        {fieldError('email') && <p className="field__error">{fieldError('email')}</p>}
      </div>

      <div className="field">
        <label className="field__label" htmlFor="contact-phone">
          <span aria-hidden="true">📞</span> Phone (with country code)
        </label>
        <input
          id="contact-phone"
          type="tel"
          className={`field__input${fieldError('phone') ? ' field__input--error' : ''}`}
          placeholder="+51 999 999 999"
          value={value.phone}
          onChange={update('phone')}
          required
        />
        {fieldError('phone') && <p className="field__error">{fieldError('phone')}</p>}
      </div>

      <div className="field">
        <label className="field__label" htmlFor="contact-comments">
          <span aria-hidden="true">💬</span> Additional comments
        </label>
        <textarea
          id="contact-comments"
          className="field__input field__input--textarea"
          rows={3}
          placeholder="Dietary needs, arrival flight, anything else we should know."
          value={value.comments}
          onChange={update('comments')}
        />
      </div>

      <label className="checkbox">
        <input
          type="checkbox"
          checked={value.acceptTerms}
          onChange={update('acceptTerms')}
          required
        />
        <span>
          I agree to the <a href="#terms">terms and conditions</a> and consent to be contacted about
          this booking request.
        </span>
      </label>
      {fieldError('acceptTerms') && <p className="field__error">{fieldError('acceptTerms')}</p>}
    </div>
  );
}
