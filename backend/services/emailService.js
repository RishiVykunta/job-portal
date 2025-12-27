const sendJobApplicationEmail = async (candidate, job) => {
  console.log(`
    Email Notification (Simulated):
    To: ${candidate.email}
    Subject: Application Confirmation - ${job.title}
    Body: 
    Dear ${candidate.name},
    
    Thank you for applying to the ${job.title} position at ${job.company}.
    Your application has been received and is under review.
    
    We will contact you soon with updates.
    
    Best regards,
    ${job.company} Team
  `);
};

const sendApplicationReceivedEmail = async (recruiter, candidate, job) => {
  console.log(`
    Email Notification (Simulated):
    To: ${recruiter.email}
    Subject: New Application Received - ${job.title}
    Body: 
    Dear ${recruiter.name},
    
    A new application has been received for the ${job.title} position.
    
    Candidate: ${candidate.name}
    Email: ${candidate.email}
    
    Please review the application in your dashboard.
  `);
};

module.exports = {
  sendJobApplicationEmail,
  sendApplicationReceivedEmail,
};
