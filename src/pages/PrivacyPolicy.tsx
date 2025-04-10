
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const PrivacyPolicy = () => {
  return (
    <div className="container mx-auto py-12 px-4">
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-3xl">Privacy Policy</CardTitle>
          <CardDescription>Last updated: April 10, 2025</CardDescription>
        </CardHeader>
        <CardContent className="prose prose-sm max-w-none">
          <div className="space-y-6">
            <section>
              <h2 className="text-xl font-bold">1. Introduction</h2>
              <p>
                Welcome to Scholar LinkUp ("we," "our," or "us"). We are committed to protecting your privacy and personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our website and services.
              </p>
              <p>
                Please read this Privacy Policy carefully. By accessing or using our platform, you acknowledge that you have read, understood, and agree to be bound by this Privacy Policy. If you do not agree with our policies and practices, please do not use our service.
              </p>
            </section>
            
            <Separator />
            
            <section>
              <h2 className="text-xl font-bold">2. Information We Collect</h2>
              <p>
                We collect several types of information from and about users of our platform, including:
              </p>
              
              <h3 className="text-lg font-semibold mt-4">2.1 Personal Information</h3>
              <p>
                Personal information you provide to us when registering for an account or using our services, such as:
              </p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Name, email address, and contact information</li>
                <li>Profile information, including educational background and areas of expertise</li>
                <li>Payment and billing information</li>
                <li>Communications with us or other users through our platform</li>
              </ul>
              
              <h3 className="text-lg font-semibold mt-4">2.2 Usage Information</h3>
              <p>
                Information about your interaction with our platform, such as:
              </p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Log data (IP address, browser type, pages visited)</li>
                <li>Device information</li>
                <li>Location information</li>
                <li>Cookies and similar tracking technologies</li>
              </ul>
            </section>
            
            <Separator />
            
            <section>
              <h2 className="text-xl font-bold">3. How We Use Your Information</h2>
              <p>
                We use the information we collect for various purposes, including:
              </p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Providing, maintaining, and improving our services</li>
                <li>Processing transactions and managing your account</li>
                <li>Matching students with appropriate tutors</li>
                <li>Sending notifications, updates, and support messages</li>
                <li>Analyzing usage patterns to enhance user experience</li>
                <li>Protecting against fraudulent or unauthorized activity</li>
                <li>Complying with legal obligations</li>
              </ul>
            </section>
            
            <Separator />
            
            <section>
              <h2 className="text-xl font-bold">4. Information Sharing and Disclosure</h2>
              <p>
                We may share your information in the following circumstances:
              </p>
              <ul className="list-disc pl-6 space-y-1">
                <li>
                  <strong>With Other Users:</strong> When students and tutors connect through our platform, certain profile information is shared to facilitate the tutoring relationship.
                </li>
                <li>
                  <strong>Service Providers:</strong> We may share information with third-party vendors who perform services on our behalf, such as payment processing, data analysis, and customer service.
                </li>
                <li>
                  <strong>Legal Requirements:</strong> We may disclose information if required by law, regulation, or legal process.
                </li>
                <li>
                  <strong>Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets, user information may be transferred as a business asset.
                </li>
                <li>
                  <strong>With Your Consent:</strong> We may share information with third parties when you have given us consent to do so.
                </li>
              </ul>
            </section>
            
            <Separator />
            
            <section>
              <h2 className="text-xl font-bold">5. Data Security</h2>
              <p>
                We implement reasonable security measures to protect your personal information from unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the Internet or electronic storage is 100% secure, and we cannot guarantee absolute security.
              </p>
            </section>
            
            <Separator />
            
            <section>
              <h2 className="text-xl font-bold">6. Your Rights and Choices</h2>
              <p>
                Depending on your location, you may have certain rights regarding your personal information, including:
              </p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Accessing, correcting, or deleting your personal information</li>
                <li>Withdrawing consent where processing is based on consent</li>
                <li>Requesting restriction of processing or objecting to processing</li>
                <li>Data portability</li>
                <li>Opting out of marketing communications</li>
              </ul>
              <p className="mt-4">
                To exercise these rights, please contact us using the information provided in the "Contact Us" section below.
              </p>
            </section>
            
            <Separator />
            
            <section>
              <h2 className="text-xl font-bold">7. Children's Privacy</h2>
              <p>
                Our services are not directed to children under the age of 13. We do not knowingly collect personal information from children under 13. If you are a parent or guardian and believe your child has provided us with personal information, please contact us, and we will take steps to delete such information.
              </p>
            </section>
            
            <Separator />
            
            <section>
              <h2 className="text-xl font-bold">8. International Data Transfers</h2>
              <p>
                Your information may be transferred to and processed in countries other than your own, where data protection laws may be different. We ensure appropriate safeguards are in place to protect your information when transferred internationally.
              </p>
            </section>
            
            <Separator />
            
            <section>
              <h2 className="text-xl font-bold">9. Changes to Privacy Policy</h2>
              <p>
                We may update this Privacy Policy from time to time. The updated version will be indicated by an updated "Last Updated" date. We encourage you to review this Privacy Policy periodically to stay informed about how we are protecting your information.
              </p>
            </section>
            
            <Separator />
            
            <section>
              <h2 className="text-xl font-bold">10. Contact Us</h2>
              <p>
                If you have questions, concerns, or requests regarding this Privacy Policy or our privacy practices, please contact us at:
              </p>
              <div className="mt-2">
                <p>Email: privacy@scholarlinkup.com</p>
                <p>Address: 123 Education Lane, San Francisco, CA 94103, United States</p>
                <p>Phone: +1 (555) 123-4567</p>
              </div>
            </section>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PrivacyPolicy;
