import { ArrowLeft, Calculator } from "lucide-react";
import Link from "next/link";
import { Button } from "~/components/ui/button";

export default function TermsOfService() {
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

			<main className="container max-w-4xl flex-1 px-4 py-8 md:px-6">
				<div className="space-y-8">
					<div className="space-y-4">
						<h1 className="font-bold text-4xl tracking-tight">
							Terms of Service
						</h1>
						<p className="text-gray-600 text-lg">
							Last updated: December 25, 2024
						</p>
						<p className="text-gray-700">
							Welcome to Hati Tayo! These Terms of Service ("Terms") govern your
							use of the Hati Tayo mobile application ("App") operated by Hati
							Tayo Inc. ("we," "us," or "our"). By downloading, accessing, or
							using our App, you agree to be bound by these Terms.
						</p>
					</div>

					<div className="space-y-6">
						<section className="space-y-4">
							<h2 className="font-semibold text-2xl">1. Acceptance of Terms</h2>
							<p className="text-gray-700">
								By creating an account or using Hati Tayo, you acknowledge that
								you have read, understood, and agree to be bound by these Terms
								and our Privacy Policy. If you do not agree to these Terms,
								please do not use our App.
							</p>
						</section>

						<section className="space-y-4">
							<h2 className="font-semibold text-2xl">2. Eligibility</h2>
							<p className="text-gray-700">
								You must be at least 18 years old to use Hati Tayo. By using our
								App, you represent and warrant that:
							</p>
							<ul className="ml-4 list-inside list-disc space-y-1 text-gray-700">
								<li>You are at least 18 years of age</li>
								<li>You have the legal capacity to enter into these Terms</li>
								<li>You will provide accurate and complete information</li>
								<li>
									You will comply with all applicable laws and regulations
								</li>
							</ul>
						</section>

						<section className="space-y-4">
							<h2 className="font-semibold text-2xl">
								3. Description of Service
							</h2>
							<p className="text-gray-700">
								Hati Tayo is a bill-splitting application that allows users to:
							</p>
							<ul className="ml-4 list-inside list-disc space-y-1 text-gray-700">
								<li>Split bills and expenses among groups</li>
								<li>Track shared expenses and payments</li>
								<li>Send payment reminders to group members</li>
								<li>Integrate with various payment methods</li>
								<li>Manage group finances and settlements</li>
							</ul>
							<p className="mt-3 text-gray-700">
								We reserve the right to modify, suspend, or discontinue any
								aspect of our service at any time with or without notice.
							</p>
						</section>

						<section className="space-y-4">
							<h2 className="font-semibold text-2xl">
								4. User Accounts and Responsibilities
							</h2>

							<div className="space-y-3">
								<h3 className="font-medium text-xl">4.1 Account Creation</h3>
								<p className="text-gray-700">
									You are responsible for maintaining the confidentiality of
									your account credentials and for all activities that occur
									under your account. You agree to:
								</p>
								<ul className="ml-4 list-inside list-disc space-y-1 text-gray-700">
									<li>Provide accurate, current, and complete information</li>
									<li>Maintain and update your information as needed</li>
									<li>Keep your login credentials secure</li>
									<li>Notify us immediately of any unauthorized use</li>
								</ul>
							</div>

							<div className="space-y-3">
								<h3 className="font-medium text-xl">4.2 Prohibited Uses</h3>
								<p className="text-gray-700">
									You agree not to use Hati Tayo for any unlawful purpose or in
									any way that could damage our service. Prohibited activities
									include:
								</p>
								<ul className="ml-4 list-inside list-disc space-y-1 text-gray-700">
									<li>Fraudulent or illegal transactions</li>
									<li>Money laundering or financing illegal activities</li>
									<li>Harassment or abuse of other users</li>
									<li>Attempting to hack or compromise our systems</li>
									<li>Creating multiple accounts to circumvent restrictions</li>
									<li>
										Using the app for commercial purposes without authorization
									</li>
								</ul>
							</div>
						</section>

						<section className="space-y-4">
							<h2 className="font-semibold text-2xl">
								5. Financial Transactions
							</h2>

							<div className="space-y-3">
								<h3 className="font-medium text-xl">5.1 Payment Processing</h3>
								<p className="text-gray-700">
									Hati Tayo facilitates bill splitting and expense tracking but
									does not directly process payments. All financial transactions
									are handled by third-party payment processors (GCash, PayMaya,
									banks, etc.). You agree to comply with their terms and
									conditions.
								</p>
							</div>

							<div className="space-y-3">
								<h3 className="font-medium text-xl">
									5.2 Transaction Accuracy
								</h3>
								<p className="text-gray-700">
									You are responsible for ensuring the accuracy of all
									transaction information entered into the app. We are not
									liable for errors in calculations or disputes arising from
									incorrect information provided by users.
								</p>
							</div>

							<div className="space-y-3">
								<h3 className="font-medium text-xl">5.3 Fees</h3>
								<p className="text-gray-700">
									Hati Tayo is currently free to use. We reserve the right to
									introduce fees for certain features in the future with
									appropriate notice to users.
								</p>
							</div>
						</section>

						<section className="space-y-4">
							<h2 className="font-semibold text-2xl">
								6. Privacy and Data Protection
							</h2>
							<p className="text-gray-700">
								Your privacy is important to us. Our collection and use of your
								personal information is governed by our Privacy Policy, which is
								incorporated into these Terms by reference. By using our App,
								you consent to the collection and use of your information as
								described in our Privacy Policy.
							</p>
						</section>

						<section className="space-y-4">
							<h2 className="font-semibold text-2xl">
								7. Intellectual Property
							</h2>
							<p className="text-gray-700">
								The Hati Tayo app, including its design, functionality, content,
								and trademarks, is owned by Hati Tayo Inc. and is protected by
								intellectual property laws. You are granted a limited,
								non-exclusive, non-transferable license to use the app for
								personal, non-commercial purposes.
							</p>
						</section>

						<section className="space-y-4">
							<h2 className="font-semibold text-2xl">
								8. Disclaimers and Limitations of Liability
							</h2>

							<div className="space-y-3">
								<h3 className="font-medium text-xl">
									8.1 Service Availability
								</h3>
								<p className="text-gray-700">
									We strive to maintain high availability but cannot guarantee
									uninterrupted service. The app is provided "as is" without
									warranties of any kind, either express or implied.
								</p>
							</div>

							<div className="space-y-3">
								<h3 className="font-medium text-xl">
									8.2 Limitation of Liability
								</h3>
								<p className="text-gray-700">
									To the maximum extent permitted by law, Hati Tayo Inc. shall
									not be liable for any indirect, incidental, special,
									consequential, or punitive damages, including but not limited
									to loss of profits, data, or other intangible losses resulting
									from your use of the app.
								</p>
							</div>
						</section>

						<section className="space-y-4">
							<h2 className="font-semibold text-2xl">9. Indemnification</h2>
							<p className="text-gray-700">
								You agree to indemnify and hold harmless Hati Tayo Inc., its
								officers, directors, employees, and agents from any claims,
								damages, losses, or expenses arising from your use of the app,
								violation of these Terms, or infringement of any third-party
								rights.
							</p>
						</section>

						<section className="space-y-4">
							<h2 className="font-semibold text-2xl">10. Termination</h2>
							<p className="text-gray-700">
								We may terminate or suspend your account and access to the app
								at our sole discretion, without prior notice, for conduct that
								we believe violates these Terms or is harmful to other users,
								us, or third parties, or for any other reason.
							</p>
							<p className="text-gray-700">
								You may terminate your account at any time by deleting the app
								and ceasing to use our services. Upon termination, your right to
								use the app will cease immediately.
							</p>
						</section>

						<section className="space-y-4">
							<h2 className="font-semibold text-2xl">
								11. Governing Law and Dispute Resolution
							</h2>
							<p className="text-gray-700">
								These Terms shall be governed by and construed in accordance
								with the laws of the Republic of the Philippines. Any disputes
								arising from these Terms or your use of the app shall be
								resolved through binding arbitration in accordance with the
								rules of the Philippine Dispute Resolution Center, Inc.
							</p>
						</section>

						<section className="space-y-4">
							<h2 className="font-semibold text-2xl">12. Changes to Terms</h2>
							<p className="text-gray-700">
								We reserve the right to modify these Terms at any time. We will
								notify users of material changes through the app or via email.
								Your continued use of the app after changes constitutes
								acceptance of the updated Terms.
							</p>
						</section>

						<section className="space-y-4">
							<h2 className="font-semibold text-2xl">13. Severability</h2>
							<p className="text-gray-700">
								If any provision of these Terms is found to be unenforceable or
								invalid, that provision will be limited or eliminated to the
								minimum extent necessary so that the remaining Terms will remain
								in full force and effect.
							</p>
						</section>

						<section className="space-y-4">
							<h2 className="font-semibold text-2xl">
								14. Contact Information
							</h2>
							<p className="text-gray-700">
								If you have any questions about these Terms of Service, please
								contact us:
							</p>
							<div className="space-y-2 rounded-lg bg-gray-50 p-4">
								<p className="text-gray-700">
									<strong>Email:</strong> legal@hatitayo.com
								</p>
								<p className="text-gray-700">
									<strong>Address:</strong> Hati Tayo Inc., Makati City,
									Philippines
								</p>
								<p className="text-gray-700">
									<strong>Phone:</strong> +63 2 8123 4567
								</p>
							</div>
						</section>

						<div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4">
							<p className="font-medium text-emerald-800">
								By using Hati Tayo, you acknowledge that you have read and
								understood these Terms of Service and agree to be bound by them.
							</p>
						</div>
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
