import { useState, useEffect, useRef } from "react";
import { useUpdateProfile } from "../../../hooks/useUpdateProfile";
import { useDispatch, useSelector } from "react-redux";
import { useQueryClient } from "@tanstack/react-query";
import { SquareX } from "lucide-react";
import { closeEditProfile } from "../../../features/UI_Slice/UI_Slice";

function EditProfile() {
  const queryClient = useQueryClient();
  const { mutateAsync, isPending } = useUpdateProfile();
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    birthDate: "",
    bio: "",
    aboutMe: "",
    country: "",
    region: "",
    profileImage: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
    avatar: "",
  });

  const [hasChanges, setHasChanges] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");
  const [profileImagePreview, setProfileImagePreview] = useState(null);
  const [profileImageFile, setProfileImageFile] = useState(null);

  // Fetch real user data from API
  const { user } = useSelector((state) => state.auth);

  // Use a ref to track if we've already set the initial form data
  const hasSetInitialData = useRef(false);

  useEffect(() => {
    // Only set form data if user exists and we haven't set it yet
    if (user && !hasSetInitialData.current) {
      setFormData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
        birthDate: user.birthDate || "",
        bio: user.bio || "",
        aboutMe: user.aboutMe || "",
        country: user.location.country || "",
        region: user.location.region || "",
        profileImage: user.profileImage || "",
        avatar: user.avatar || "",
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

      // Reset image preview when user data loads
      setProfileImagePreview(null);
      setProfileImageFile(null);

      // Mark that we've set the initial data
      hasSetInitialData.current = true;
    }
  }, [user]); // Only depend on user

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setHasChanges(true);
    setSaveMessage("");
  };

  // Handle image upload
  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];

      setProfileImageFile(file);
      setProfileImagePreview(URL.createObjectURL(file));
      setHasChanges(true);
      setSaveMessage("");
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Password validation
    if (formData.newPassword || formData.confirmPassword) {
      if (!formData.currentPassword) {
        setSaveMessage("Current password is required to change password!");
        return;
      }

      if (formData.newPassword !== formData.confirmPassword) {
        setSaveMessage("New passwords do not match!");
        return;
      }

      if (formData.newPassword.length < 6) {
        setSaveMessage("New password must be at least 6 characters long!");
        return;
      }
    }

    setSaveMessage("Saving changes...");

    try {
      const body = new FormData();
      body.append("firstName", formData.firstName);
      body.append("lastName", formData.lastName);
      body.append("email", formData.email);
      body.append("birthDate", formData.birthDate);
      body.append("bio", formData.bio);
      body.append("aboutMe", formData.aboutMe);
      body.append("country", formData.country);
      body.append("region", formData.region);

      // Include password fields only if provided
      if (formData.currentPassword && formData.newPassword) {
        body.append("currentPassword", formData.currentPassword);
        body.append("newPassword", formData.newPassword);
      }

      // Include image file if changed
      if (profileImageFile) {
        body.append("avatar", profileImageFile);
      }

      await mutateAsync(body);

      setSaveMessage("Profile updated successfully!");
      setHasChanges(false);

      // Update React Query cache
      queryClient.invalidateQueries({ queryKey: ["auth"] });

      // Reset password and image file fields
      setFormData((prev) => ({
        ...prev,
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      }));
      setProfileImageFile(null);
      setProfileImagePreview(null);

      // Allow initial data to be set again if user data changes later
      // (optional, but may be needed if the user object is updated elsewhere)
      hasSetInitialData.current = false;
    } catch (error) {
      setSaveMessage(error?.response?.data?.message || "Something went wrong");
    }
  };

  // Reset form to current user data
  const handleReset = () => {
    if (user) {
      setFormData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
        birthDate: user.birthDate || "",
        bio: user.bio || "",
        aboutMe: user.aboutMe || "",
        country: user.location.country || "",
        region: user.location.region || "",
        profileImage: user.profileImage || "",
        avatar: user.avatar || "",
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setProfileImagePreview(null);
      setProfileImageFile(null);
    }
    setHasChanges(false);
    setSaveMessage("");
  };

  // Cleanup object URLs to prevent memory leaks
  useEffect(() => {
    return () => {
      if (profileImagePreview) {
        URL.revokeObjectURL(profileImagePreview);
      }
    };
  }, [profileImagePreview]);

  if (!user) return <p className="p-4">Loading user data...</p>;

  return (
    <div className="flex-1 flex p-4">
      <form onSubmit={handleSubmit} className="p-4 w-full flex flex-col gap-4">
        {/* Save button and message */}
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-xl font-semibold">Edit Profile</h2>
          <div className="flex items-center gap-4 ">
            {saveMessage && (
              <span
                className={`text-sm ${
                  saveMessage.includes("successfully")
                    ? "text-green-600"
                    : saveMessage.includes("Saving")
                      ? "text-blue-600"
                      : "text-red-600"
                }`}
              >
                {saveMessage}
              </span>
            )}
            {hasChanges && (
              <button
                type="button"
                onClick={handleReset}
                className="px-4 py-2 text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50"
                disabled={isPending}
              >
                Reset Changes
              </button>
            )}
            <button
              type="submit"
              className="px-4 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isPending || !hasChanges}
            >
              {isPending ? "Saving..." : "Save Changes"}
            </button>
            <div onClick={() => dispatch(closeEditProfile())}>
              <SquareX
                color="red"
                size={30}
                className="cursor-pointer"
                strokeWidth={2}
              />
            </div>
          </div>
        </div>

        <div className="flex gap-4">
          {/* Left side */}
          <div className="flex-1 shadow-all p-4 rounded-lg">
            <div className="flex flex-col gap-4">
              <div>
                <label className="text-sm font-medium">Update Profile:</label>
                <div className="mt-2 flex items-center gap-4">
                  <div className="h-20 w-20 rounded-full bg-gray-300 overflow-hidden border-2 border-gray-400">
                    <img
                      src={profileImagePreview || formData.avatar}
                      alt="Profile"
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div>
                    <input
                      type="file"
                      id="profileImage"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                    <label
                      htmlFor="profileImage"
                      className="px-4 py-2 text-sm bg-gray-100 border border-gray-300 rounded cursor-pointer hover:bg-gray-200 inline-block"
                    >
                      Change Photo
                    </label>
                    <p className="text-xs text-gray-500 mt-2">
                      Click to upload a new profile image
                    </p>
                  </div>
                </div>
              </div>

              {/* First and Last Name */}
              <div className="flex gap-4">
                <div className="flex flex-col gap-1 flex-1">
                  <label htmlFor="firstName" className="text-sm font-medium">
                    First Name:
                  </label>
                  <input
                    id="firstName"
                    name="firstName"
                    type="text"
                    value={formData.firstName}
                    onChange={handleChange}
                    className="bg-gray-100 border px-3 py-2 rounded outline-none text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div className="flex flex-col flex-1 gap-1">
                  <label htmlFor="lastName" className="text-sm font-medium">
                    Last Name:
                  </label>
                  <input
                    id="lastName"
                    name="lastName"
                    type="text"
                    value={formData.lastName}
                    onChange={handleChange}
                    className="bg-gray-100 border px-3 py-2 rounded outline-none text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>

              {/* Email and Birth Date */}
              <div className="flex gap-4">
                <div className="flex flex-col gap-1 flex-1">
                  <label htmlFor="email" className="text-sm font-medium">
                    Email:
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="bg-gray-100 border px-3 py-2 rounded outline-none text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div className="flex flex-col gap-1 flex-1">
                  <label htmlFor="birthDate" className="text-sm font-medium">
                    Birth Date:
                  </label>
                  <input
                    id="birthDate"
                    name="birthDate"
                    type="date"
                    value={formData.birthDate}
                    onChange={handleChange}
                    className="bg-gray-100 border px-3 py-2 rounded outline-none text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Bio and About Me */}
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-1">
                  <label htmlFor="bio" className="text-sm font-medium">
                    Bio:
                  </label>
                  <input
                    id="bio"
                    name="bio"
                    type="text"
                    value={formData.bio}
                    onChange={handleChange}
                    className="bg-gray-100 border px-3 py-2 rounded outline-none text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Short bio or tagline"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label htmlFor="aboutMe" className="text-sm font-medium">
                    About Me:
                  </label>
                  <textarea
                    id="aboutMe"
                    name="aboutMe"
                    value={formData.aboutMe}
                    onChange={handleChange}
                    rows={4}
                    className="bg-gray-100 border px-3 py-2 rounded outline-none text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    placeholder="Tell us more about yourself..."
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right side */}
          <div className="flex-1 shadow-all p-4 rounded-lg">
            <div className="flex flex-col gap-6">
              {/* Country and Region */}
              <div className="flex gap-4">
                <div className="flex flex-col gap-1 flex-1">
                  <label htmlFor="country" className="text-sm font-medium">
                    Country:
                  </label>
                  <input
                    id="country"
                    name="country"
                    type="text"
                    value={formData.country}
                    onChange={handleChange}
                    className="bg-gray-100 border px-3 py-2 rounded outline-none text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div className="flex flex-col gap-1 flex-1">
                  <label htmlFor="region" className="text-sm font-medium">
                    Region:
                  </label>
                  <input
                    id="region"
                    name="region"
                    type="text"
                    value={formData.region}
                    onChange={handleChange}
                    className="bg-gray-100 border px-3 py-2 rounded outline-none text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Password Section */}
              <div className="border-t pt-6">
                <h3 className="text-sm font-semibold text-gray-700 mb-4">
                  Change Password
                </h3>
                <div className="space-y-4">
                  <div className="flex flex-col gap-1">
                    <label
                      htmlFor="currentPassword"
                      className="text-sm font-medium"
                    >
                      Current Password:
                    </label>
                    <input
                      id="currentPassword"
                      name="currentPassword"
                      type="password"
                      value={formData.currentPassword}
                      onChange={handleChange}
                      placeholder="Enter current password"
                      className="bg-gray-100 border px-3 py-2 rounded outline-none text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label
                      htmlFor="newPassword"
                      className="text-sm font-medium"
                    >
                      New Password:
                    </label>
                    <input
                      id="newPassword"
                      name="newPassword"
                      type="password"
                      value={formData.newPassword}
                      onChange={handleChange}
                      placeholder="Enter new password"
                      className="bg-gray-100 border px-3 py-2 rounded outline-none text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label
                      htmlFor="confirmPassword"
                      className="text-sm font-medium"
                    >
                      Confirm Password:
                    </label>
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="Confirm new password"
                      className="bg-gray-100 border px-3 py-2 rounded outline-none text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <p className="text-xs text-gray-500">
                    Note: Leave password fields empty if you don't want to
                    change your password
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

export default EditProfile;
