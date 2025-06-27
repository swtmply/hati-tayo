import {
	ArrowRight,
	Bell,
	Calculator,
	CreditCard,
	Shield,
	Smartphone,
	Star,
	Users,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "~/components/ui/card";
import { Input } from "~/components/ui/input";

export default function HatiTayoLanding() {
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
				<nav className="ml-auto flex gap-4 sm:gap-6">
					<Link
						href="#features"
						className="font-medium text-sm underline-offset-4 hover:underline"
					>
						Features
					</Link>
					<Link
						href="#how-it-works"
						className="font-medium text-sm underline-offset-4 hover:underline"
					>
						How It Works
					</Link>
					<Link
						href="#pricing"
						className="font-medium text-sm underline-offset-4 hover:underline"
					>
						Pricing
					</Link>
					<Link
						href="#contact"
						className="font-medium text-sm underline-offset-4 hover:underline"
					>
						Contact
					</Link>
				</nav>
				<div className="ml-4">
					<Button className="bg-emerald-600 hover:bg-emerald-700">
						Download App
					</Button>
				</div>
			</header>

			<main className="flex-1">
				{/* Hero Section */}
				<section className="w-full bg-gradient-to-br from-emerald-50 to-teal-50 py-12 md:py-24 lg:py-32">
					<div className="container px-4 md:px-6">
						<div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
							<div className="flex flex-col justify-center space-y-4">
								<div className="space-y-2">
									<Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-100">
										{"#1 Bill Splitting App in the Philippines"}
									</Badge>
									<h1 className="font-bold text-3xl tracking-tighter sm:text-5xl xl:text-6xl/none">
										Split Bills, Share Memories
									</h1>
									<p className="max-w-[600px] text-gray-600 md:text-xl">
										Make group expenses simple and fair. Track shared costs,
										split bills instantly, and keep your friendships intact with
										Hati Tayo.
									</p>
								</div>
								<div className="flex flex-col gap-2 min-[400px]:flex-row">
									<Button
										size="lg"
										className="bg-emerald-600 hover:bg-emerald-700"
									>
										Download Free App
										<ArrowRight className="ml-2 h-4 w-4" />
									</Button>
									<Button
										variant="outline"
										size="lg"
										className="border-gray-300 bg-white text-gray-900"
									>
										Watch Demo
									</Button>
								</div>
								<div className="flex items-center gap-4 text-gray-600 text-sm">
									<div className="flex items-center gap-1">
										<Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
										<span className="font-medium">4.8/5</span>
									</div>
									<span>{"•"}</span>
									<span>{"10,000+ downloads"}</span>
									<span>{"•"}</span>
									<span>Free to use</span>
								</div>
							</div>
							<div className="flex items-center justify-center">
								<Image
									src="/placeholder.svg?height=600&width=400"
									width="400"
									height="600"
									alt="Hati Tayo App Screenshot"
									className="mx-auto aspect-[2/3] overflow-hidden rounded-xl object-cover shadow-2xl"
								/>
							</div>
						</div>
					</div>
				</section>

				{/* Features Section */}
				<section id="features" className="w-full py-12 md:py-24 lg:py-32">
					<div className="container px-4 md:px-6">
						<div className="flex flex-col items-center justify-center space-y-4 text-center">
							<div className="space-y-2">
								<Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-100">
									Features
								</Badge>
								<h2 className="font-bold text-3xl tracking-tighter sm:text-5xl">
									Everything you need to split bills fairly
								</h2>
								<p className="max-w-[900px] text-gray-600 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
									From simple dinner splits to complex group trips, Hati Tayo
									handles all your shared expenses with ease.
								</p>
							</div>
						</div>
						<div className="mx-auto grid max-w-5xl items-start gap-6 py-12 lg:grid-cols-3 lg:gap-12">
							<Card className="border-2 transition-colors hover:border-emerald-200">
								<CardHeader>
									<Calculator className="h-10 w-10 text-emerald-600" />
									<CardTitle>Smart Bill Splitting</CardTitle>
									<CardDescription>
										Automatically calculate who owes what with our intelligent
										splitting algorithms. Handle tips, taxes, and custom amounts
										effortlessly.
									</CardDescription>
								</CardHeader>
							</Card>
							<Card className="border-2 transition-colors hover:border-emerald-200">
								<CardHeader>
									<Users className="h-10 w-10 text-emerald-600" />
									<CardTitle>Group Management</CardTitle>
									<CardDescription>
										Create groups for different occasions - family dinners,
										office lunches, or vacation trips. Keep all expenses
										organized in one place.
									</CardDescription>
								</CardHeader>
							</Card>
							<Card className="border-2 transition-colors hover:border-emerald-200">
								<CardHeader>
									<CreditCard className="h-10 w-10 text-emerald-600" />
									<CardTitle>Multiple Payment Options</CardTitle>
									<CardDescription>
										Support for GCash, PayMaya, bank transfers, and cash
										payments. Choose the most convenient way to settle up.
									</CardDescription>
								</CardHeader>
							</Card>
							<Card className="border-2 transition-colors hover:border-emerald-200">
								<CardHeader>
									<Bell className="h-10 w-10 text-emerald-600" />
									<CardTitle>Smart Reminders</CardTitle>
									<CardDescription>
										Gentle reminders help everyone stay on top of their payments
										without being pushy or awkward.
									</CardDescription>
								</CardHeader>
							</Card>
							<Card className="border-2 transition-colors hover:border-emerald-200">
								<CardHeader>
									<Smartphone className="h-10 w-10 text-emerald-600" />
									<CardTitle>Mobile-First Design</CardTitle>
									<CardDescription>
										Designed for Filipino users with an intuitive interface that
										works perfectly on any device, online or offline.
									</CardDescription>
								</CardHeader>
							</Card>
							<Card className="border-2 transition-colors hover:border-emerald-200">
								<CardHeader>
									<Shield className="h-10 w-10 text-emerald-600" />
									<CardTitle>Secure & Private</CardTitle>
									<CardDescription>
										Your financial data is encrypted and secure. We never store
										your payment information or share your data.
									</CardDescription>
								</CardHeader>
							</Card>
						</div>
					</div>
				</section>

				{/* How It Works Section */}
				<section
					id="how-it-works"
					className="w-full bg-gray-50 py-12 md:py-24 lg:py-32"
				>
					<div className="container px-4 md:px-6">
						<div className="flex flex-col items-center justify-center space-y-4 text-center">
							<div className="space-y-2">
								<Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-100">
									How It Works
								</Badge>
								<h2 className="font-bold text-3xl tracking-tighter sm:text-5xl">
									Split bills in 3 simple steps
								</h2>
								<p className="max-w-[900px] text-gray-600 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
									No more awkward conversations about money. Just fair,
									transparent bill splitting.
								</p>
							</div>
						</div>
						<div className="mx-auto grid max-w-5xl items-start gap-8 py-12 lg:grid-cols-3 lg:gap-12">
							<div className="flex flex-col items-center space-y-4 text-center">
								<div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-600 font-bold text-2xl text-white">
									1
								</div>
								<h3 className="font-bold text-xl">Add Your Bill</h3>
								<p className="text-gray-600">
									Snap a photo of your receipt or manually enter the bill
									amount. Add items and their costs.
								</p>
							</div>
							<div className="flex flex-col items-center space-y-4 text-center">
								<div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-600 font-bold text-2xl text-white">
									2
								</div>
								<h3 className="font-bold text-xl">Choose Who Pays</h3>
								<p className="text-gray-600">
									Select your friends from your group and assign who ordered
									what. The app calculates everything automatically.
								</p>
							</div>
							<div className="flex flex-col items-center space-y-4 text-center">
								<div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-600 font-bold text-2xl text-white">
									3
								</div>
								<h3 className="font-bold text-xl">Send & Settle</h3>
								<p className="text-gray-600">
									Send payment requests to your friends and track who has paid.
									Settle up through your preferred payment method.
								</p>
							</div>
						</div>

						{/* Account Deletion Section */}
						<div className="mt-16 border-gray-200 border-t pt-16">
							<div className="flex flex-col items-center justify-center space-y-4 text-center">
								<div className="space-y-2">
									<Badge className="bg-red-100 text-red-800 hover:bg-red-100">
										Account Management
									</Badge>
									<h2 className="font-bold text-3xl tracking-tighter sm:text-4xl">
										How to Delete Your Account
									</h2>
									<p className="max-w-[700px] text-gray-600 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
										Need to delete your Hati Tayo account? Follow these simple
										steps to permanently remove your account and data.
									</p>
								</div>
							</div>

							<div className="mx-auto grid max-w-4xl items-start gap-8 py-12 lg:grid-cols-2 lg:gap-12">
								<div className="space-y-6">
									<div className="flex items-start space-x-4">
										<div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-red-600 font-bold text-lg text-white">
											1
										</div>
										<div>
											<h3 className="font-semibold text-lg">
												Login to the Application
											</h3>
											<p className="mt-1 text-gray-600">
												Open the Hati Tayo app and sign in to your account using
												your registered email and password.
											</p>
										</div>
									</div>

									<div className="flex items-start space-x-4">
										<div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-red-600 font-bold text-lg text-white">
											2
										</div>
										<div>
											<h3 className="font-semibold text-lg">
												Go to Profile Page
											</h3>
											<p className="mt-1 text-gray-600">
												Navigate to your profile by tapping on the profile icon,
												usually located in the bottom navigation or menu.
											</p>
										</div>
									</div>

									<div className="flex items-start space-x-4">
										<div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-red-600 font-bold text-lg text-white">
											3
										</div>
										<div>
											<h3 className="font-semibold text-lg">
												Tap on Delete Account
											</h3>
											<p className="mt-1 text-gray-600">
												Scroll down to find the "Delete Account" option in your
												profile settings and tap on it.
											</p>
										</div>
									</div>

									<div className="flex items-start space-x-4">
										<div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-red-600 font-bold text-lg text-white">
											4
										</div>
										<div>
											<h3 className="font-semibold text-lg">
												Select Delete to Confirm
											</h3>
											<p className="mt-1 text-gray-600">
												Review the deletion warning and tap "Delete" to
												permanently remove your account and all associated data.
											</p>
										</div>
									</div>
								</div>

								<div className="flex items-center justify-center">
									<div className="max-w-sm rounded-xl border-2 border-red-100 bg-white p-6 shadow-lg">
										<div className="space-y-4 text-center">
											<div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
												<svg
													className="h-6 w-6 text-red-600"
													fill="none"
													viewBox="0 0 24 24"
													stroke="currentColor"
												>
													<path
														strokeLinecap="round"
														strokeLinejoin="round"
														strokeWidth={2}
														d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
													/>
												</svg>
											</div>
											<h4 className="font-semibold text-gray-900 text-lg">
												Important Notice
											</h4>
											<p className="text-gray-600 text-sm">
												Deleting your account is permanent and cannot be undone.
												You will lose access to all your data and transaction
												history.
											</p>
										</div>
									</div>
								</div>
							</div>

							{/* Important Note */}
							<div className="mx-auto max-w-4xl">
								<div className="rounded-lg border border-red-200 bg-red-50 p-6">
									<div className="flex items-start space-x-3">
										<div className="flex-shrink-0">
											<svg
												className="h-6 w-6 text-red-600"
												fill="none"
												viewBox="0 0 24 24"
												stroke="currentColor"
											>
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													strokeWidth={2}
													d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
												/>
											</svg>
										</div>
										<div>
											<h4 className="mb-2 font-semibold text-lg text-red-800">
												⚠️ Data Deletion Warning
											</h4>
											<p className="text-red-700">
												<strong>
													All transactions paid by you will be permanently
													deleted
												</strong>{" "}
												when you delete your account. This includes your payment
												history, group memberships, and any bills you've created
												or participated in. Make sure to settle any outstanding
												payments and inform your group members before proceeding
												with account deletion.
											</p>
											<p className="mt-2 text-red-700">
												If you're having issues with the app, consider
												contacting our support team first at{" "}
												<Link href="/support" className="font-medium underline">
													support@hatitayo.com
												</Link>
											</p>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</section>

				{/* Testimonials Section */}
				<section className="w-full py-12 md:py-24 lg:py-32">
					<div className="container px-4 md:px-6">
						<div className="flex flex-col items-center justify-center space-y-4 text-center">
							<div className="space-y-2">
								<Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-100">
									Testimonials
								</Badge>
								<h2 className="font-bold text-3xl tracking-tighter sm:text-5xl">
									Loved by thousands of Filipinos
								</h2>
							</div>
						</div>
						<div className="mx-auto grid max-w-5xl items-start gap-6 py-12 lg:grid-cols-3 lg:gap-12">
							<Card>
								<CardHeader>
									<div className="flex items-center gap-2">
										<div className="flex">
											{[...Array(5)].map((_, i) => (
												<Star
													key={_}
													className="h-4 w-4 fill-yellow-400 text-yellow-400"
												/>
											))}
										</div>
									</div>
									<CardDescription>
										"Perfect for our barkada trips! No more awkward money
										conversations. Hati Tayo makes everything transparent and
										fair."
									</CardDescription>
								</CardHeader>
								<CardContent>
									<div className="flex items-center gap-2">
										<div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100">
											<span className="font-medium text-emerald-800 text-sm">
												M
											</span>
										</div>
										<div>
											<p className="font-medium text-sm">Maria Santos</p>
											<p className="text-gray-600 text-xs">Manila</p>
										</div>
									</div>
								</CardContent>
							</Card>
							<Card>
								<CardHeader>
									<div className="flex items-center gap-2">
										<div className="flex">
											{[...Array(5)].map((_, i) => (
												<Star
													key={_}
													className="h-4 w-4 fill-yellow-400 text-yellow-400"
												/>
											))}
										</div>
									</div>
									<CardDescription>
										"As someone who always ends up paying for group dinners,
										this app is a lifesaver. Everyone pays their fair share
										now!"
									</CardDescription>
								</CardHeader>
								<CardContent>
									<div className="flex items-center gap-2">
										<div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100">
											<span className="font-medium text-emerald-800 text-sm">
												J
											</span>
										</div>
										<div>
											<p className="font-medium text-sm">Juan dela Cruz</p>
											<p className="text-gray-600 text-xs">Quezon City</p>
										</div>
									</div>
								</CardContent>
							</Card>
							<Card>
								<CardHeader>
									<div className="flex items-center gap-2">
										<div className="flex">
											{[...Array(5)].map((_, i) => (
												<Star
													key={_}
													className="h-4 w-4 fill-yellow-400 text-yellow-400"
												/>
											))}
										</div>
									</div>
									<CardDescription>
										"Super user-friendly! Even my tita who's not tech-savvy can
										use it. The GCash integration is seamless."
									</CardDescription>
								</CardHeader>
								<CardContent>
									<div className="flex items-center gap-2">
										<div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100">
											<span className="font-medium text-emerald-800 text-sm">
												A
											</span>
										</div>
										<div>
											<p className="font-medium text-sm">Anna Reyes</p>
											<p className="text-gray-600 text-xs">Cebu</p>
										</div>
									</div>
								</CardContent>
							</Card>
						</div>
					</div>
				</section>

				{/* CTA Section */}
				<section className="w-full bg-emerald-600 py-12 md:py-24 lg:py-32">
					<div className="container px-4 md:px-6">
						<div className="flex flex-col items-center justify-center space-y-4 text-center">
							<div className="space-y-2">
								<h2 className="font-bold text-3xl text-white tracking-tighter sm:text-5xl">
									Ready to split bills the smart way?
								</h2>
								<p className="max-w-[600px] text-emerald-100 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
									Join thousands of Filipinos who have made bill splitting
									simple and fair. Download Hati Tayo today!
								</p>
							</div>
							<div className="flex flex-col gap-2 min-[400px]:flex-row">
								<Button
									size="lg"
									className="bg-white text-emerald-600 hover:bg-gray-100"
								>
									Download for iOS
								</Button>
								<Button
									size="lg"
									variant="outline"
									className="border-white bg-transparent text-white hover:bg-white hover:text-emerald-600"
								>
									Download for Android
								</Button>
							</div>
							<p className="text-emerald-100 text-sm">
								Free to download • No hidden fees • Available in English and
								Filipino
							</p>
						</div>
					</div>
				</section>

				{/* Newsletter Section */}
				<section className="w-full border-t py-12 md:py-24 lg:py-32">
					<div className="container px-4 md:px-6">
						<div className="flex flex-col items-center justify-center space-y-4 text-center">
							<div className="space-y-2">
								<h2 className="font-bold text-3xl tracking-tighter md:text-4xl">
									Stay updated with Hati Tayo
								</h2>
								<p className="max-w-[600px] text-gray-600 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
									Get the latest updates, tips, and exclusive features delivered
									to your inbox.
								</p>
							</div>
							<div className="w-full max-w-sm space-y-2">
								<form className="flex gap-2">
									<Input
										type="email"
										placeholder="Enter your email"
										className="max-w-lg flex-1"
									/>
									<Button
										type="submit"
										className="bg-emerald-600 hover:bg-emerald-700"
									>
										Subscribe
									</Button>
								</form>
								<p className="text-gray-600 text-xs">
									By subscribing, you agree to our{" "}
									<Link
										href="/privacy"
										className="underline underline-offset-2"
									>
										Privacy Policy
									</Link>
								</p>
							</div>
						</div>
					</div>
				</section>
			</main>

			{/* Footer */}
			<footer className="flex w-full shrink-0 flex-col items-center gap-2 border-t px-4 py-6 sm:flex-row md:px-6 ">
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
