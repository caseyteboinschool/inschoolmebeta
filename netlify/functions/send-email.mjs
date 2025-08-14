import sgMail from "@sendgrid/mail";

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export async function handler(event) {
  try {
    const { to, subject, text, html } = JSON.parse(event.body);

    // Normalize recipients into an array
    let recipients = [];
    if (Array.isArray(to)) {
      recipients = to.filter(Boolean); // remove empty/falsey values
    } else if (typeof to === "string" && to.trim() !== "") {
      recipients = [to.trim()];
    }

    if (recipients.length === 0) {
      return { statusCode: 400, body: "No valid recipients provided" };
    }

    const msg = {
      to: recipients,
      from: "no-reply@inschool.me", // must be verified in SendGrid
      subject: subject || "Welcome to InSchool.me",
      text: text || "Welcome to InSchool.me!",
      ...(html && { html }), // only include html if provided
    };

    await sgMail.sendMultiple(msg); // sendMultiple supports arrays directly

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Emails sent successfully" }),
    };
  } catch (err) {
    console.error("SendGrid error:", err);
    return { statusCode: 500, body: err.toString() };
  }
}

