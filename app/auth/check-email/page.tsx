"use client";

import Link from "next/link";

export default function CheckEmailPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Check your email
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            We&apos;ve sent a confirmation email to your inbox. Please click the
            link in the email to verify your account.
          </p>
        </div>

        <div className="flex items-center justify-center">
          <div className="text-sm">
            <Link
              href="/auth/login"
              className="font-medium text-indigo-600 hover:text-indigo-500"
            >
              Return to login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
