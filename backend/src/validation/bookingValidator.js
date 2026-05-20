const PASSENGER_TYPES = ['adult', 'child', 'infant'];
const DOCUMENT_TYPES = ['passport', 'dni', 'id'];
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const ISO_DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

function pushError(errors, path, message) {
  errors.push({ path, message });
}

function isNonEmptyString(value) {
  return typeof value === 'string' && value.trim().length > 0;
}

function validatePassenger(p, index, errors) {
  const prefix = `passengers[${index}]`;
  if (!PASSENGER_TYPES.includes(p?.type)) {
    pushError(errors, `${prefix}.type`, 'Type must be adult, child or infant.');
  }
  if (!isNonEmptyString(p?.firstName)) pushError(errors, `${prefix}.firstName`, 'First name is required.');
  if (!isNonEmptyString(p?.lastName)) pushError(errors, `${prefix}.lastName`, 'Last name is required.');
  if (!DOCUMENT_TYPES.includes(p?.documentType)) {
    pushError(errors, `${prefix}.documentType`, 'Document type must be passport, dni or id.');
  }
  if (!isNonEmptyString(p?.documentNumber)) {
    pushError(errors, `${prefix}.documentNumber`, 'Document number is required.');
  }
  if (p?.type === 'adult' && !isNonEmptyString(p?.nationality)) {
    pushError(errors, `${prefix}.nationality`, 'Nationality is required for adults.');
  }
  if ((p?.type === 'child' || p?.type === 'infant') && !ISO_DATE_RE.test(p?.dateOfBirth || '')) {
    pushError(errors, `${prefix}.dateOfBirth`, 'Date of birth is required (YYYY-MM-DD) for children and infants.');
  }
}

function validate(input) {
  const errors = [];
  if (!input || typeof input !== 'object') {
    return [{ path: 'body', message: 'Request body must be a JSON object.' }];
  }

  if (!isNonEmptyString(input.tourSlug)) pushError(errors, 'tourSlug', 'tourSlug is required.');
  if (!ISO_DATE_RE.test(input.date || '')) pushError(errors, 'date', 'date must be in YYYY-MM-DD format.');
  if (!isNonEmptyString(input.departure)) pushError(errors, 'departure', 'departure is required.');

  if (!Array.isArray(input.passengers) || input.passengers.length === 0) {
    pushError(errors, 'passengers', 'At least one passenger is required.');
  } else {
    const hasAdult = input.passengers.some((p) => p?.type === 'adult');
    if (!hasAdult) pushError(errors, 'passengers', 'At least one adult is required.');
    input.passengers.forEach((p, i) => validatePassenger(p, i, errors));
  }

  if (input.addonIds !== undefined && !Array.isArray(input.addonIds)) {
    pushError(errors, 'addonIds', 'addonIds must be an array of strings.');
  }

  const contact = input.contact || {};
  if (!EMAIL_RE.test(contact.email || '')) pushError(errors, 'contact.email', 'A valid email is required.');
  if (!isNonEmptyString(contact.phone)) pushError(errors, 'contact.phone', 'Phone number is required.');
  if (contact.acceptTerms !== true) {
    pushError(errors, 'contact.acceptTerms', 'You must accept the terms and conditions.');
  }

  return errors;
}

module.exports = { validate };
