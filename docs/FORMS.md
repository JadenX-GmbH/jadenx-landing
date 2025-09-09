# Form Integration Documentation

## Current Setup

The contact form is currently using **Formspree** as the backend service for form submissions.

### Formspree Configuration
- **Endpoint**: `https://formspree.io/f/mkgvygae`
- **Method**: POST
- **Fields**: name, email, message
- **Spam Protection**: Honeypot field (`_gotcha`)

## Form Features

### Client-Side Features
- ✅ Real-time form validation
- ✅ Loading states during submission
- ✅ Success/error feedback with ARIA live regions
- ✅ Accessible form controls
- ✅ Spam protection via honeypot
- ✅ Form reset after successful submission

### Accessibility
- ✅ ARIA live regions for status updates
- ✅ Proper form labels and descriptions
- ✅ Keyboard navigation support
- ✅ Screen reader friendly
- ✅ Focus management

## Replacing with Custom API

### Step 1: Set up Your Backend API

Create an endpoint that accepts POST requests with the following structure:

```javascript
// Expected request body (FormData)
{
  name: "John Doe",
  email: "john@example.com",
  message: "Project inquiry...",
  _gotcha: "" // Should be empty for legitimate submissions
}
```

### Step 2: Update the Form Action

Replace the Formspree endpoint in `src/components/ContactForm.astro`:

```astro
<!-- Before -->
<form action="https://formspree.io/f/mkgvygae" method="POST">

<!-- After -->
<form action="/api/contact" method="POST">
```

Or for a full URL:
```astro
<form action="https://your-api-domain.com/api/contact" method="POST">
```

### Step 3: Backend Response Format

Your API should return appropriate HTTP status codes:

- **200 OK**: Success
- **400 Bad Request**: Validation errors
- **500 Internal Server Error**: Server errors

For success responses, return a JSON object:
```json
{
  "success": true,
  "message": "Thank you! Your message has been sent successfully."
}
```

For error responses:
```json
{
  "success": false,
  "message": "Sorry, there was an error sending your message. Please try again."
}
```

### Step 4: CORS Configuration

If your API is on a different domain, ensure CORS is properly configured:

```javascript
// Example CORS headers for your API
{
  "Access-Control-Allow-Origin": "https://your-domain.com",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Max-Age": "86400"
}
```

### Step 5: Spam Protection

The honeypot field (`_gotcha`) should be validated on your backend:

```javascript
// Check for spam bots
if (req.body._gotcha && req.body._gotcha.length > 0) {
  // Likely spam, reject the submission
  return res.status(400).json({
    success: false,
    message: "Spam detected"
  });
}
```

### Step 6: Email Integration

Configure your backend to send emails using a service like:

- **SendGrid**
- **Mailgun**
- **AWS SES**
- **Nodemailer** (for custom SMTP)

Example with Nodemailer:

```javascript
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransporter({
  host: 'your-smtp-host.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

const mailOptions = {
  from: '"JadenX Contact" <noreply@jadenx.com>',
  to: 'info@jadenx.com',
  subject: 'New Contact Form Submission',
  html: `
    <h2>New Contact Form Submission</h2>
    <p><strong>Name:</strong> ${req.body.name}</p>
    <p><strong>Email:</strong> ${req.body.email}</p>
    <p><strong>Message:</strong></p>
    <p>${req.body.message.replace(/\n/g, '<br>')}</p>
  `
};

await transporter.sendMail(mailOptions);
```

## Environment Variables

Add these to your `.env` file:

```bash
# Formspree (current)
FORMSPREE_ENDPOINT=https://formspree.io/f/mkgvygae

# Custom API
CONTACT_API_URL=https://your-api-domain.com/api/contact
SMTP_HOST=your-smtp-host.com
SMTP_USER=your-smtp-username
SMTP_PASS=your-smtp-password
```

## Testing

### Manual Testing Checklist
- [ ] Form submits successfully
- [ ] Success message appears
- [ ] Form resets after submission
- [ ] Error handling works
- [ ] Honeypot prevents spam
- [ ] All fields are required
- [ ] Email validation works
- [ ] Mobile responsive

### Automated Testing
Consider adding tests for:
- Form validation
- API integration
- Error states
- Accessibility compliance

## Migration Timeline

1. **Phase 1**: Set up your API endpoint
2. **Phase 2**: Test with staging environment
3. **Phase 3**: Update production form action
4. **Phase 4**: Monitor form submissions
5. **Phase 5**: Remove Formspree account (if desired)

## Support

For questions about form integration:
- Check your API logs for submission data
- Verify CORS headers are correct
- Test with different browsers/devices
- Monitor form analytics for conversion rates

## Current Formspree Account

**Form ID**: `mkgvygae`
**Dashboard**: https://formspree.io/forms/mkgvygae

Keep this active until your custom API is fully tested and deployed.
