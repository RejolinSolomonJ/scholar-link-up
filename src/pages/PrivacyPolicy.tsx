
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
                Welcome to Scholar LinkUp. We respect your privacy and are committed to protecting your personal data. This privacy policy will inform you about how we look after your personal data when you visit our website and tell you about your privacy rights and how the law protects you.
              </p>
            </section>
            
            <Separator />
            
            <section>
              <h2 className="text-xl font-bold">2. Data We Collect</h2>
              <p>
                We may collect, use, store and transfer different kinds of personal data about you, including:
              </p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Identity Data includes first name, last name, username or similar identifier</li>
                <li>Contact Data includes email address and telephone numbers</li>
                <li>Technical Data includes internet protocol (IP) address, browser type and version, time zone setting and location, browser plug-in types and versions, operating system and platform</li>
                <li>Profile Data includes your username and password, purchases or orders made by you, your interests, preferences, feedback and survey responses</li>
                <li>Usage Data includes information about how you use our website, products and services</li>
              </ul>
            </section>
            
            <Separator />
            
            <section>
              <h2 className="text-xl font-bold">3. How We Use Your Data</h2>
              <p>
                We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:
              </p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Where we need to perform the contract we are about to enter into or have entered into with you</li>
                <li>Where it is necessary for our legitimate interests and your interests and fundamental rights do not override those interests</li>
                <li>Where we need to comply with a legal or regulatory obligation</li>
              </ul>
            </section>
            
            <Separator />
            
            <section>
              <h2 className="text-xl font-bold">4. Data Security</h2>
              <p>
                We have put in place appropriate security measures to prevent your personal data from being accidentally lost, used or accessed in an unauthorized way, altered or disclosed. In addition, we limit access to your personal data to those employees, agents, contractors and other third parties who have a business need to know. They will only process your personal data on our instructions and they are subject to a duty of confidentiality.
              </p>
            </section>
            
            <Separator />
            
            <section>
              <h2 className="text-xl font-bold">5. Your Legal Rights</h2>
              <p>
                Under certain circumstances, you have rights under data protection laws in relation to your personal data, including the right to:
              </p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Request access to your personal data</li>
                <li>Request correction of your personal data</li>
                <li>Request erasure of your personal data</li>
                <li>Object to processing of your personal data</li>
                <li>Request restriction of processing your personal data</li>
                <li>Request transfer of your personal data</li>
                <li>Right to withdraw consent</li>
              </ul>
            </section>
            
            <Separator />
            
            <section>
              <h2 className="text-xl font-bold">6. Changes to This Privacy Policy</h2>
              <p>
                We may update our privacy policy from time to time. We will notify you of any changes by posting the new privacy policy on this page and updating the "Last updated" date at the top of this policy.
              </p>
            </section>
            
            <Separator />
            
            <section>
              <h2 className="text-xl font-bold">7. Contact Us</h2>
              <p>
                If you have any questions about this privacy policy or our privacy practices, please contact us:
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
