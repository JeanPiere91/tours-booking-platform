# Sprint 2 — Booking Flow and Email Notification

## Sprint Goal

Implement the booking request flow for the Tours Booking Platform and send booking details by email using Resend.

---

# User Stories Included

## HU-04 · Select date, schedule and passenger quantities

As a visitor who wants to book a tour  
I want to choose the date, schedule and number of passengers by category  
so that I can see the estimated total before continuing.

### Acceptance Criteria

- The user can select a tour date.
- The user can select a schedule.
- The user can choose passenger quantities:
  - Adult
  - Child
  - Infant
- At least one adult is required.
- The estimated total updates when passenger quantities change.
- The booking button is enabled only when the selection is valid.

---

## HU-05 · Navigate between booking steps

As a visitor in the booking process  
I want to clearly see which step I am in  
so that I understand how much is left to complete the booking.

### Acceptance Criteria

- The booking flow includes a stepper with:
  - Tour and date
  - Passengers and extras
  - Contact
  - Confirmation
- Completed steps are visually marked.
- The current step is highlighted.
- Users can move forward and backward.
- Previous information is preserved when navigating back.

---

## HU-06 · Enter passenger information

As a visitor in the booking process  
I want to enter each passenger's details  
so that the booking is registered with the correct information.

### Acceptance Criteria

- A passenger form is generated based on the selected quantities.
- Each passenger has fields for:
  - First name
  - Last name
  - Document type
  - Document number
  - Nationality
- Children and infants include date of birth.
- Required fields show validation errors if empty.

---

## HU-07 · Add optional services

As a visitor in the booking process  
I want to select optional services  
so that I can personalize my tour experience.

### Acceptance Criteria

- Optional services are displayed as selectable cards.
- Each service includes:
  - Icon
  - Name
  - Short description
  - Price
- Selected services update the booking summary.
- The user can continue without selecting optional services.

---

## HU-08 · Enter contact details and submit booking request

As a visitor in the booking process  
I want to enter my contact details and confirm the booking  
so that the agency can receive and process my request.

### Acceptance Criteria

- Contact form includes:
  - Email
  - Phone number with country code
  - Additional comments
- Email and phone are required.
- Terms and conditions checkbox is required.
- The submit button is disabled until the form is valid.
- A loading state appears when submitting.
- The backend receives the booking request through `POST /api/bookings`.

---

## HU-09 · View booking confirmation screen

As a visitor who has submitted a booking request  
I want to see a clear confirmation screen  
so that I know the request was successfully registered.

### Acceptance Criteria

- The confirmation screen displays:
  - Success message
  - Unique booking code
  - Tour name
  - Date and time
  - Passenger summary
  - Optional services
  - Contact email
  - Estimated total
- The system sends the booking details by email using Resend.
- The confirmation message explains that the agency will contact the customer shortly.

---

# Technical Scope

## Frontend

- Booking stepper
- Passenger quantity selection
- Passenger details forms
- Optional services selection
- Contact form
- Booking summary sidebar
- Confirmation page
- Form validation
- Loading state during submission

---

## Backend

### Endpoints

- POST `/api/bookings`
- Optional: GET `/api/bookings/:code`

### Backend Logic

- Validate booking request data
- Generate unique booking code, for example `IPA-2026-A8F3K2`
- Calculate estimated total
- Send booking details by email using Resend
- Return success response to the frontend

---

# Environment Variables

The backend should use environment variables for sensitive configuration:

- `RESEND_API_KEY`
- `AGENCY_EMAIL`
- `FROM_EMAIL`

These values must not be committed to GitHub.

---

# Technologies

- React + Vite
- Node.js + Express
- Resend
- Environment variables
- Docker-ready architecture
- Future Jenkins CI/CD integration

---

# Out of Scope for this Sprint

- Online payments
- Admin dashboard
- Authentication
- Jenkins pipeline
- SonarCloud
- Trivy
- Production deployment
