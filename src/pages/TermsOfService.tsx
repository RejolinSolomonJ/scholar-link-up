
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const TermsOfService = () => {
  return (
    <div className="container mx-auto py-12 px-4">
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-3xl">Terms of Service</CardTitle>
          <CardDescription>Last updated: April 10, 2025</CardDescription>
        </CardHeader>
        <CardContent className="prose prose-sm max-w-none">
          <div className="space-y-6">
            <section>
              <h2 className="text-xl font-bold">1. Agreement to Terms</h2>
              <p>
                Welcome to Scholar LinkUp. These Terms of Service ("Terms") govern your access to and use of the Scholar LinkUp website, mobile applications, and services (collectively, the "Services"). By accessing or using our Services, you agree to be bound by these Terms and our Privacy Policy. If you do not agree to these Terms, you may not access or use the Services.
              </p>
            </section>
            
            <Separator />
            
            <section>
              <h2 className="text-xl font-bold">2. Definitions</h2>
              <ul className="list-disc pl-6 space-y-1">
                <li>
                  <strong>"Student"</strong> refers to any user who registers to receive tutoring services through our platform.
                </li>
                <li>
                  <strong>"Tutor"</strong> refers to any user who registers to provide tutoring services through our platform.
                </li>
                <li>
                  <strong>"User"</strong> refers to any person who accesses or uses our Services, including Students, Tutors, and visitors.
                </li>
                <li>
                  <strong>"Content"</strong> refers to text, graphics, images, music, software, audio, video, information, or other materials.
                </li>
              </ul>
            </section>
            
            <Separator />
            
            <section>
              <h2 className="text-xl font-bold">3. Account Registration</h2>
              <p>
                To use certain features of our Services, you must register for an account. When you register, you agree to:
              </p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Provide accurate, current, and complete information</li>
                <li>Maintain and promptly update your account information</li>
                <li>Maintain the security of your account and password</li>
                <li>Not share your account credentials with others</li>
                <li>Promptly notify us of any unauthorized use of your account</li>
              </ul>
              <p className="mt-4">
                We reserve the right to suspend or terminate your account if any information provided during registration or thereafter proves to be inaccurate, not current, or incomplete.
              </p>
            </section>
            
            <Separator />
            
            <section>
              <h2 className="text-xl font-bold">4. Services and Fees</h2>
              <h3 className="text-lg font-semibold mt-4">4.1 Tutoring Services</h3>
              <p>
                Our platform enables Students to connect with Tutors for educational services. Scholar LinkUp is not a provider of tutoring services but acts as a platform connecting Students and Tutors.
              </p>
              
              <h3 className="text-lg font-semibold mt-4">4.2 Fees and Payments</h3>
              <p>
                Students agree to pay the fees for tutoring sessions as indicated on the platform. Tutors receive payment according to our payment terms, minus our service fee. All payments are processed through our platform; direct payments between Students and Tutors are prohibited.
              </p>
              
              <h3 className="text-lg font-semibold mt-4">4.3 Cancellations and Refunds</h3>
              <p>
                Cancellation policies are specified on our platform. Generally, cancellations made at least 24 hours before a scheduled session may be eligible for a full refund. For cancellations made within 24 hours, the Tutor's individual cancellation policy applies.
              </p>
            </section>
            
            <Separator />
            
            <section>
              <h2 className="text-xl font-bold">5. User Conduct</h2>
              <p>
                You agree not to use the Services to:
              </p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Violate any applicable law or regulation</li>
                <li>Infringe on the rights of others</li>
                <li>Share content that is unlawful, harmful, threatening, abusive, harassing, defamatory, vulgar, obscene, or otherwise objectionable</li>
                <li>Impersonate any person or entity</li>
                <li>Upload or transmit viruses or malicious code</li>
                <li>Interfere with or disrupt the Services or servers</li>
                <li>Collect or store personal data about other users without their consent</li>
                <li>Use the Services for any commercial solicitation purposes without our express consent</li>
              </ul>
            </section>
            
            <Separator />
            
            <section>
              <h2 className="text-xl font-bold">6. Content and Intellectual Property</h2>
              <h3 className="text-lg font-semibold mt-4">6.1 User Content</h3>
              <p>
                You retain all rights to any content you submit, post, or display on or through the Services. By providing content, you grant us a worldwide, non-exclusive, royalty-free license to use, copy, modify, and display such content in connection with the Services.
              </p>
              
              <h3 className="text-lg font-semibold mt-4">6.2 Scholar LinkUp Content</h3>
              <p>
                All content provided by Scholar LinkUp, including but not limited to the website design, logo, text, graphics, and software, is owned by or licensed to Scholar LinkUp and is protected by copyright, trademark, and other intellectual property laws.
              </p>
            </section>
            
            <Separator />
            
            <section>
              <h2 className="text-xl font-bold">7. Termination</h2>
              <p>
                We may terminate or suspend your account and access to the Services at our sole discretion, without notice, for conduct that we believe violates these Terms or is harmful to other users, us, or third parties, or for any other reason.
              </p>
            </section>
            
            <Separator />
            
            <section>
              <h2 className="text-xl font-bold">8. Disclaimer of Warranties</h2>
              <p>
                THE SERVICES ARE PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING, BUT NOT LIMITED TO, IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, TITLE, AND NON-INFRINGEMENT.
              </p>
              <p className="mt-2">
                WE DO NOT WARRANT THAT THE SERVICES WILL BE UNINTERRUPTED, ERROR-FREE, OR SECURE; THAT DEFECTS WILL BE CORRECTED; OR THAT THE SERVICES OR THE SERVER THAT MAKES THEM AVAILABLE ARE FREE OF VIRUSES OR OTHER HARMFUL COMPONENTS.
              </p>
            </section>
            
            <Separator />
            
            <section>
              <h2 className="text-xl font-bold">9. Limitation of Liability</h2>
              <p>
                TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, SCHOLAR LINKUP SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR ANY LOSS OF PROFITS OR REVENUES, WHETHER INCURRED DIRECTLY OR INDIRECTLY, OR ANY LOSS OF DATA, USE, GOODWILL, OR OTHER INTANGIBLE LOSSES, RESULTING FROM:
              </p>
              <ul className="list-disc pl-6 space-y-1">
                <li>YOUR ACCESS TO OR USE OF OR INABILITY TO ACCESS OR USE THE SERVICES</li>
                <li>ANY CONDUCT OR CONTENT OF ANY THIRD PARTY ON THE SERVICES</li>
                <li>ANY CONTENT OBTAINED FROM THE SERVICES</li>
                <li>UNAUTHORIZED ACCESS, USE, OR ALTERATION OF YOUR TRANSMISSIONS OR CONTENT</li>
              </ul>
            </section>
            
            <Separator />
            
            <section>
              <h2 className="text-xl font-bold">10. Indemnification</h2>
              <p>
                You agree to defend, indemnify, and hold harmless Scholar LinkUp, its officers, directors, employees, and agents from and against any claims, liabilities, damages, losses, and expenses, including without limitation reasonable legal and accounting fees, arising out of or in any way connected with your access to or use of the Services, your violation of these Terms, or your violation of any rights of another.
              </p>
            </section>
            
            <Separator />
            
            <section>
              <h2 className="text-xl font-bold">11. Governing Law</h2>
              <p>
                These Terms shall be governed by the laws of the State of California, without respect to its conflict of laws principles. Any dispute arising from or relating to the subject matter of these Terms shall be subject to the exclusive jurisdiction of the state and federal courts in San Francisco, California.
              </p>
            </section>
            
            <Separator />
            
            <section>
              <h2 className="text-xl font-bold">12. Changes to Terms</h2>
              <p>
                We may update these Terms from time to time. The updated version will be indicated by an updated "Last Updated" date. Your continued use of the Services after any changes to the Terms constitutes your acceptance of such changes.
              </p>
            </section>
            
            <Separator />
            
            <section>
              <h2 className="text-xl font-bold">13. Contact Information</h2>
              <p>
                If you have any questions about these Terms, please contact us at:
              </p>
              <div className="mt-2">
                <p>Email: legal@scholarlinkup.com</p>
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

export default TermsOfService;
