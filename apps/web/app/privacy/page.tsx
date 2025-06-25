import { ArrowLeft, Calculator } from "lucide-react";
import Link from "next/link";
import { Button } from "~/components/ui/button";

export default function PrivacyPolicy() {
	return (
		<div className="flex min-h-screen flex-col items-center justify-center">
			{/* Header */}
			<header className="flex h-16 w-full items-center border-b px-4 lg:px-6">
				<Link href="/" className="flex items-center justify-center">
					<Calculator className="h-8 w-8 text-emerald-600" />
					<span className="ml-2 font-bold text-2xl text-gray-900">
						Hati Tayo
					</span>
				</Link>
				<div className="ml-auto">
					<Link href="/">
						<Button
							variant="outline"
							className="border-gray-300 bg-white text-gray-900"
						>
							<ArrowLeft className="mr-2 h-4 w-4" />
							Back to Home
						</Button>
					</Link>
				</div>
			</header>

			<main className="container flex max-w-4xl flex-1 flex-col items-center justify-center px-4 py-8 md:px-6">
				<div className="space-y-8">
					<div className="space-y-4">
						<h1 className="font-bold text-4xl tracking-tight">
							Privacy Policy
						</h1>
						<p className="text-gray-600 text-lg">
							Last updated: December 25, 2024
						</p>
						<p className="text-gray-700">
							At Hati Tayo, we are committed to protecting your privacy and
							ensuring the security of your personal information. This Privacy
							Policy explains how we collect, use, and safeguard your data when
							you use our mobile application.
						</p>
					</div>

					<div className="space-y-6">
						<section className="space-y-4">
							<h2 className="font-semibold text-2xl">
								1. Information We Collect
							</h2>

							<div className="space-y-3">
								<h3 className="font-medium text-xl">
									1.1 Personal Information
								</h3>
								<p className="text-gray-700">
									When you create an account with Hati Tayo, we may collect:
								</p>
								<ul className="ml-4 list-inside list-disc space-y-1 text-gray-700">
									<li>Name and email address</li>
									<li>Phone number (optional)</li>
									<li>Profile picture (optional)</li>
									<li>
										Payment method information (processed securely through
										third-party providers)
									</li>
								</ul>
							</div>

							<div className="space-y-3">
								<h3 className="font-medium text-xl">1.2 Usage Information</h3>
								<p className="text-gray-700">
									We automatically collect certain information when you use our
									app:
								</p>
								<ul className="ml-4 list-inside list-disc space-y-1 text-gray-700">
									<li>
										Device information (device type, operating system, unique
										device identifiers)
									</li>
									<li>App usage data (features used, time spent in app)</li>
									<li>
										Transaction data (bill amounts, split calculations, group
										information)
									</li>
									<li>Log data (IP address, access times, error logs)</li>
								</ul>
							</div>
						</section>

						<section className="space-y-4">
							<h2 className="font-semibold text-2xl">
								2. How We Use Your Information
							</h2>
							<p className="text-gray-700">We use your information to:</p>
							<ul className="ml-4 list-inside list-disc space-y-1 text-gray-700">
								<li>Provide and maintain our bill-splitting services</li>
								<li>Process transactions and send payment reminders</li>
								<li>Communicate with you about your account and app updates</li>
								<li>Improve our app functionality and user experience</li>
								<li>Prevent fraud and ensure security</li>
								<li>Comply with legal obligations</li>
							</ul>
						</section>

						<section className="space-y-4">
							<h2 className="font-semibold text-2xl">3. Information Sharing</h2>
							<p className="text-gray-700">
								We do not sell, trade, or rent your personal information to
								third parties. We may share your information only in the
								following circumstances:
							</p>
							<ul className="ml-4 list-inside list-disc space-y-1 text-gray-700">
								<li>
									<strong>With other users:</strong> When you participate in
									group expenses, other group members can see your name and
									transaction details related to shared bills
								</li>
								<li>
									<strong>Service providers:</strong> We work with trusted
									third-party services for payment processing, analytics, and
									app functionality
								</li>
								<li>
									<strong>Legal requirements:</strong> When required by law or
									to protect our rights and users' safety
								</li>
								<li>
									<strong>Business transfers:</strong> In case of merger,
									acquisition, or sale of assets
								</li>
							</ul>
						</section>

						<section className="space-y-4">
							<h2 className="font-semibold text-2xl">4. Data Security</h2>
							<p className="text-gray-700">
								We implement industry-standard security measures to protect your
								information:
							</p>
							<ul className="ml-4 list-inside list-disc space-y-1 text-gray-700">
								<li>End-to-end encryption for sensitive data</li>
								<li>Secure data transmission using SSL/TLS protocols</li>
								<li>Regular security audits and updates</li>
								<li>
									Limited access to personal data by authorized personnel only
								</li>
								<li>
									Secure payment processing through certified third-party
									providers
								</li>
							</ul>
						</section>

						<section className="space-y-4">
							<h2 className="font-semibold text-2xl">5. Data Retention</h2>
							<p className="text-gray-700">
								We retain your personal information for as long as necessary to
								provide our services and comply with legal obligations. You may
								request deletion of your account and associated data at any time
								through the app settings or by contacting us.
							</p>
						</section>

						<section className="space-y-4">
							<h2 className="font-semibold text-2xl">6. Your Rights</h2>
							<p className="text-gray-700">You have the right to:</p>
							<ul className="ml-4 list-inside list-disc space-y-1 text-gray-700">
								<li>Access and review your personal information</li>
								<li>Update or correct your information</li>
								<li>Delete your account and associated data</li>
								<li>Opt-out of marketing communications</li>
								<li>Request a copy of your data</li>
								<li>Withdraw consent for data processing</li>
							</ul>
						</section>

						<section className="space-y-4">
							<h2 className="font-semibold text-2xl">
								7. Third-Party Services
							</h2>
							<p className="text-gray-700">
								Our app integrates with third-party payment services (GCash,
								PayMaya, banks) and other services. These providers have their
								own privacy policies, and we encourage you to review them. We
								are not responsible for the privacy practices of third-party
								services.
							</p>
						</section>

						<section className="space-y-4">
							<h2 className="font-semibold text-2xl">8. Children's Privacy</h2>
							<p className="text-gray-700">
								Hati Tayo is not intended for children under 13 years of age. We
								do not knowingly collect personal information from children
								under 13. If we become aware that we have collected such
								information, we will take steps to delete it promptly.
							</p>
						</section>

						<section className="space-y-4">
							<h2 className="font-semibold text-2xl">
								9. Changes to This Policy
							</h2>
							<p className="text-gray-700">
								We may update this Privacy Policy from time to time. We will
								notify you of any material changes by posting the new policy in
								the app and updating the "Last updated" date. Your continued use
								of the app after changes constitutes acceptance of the updated
								policy.
							</p>
						</section>

						<section className="space-y-4">
							<h2 className="font-semibold text-2xl">10. Contact Us</h2>
							<p className="text-gray-700">
								If you have any questions about this Privacy Policy or our data
								practices, please contact us:
							</p>
							<div className="space-y-2 rounded-lg bg-gray-50 p-4">
								<p className="text-gray-700">
									<strong>Email:</strong> privacy@hatitayo.com
								</p>
								<p className="text-gray-700">
									<strong>Address:</strong> Hati Tayo Inc., Makati City,
									Philippines
								</p>
								<p className="text-gray-700">
									<strong>Phone:</strong> +63 995 413 5867
								</p>
							</div>
						</section>
					</div>
				</div>
			</main>

			{/* Footer */}
			<footer className="flex w-full shrink-0 flex-col items-center gap-2 border-t px-4 py-6 sm:flex-row md:px-6">
				<div className="flex items-center gap-2">
					<Calculator className="h-6 w-6 text-emerald-600" />
					<span className="font-bold text-gray-900 text-lg">Hati Tayo</span>
				</div>
				<p className="text-gray-600 text-xs sm:ml-4">
					© 2024 Hati Tayo. All rights reserved.
				</p>
				<nav className="flex gap-4 sm:ml-auto sm:gap-6">
					<Link
						href="/privacy"
						className="text-xs underline-offset-4 hover:underline"
					>
						Privacy Policy
					</Link>
					<Link
						href="/terms"
						className="text-xs underline-offset-4 hover:underline"
					>
						Terms of Service
					</Link>
					<Link
						href="/support"
						className="text-xs underline-offset-4 hover:underline"
					>
						Support
					</Link>
				</nav>
			</footer>
		</div>
	);
}
