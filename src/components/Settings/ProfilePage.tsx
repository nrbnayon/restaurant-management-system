// src\components\Settings\ProfilePage.tsx
import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Camera } from "lucide-react";
import { toast } from "sonner";

interface UserProfile {
  name: string;
  email: string;
  phone: string;
  countryCode: string;
  role: string;
  avatar: string;
}

export default function ProfilePage() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Get user data from localStorage
  const getUserData = (): UserProfile => {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      const user = JSON.parse(userStr);
      return {
        name: user.name || "John Max",
        email: user.email || "johnmax@gmail.com",
        phone: user.phone || "24864126544",
        countryCode: user.countryCode || "+96",
        role: user.role || "Admin",
        avatar: user.avatar || "",
      };
    }
    return {
      name: "John Max",
      email: "johnmax@gmail.com",
      phone: "24864126544",
      countryCode: "+96",
      role: "Admin",
      avatar: "",
    };
  };

  const [profile, setProfile] = useState<UserProfile>(getUserData());

  const handleImageClick = () => {
    if (isEditing && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfile((prev) => ({
          ...prev,
          avatar: reader.result as string,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleInputChange = (field: keyof UserProfile, value: string) => {
    setProfile((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = async () => {
    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Update localStorage
      const userStr = localStorage.getItem("user");
      if (userStr) {
        const user = JSON.parse(userStr);
        const updatedUser = {
          ...user,
          name: profile.name,
          email: profile.email,
          phone: profile.phone,
          countryCode: profile.countryCode,
          avatar: profile.avatar,
        };
        localStorage.setItem("user", JSON.stringify(updatedUser));
      }

      toast.success("Profile updated successfully");
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditToggle = () => {
    if (isEditing) {
      // Cancel editing - reset to original data
      setProfile(getUserData());
      setIsEditing(false);
    } else {
      setIsEditing(true);
    }
  };

  return (
    <main className="p-3 md:p-8">
      <div className="w-full mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-4 md:mb-8">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/dashboard/settings")}
              className="bg-card hover:bg-primary/30"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h2 className="text-2xl font-bold text-foreground">
              Personal Information
            </h2>
          </div>
          {isEditing ? (
            <Button
              onClick={handleSave}
              disabled={isLoading}
              variant="outline"
              className="bg-card rounded-md shadow-xl hover:shadow-2xl hover:bg-primary/30 text-black"
            >
              {isLoading ? "Saving..." : "Save"}
            </Button>
          ) : (
            <Button
              onClick={handleEditToggle}
              variant="outline"
              className="bg-card rounded-md shadow-md hover:shadow-2xl hover:bg-primary/30"
            >
              Edit Profile
            </Button>
          )}
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Side - Profile Card */}
          <div className="lg:col-span-1">
            <div className="bg-card rounded-md shadow-sm p-4 md:p-8">
              <div className="flex flex-col items-center text-center space-y-4">
                {/* Avatar */}
                <div className="relative">
                  <div className="w-32 h-32 rounded-full overflow-hidden bg-linear-to-br from-primary to-orange-600 flex items-center justify-center">
                    {profile.avatar ? (
                      <img
                        src={profile.avatar}
                        alt={profile.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-4xl font-bold text-white">
                        {profile.name.charAt(0)}
                      </span>
                    )}
                  </div>
                  {isEditing && (
                    <button
                      onClick={handleImageClick}
                      className="absolute bottom-0 right-0 w-10 h-10 bg-primary rounded-full flex items-center justify-center hover:bg-primary/80 transition-colors shadow-sm"
                    >
                      <Camera className="w-5 h-5 text-white" />
                    </button>
                  )}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </div>

                {/* Profile Info */}
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Profile</p>
                  <p className="text-lg font-bold text-foreground">
                    {profile.role}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Form */}
          <div className="lg:col-span-2">
            <div className="bg-card rounded-md shadow-sm p-4 md:p-8 space-y-3 md:space-y-6">
              {/* Name */}
              <div>
                <Label className="text-sm font-medium text-foreground mb-2">
                  Name
                </Label>
                <Input
                  value={profile.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  readOnly={!isEditing}
                  className="bg-card border-input mt-2"
                />
              </div>

              {/* Email */}
              <div>
                <Label className="text-sm font-medium text-foreground mb-2">
                  Email
                </Label>
                <Input
                  type="email"
                  value={profile.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  readOnly={!isEditing}
                  className="bg-card border-input mt-2"
                />
              </div>

              {/* Phone */}
              <div>
                <Label className="text-sm font-medium text-foreground mb-2">
                  Phone
                </Label>
                <div className="flex gap-3 mt-2">
                  <div className="w-32">
                    <Input
                      value={profile.countryCode}
                      onChange={(e) =>
                        handleInputChange("countryCode", e.target.value)
                      }
                      readOnly={!isEditing}
                      className="bg-card border-input"
                      placeholder="+96"
                    />
                  </div>
                  <Input
                    type="tel"
                    value={profile.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    readOnly={!isEditing}
                    className="flex-1 bg-card border-input"
                    placeholder="24864126544"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
