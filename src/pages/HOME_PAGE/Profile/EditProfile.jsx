import React, { useState, useEffect } from "react";

function EditProfile() {
  // Initial fake data from API
  const fakeUserData = {
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    birthDate: "1990-05-15",
    bio: "Software Engineer | React Developer",
    aboutMe:
      "Passionate about creating beautiful web applications. Love hiking and photography in my free time.",
    country: "United States",
    region: "California",
    profileImage:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face",
  };

  // State for form data
  const [formData, setFormData] = useState({
    ...fakeUserData,
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // State for tracking changes
  const [hasChanges, setHasChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");

  // Simulate API call to get user data
  useEffect(() => {
    // In a real app, this would be an API call
    // For demo, we're using the fake data directly
    setFormData({
      ...fakeUserData,
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
  }, []);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setHasChanges(true);
    setSaveMessage("");
  };

  // Handle image upload (simulated)
  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        setFormData((prev) => ({
          ...prev,
          profileImage: event.target.result,
        }));
        setHasChanges(true);
        setSaveMessage("");
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic password validation
    if (
      formData.newPassword &&
      formData.newPassword !== formData.confirmPassword
    ) {
      setSaveMessage("New passwords do not match!");
      return;
    }

    setIsSaving(true);
    setSaveMessage("Saving changes...");

    // Simulate API call to save data
    setTimeout(() => {
      console.log("Saved data:", {
        ...formData,
        currentPassword: formData.currentPassword ? "***" : "",
        newPassword: formData.newPassword ? "***" : "",
        confirmPassword: formData.confirmPassword ? "***" : "",
      });

      setIsSaving(false);
      setHasChanges(false);
      setSaveMessage("Profile updated successfully!");

      // Reset password fields after successful save
      setFormData((prev) => ({
        ...prev,
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      }));
    }, 1500);
  };

  // Handle reset to original data
  const handleReset = () => {
    setFormData({
      ...fakeUserData,
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
    setHasChanges(false);
    setSaveMessage("");
  };

  return (
    <div className="flex-1 flex p-4">
      <form onSubmit={handleSubmit} className="p-4 w-full flex flex-col gap-4">
        {/* Save button and message */}
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-xl font-semibold">Edit Profile</h2>
          <div className="flex items-center gap-4">
            {saveMessage && (
              <span
                className={`text-sm ${saveMessage.includes("successfully") ? "text-green-600" : "text-red-600"}`}
              >
                {saveMessage}
              </span>
            )}
            {hasChanges && (
              <button
                type="button"
                onClick={handleReset}
                className="px-4 py-2 text-sm border border-gray-300 rounded hover:bg-gray-50"
                disabled={isSaving}
              >
                Reset Changes
              </button>
            )}
            <button
              type="submit"
              className="px-4 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isSaving || !hasChanges}
            >
              {isSaving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>

        <div className="flex gap-4">
          {/* Left side */}
          <div className="flex-1 shadow-all p-4 rounded-lg">
            <div className="flex flex-col gap-4">
              <div>
                <label className="text-sm font-medium">Update Profile:</label>
                <div className="mt-2 flex items-center gap-4">
                  <div className="h-30 w-30 rounded-full bg-gray-300 overflow-hidden border-2 border-gray-400">
                    <img
                      src={formData.profileImage}
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
                      className="px-4 py-2 text-sm bg-gray-100 border border-gray-300 rounded cursor-pointer hover:bg-gray-200"
                    >
                      Change Photo
                    </label>
                    <p className="text-xs text-gray-500 mt-1">
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
