
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { InfoIcon } from "lucide-react";

const TermsOfService = () => {
  const lastUpdated = "April 10, 2025";

  return (
    <div className="container py-12 px-4 mx-auto">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">Terms of Service</h1>
        <p className="text-muted-foreground mb-8">Last Updated: {lastUpdated}</p>

        <Alert className="mb-8">
          <InfoIcon className="h-4 w-4" />
          <AlertTitle>Important Notice</AlertTitle>
          <AlertDescription>
            This is a sample terms of service agreement. For a real implementation, this document should be reviewed by legal professionals to ensure compliance with relevant laws and regulations.
          </AlertDescription>
        </Alert>

        <div className="prose max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">1. Acceptance of Terms</h2>
            <p className="mb-4">
              By accessing or using ScholarLinkUp's platform and services, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.
            </p>
            <p>
              ScholarLinkUp provides an online platform connecting students with tutors for educational purposes. These Terms govern your use of our website, applications, and services.
            </p>
          </section>

          <Separator className="my-8" />

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">2. Eligibility</h2>
            <p className="mb-4">To use ScholarLinkUp services, you must:</p>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li>Be at least 18 years of age, or have parental/guardian consent if under 18</li>
              <li>Be able to form legally binding contracts</li>
              <li>Not be prohibited from using our services under applicable laws</li>
              <li>Have a valid email address and provide accurate information during registration</li>
            </ul>
            <p>
              If you're using our services on behalf of a company or organization, you represent that you have authority to bind that entity to these Terms.
            </p>
          </section>

          <Separator className="my-8" />

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">3. User Accounts</h2>
            <p className="mb-4">When you create an account with us, you agree to:</p>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li>Provide accurate, current, and complete information</li>
              <li>Maintain and promptly update your account information</li>
              <li>Keep your password secure and confidential</li>
              <li>Be solely responsible for all activities that occur under your account</li>
              <li>Notify us immediately of any unauthorized use of your account</li>
            </ul>
            <p>
              We reserve the right to suspend or terminate accounts that violate these Terms or if we believe your account has been compromised.
            </p>
          </section>

          <Separator className="my-8" />

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">4. Service Description</h2>
            <p className="mb-4">
              ScholarLinkUp provides a platform for educational connections. Our services include but are not limited to:
            </p>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li>Connecting students with qualified tutors</li>
              <li>Scheduling and facilitating online tutoring sessions</li>
              <li>Secure payment processing for tutoring services</li>
              <li>Educational resource sharing and communication tools</li>
              <li>Review and rating systems</li>
            </ul>
            <p>
              We do not guarantee specific outcomes or results from using our services. Educational success depends on multiple factors including but not limited to student effort, engagement, and consistency.
            </p>
          </section>

          <Separator className="my-8" />

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">5. User Conduct</h2>
            <p className="mb-4">
              When using ScholarLinkUp, you agree not to:
            </p>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li>Violate any applicable laws or regulations</li>
              <li>Infringe on the rights of others, including intellectual property rights</li>
              <li>Harass, abuse, or harm another person</li>
              <li>Share inappropriate, offensive, or illegal content</li>
              <li>Impersonate others or provide false information</li>
              <li>Interfere with or disrupt our services</li>
              <li>Attempt to gain unauthorized access to our systems</li>
              <li>Use our platform for non-educational commercial purposes</li>
              <li>Engage in academic dishonesty or plagiarism</li>
            </ul>
            <p>
              We reserve the right to remove content and suspend or terminate accounts that violate these guidelines.
            </p>
          </section>

          <Separator className="my-8" />

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">6. Payments and Fees</h2>
            <p className="mb-4">
              ScholarLinkUp charges fees for certain services. By using our platform:
            </p>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li>You agree to pay all applicable fees for services you use</li>
              <li>Tutors set their own rates, which are clearly displayed before booking</li>
              <li>ScholarLinkUp charges a service fee that is disclosed during the payment process</li>
              <li>All payments are processed through our secure payment system</li>
              <li>Refund policies are applied as described in our Refund Policy section</li>
            </ul>
            <p>
              We may modify our fee structure with reasonable notice. Continued use of our services after fee changes constitutes acceptance of those changes.
            </p>
          </section>

          <Separator className="my-8" />

          <section>
            <h2 className="text-2xl font-semibold mb-4">7. Contact Information</h2>
            <p className="mb-4">
              If you have any questions about these Terms, please contact us:
            </p>
            <div className="bg-muted p-4 rounded-md">
              <p className="mb-2"><strong>Email:</strong> legal@scholarlinkup.com</p>
              <p className="mb-2"><strong>Phone:</strong> +1 (555) 123-4567</p>
              <p><strong>Address:</strong> 123 Education Lane, San Francisco, CA 94103, United States</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;
