"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getCurrentUser } from "../../(lib)/auth";
import { getCurrentUserProfile, updateUserProfile } from "../../(lib)/profiles";
import { UserProfile } from "../../(lib)/types/database";
import Link from "next/link";

export default function EditProfilePage() {
  const [profile, setProfile] = useState<Partial<UserProfile>>({
    display_name: "",
    bio: "",
    address: "",
    phone_number: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  useEffect(() => {
    async function loadProfile() {
      try {
        const user = await getCurrentUser();
        if (!user) {
          router.push("/auth/login");
          return;
        }

        setUserId(user.id);
        const userProfile = await getCurrentUserProfile();
        if (userProfile) {
          setProfile({
            display_name: userProfile.display_name || "",
            bio: userProfile.bio || "",
            address: userProfile.address || "",
            phone_number: userProfile.phone_number || "",
          });
        }
      } catch (error) {
        console.error("Error loading profile:", error);
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) return;

    setSaving(true);
    setError(null);
    setSuccess(false);

    try {
      await updateUserProfile({
        ...profile,
        user_id: userId,
      });
      setSuccess(true);
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("An error occurred while saving the profile");
      }
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg">Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="md:flex md:items-center md:justify-between mb-6">
          <div className="flex-1 min-w-0">
            <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
              Edit Profile
            </h2>
          </div>
          <div className="mt-4 flex md:mt-0">
            <Link
              href="/profile"
              className="ml-3 inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Back to Profile
            </Link>
          </div>
        </div>

        {error && (
          <div className="rounded-md bg-red-50 p-4 mb-6">
            <div className="text-sm text-red-700">{error}</div>
          </div>
        )}

        {success && (
          <div className="rounded-md bg-green-50 p-4 mb-6">
            <div className="text-sm text-green-700">
              Profile updated successfully!
            </div>
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="bg-white shadow overflow-hidden sm:rounded-lg p-6"
        >
          <div className="grid grid-cols-1 gap-6">
            <div>
              <label
                htmlFor="display_name"
                className="block text-sm font-medium text-gray-700"
              >
                Display Name
              </label>
              <input
                type="text"
                name="display_name"
                id="display_name"
                className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                value={profile.display_name || ""}
                onChange={handleChange}
              />
            </div>

            <div>
              <label
                htmlFor="bio"
                className="block text-sm font-medium text-gray-700"
              >
                Bio
              </label>
              <textarea
                id="bio"
                name="bio"
                rows={3}
                className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                value={profile.bio || ""}
                onChange={handleChange}
              />
            </div>

            <div>
              <label
                htmlFor="address"
                className="block text-sm font-medium text-gray-700"
              >
                Address
              </label>
              <input
                type="text"
                name="address"
                id="address"
                className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                value={profile.address || ""}
                onChange={handleChange}
              />
            </div>

            <div>
              <label
                htmlFor="phone_number"
                className="block text-sm font-medium text-gray-700"
              >
                Phone Number
              </label>
              <input
                type="text"
                name="phone_number"
                id="phone_number"
                className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                value={profile.phone_number || ""}
                onChange={handleChange}
              />
            </div>

            <div className="pt-5">
              <div className="flex justify-end">
                <Link
                  href="/profile"
                  className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Cancel
                </Link>
                <button
                  type="submit"
                  disabled={saving}
                  className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  {saving ? "Saving..." : "Save"}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
