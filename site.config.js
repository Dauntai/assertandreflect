/**
 * Site configuration for SEO and build.
 * Set SITE_URL environment variable to override for production (e.g. SITE_URL=https://yoursite.com npm run build)
 */
module.exports = {
  siteUrl: process.env.SITE_URL || 'https://assertandreflect.com',
  siteName: 'Assert and Reflect',
  author: {
    name: 'Shreenidhi VN',
    jobTitle: 'Software Quality Engineer',
    description: 'Advocate for confidence-driven testing and systemic quality thinking',
    sameAs: ['https://www.linkedin.com/in/shreenidhivn', 'https://github.com/shreenidhivn'],
    bio: 'With a decade of experience in software quality and testing across the SDLC, Shreenidhi advocates for systemic quality and confidence-driven testing. The ideas on this site reflect that perspective: testing as risk management, automation as a means rather than an end, and quality as a shared responsibility.',
  },
};
