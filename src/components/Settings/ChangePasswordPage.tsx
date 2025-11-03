// src\components\Settings\ChangePasswordPage.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";

// Validation schema
const changePasswordSchema = z
  .object({
    currentPassword: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .max(10, "Password must not exceed 10 characters"),
    newPassword: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .max(10, "Password must not exceed 10 characters"),
    confirmPassword: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .max(10, "Password must not exceed 10 characters"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })
  .refine((data) => data.currentPassword !== data.newPassword, {
    message: "New password must be different from current password",
    path: ["newPassword"],
  });

type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;

export default function ChangePasswordPage() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema),
  });

  const onSubmit = async (data: ChangePasswordFormData) => {
    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Here you would normally call your API
      console.log("Password change data:", data);

      toast.success("Password changed successfully", {
        description: "Your password has been updated",
      });

      // Reset form
      reset();

      // Navigate back to settings
      setTimeout(() => {
        navigate("/dashboard/settings");
      }, 1000);
    } catch (error) {
      console.error("Error changing password:", error);
      toast.error("Failed to change password", {
        description: "Please try again later",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="p-3 md:p-8 flex items-center justify-center bg-[#00000080] min-h-[calc(100vh-0rem)]">
      <div className="w-full max-w-lg">
        <div className="bg-card rounded-2xl border border-border shadow-lg p-4 md:p-8">
          {/* Header */}
          <div className="flex items-center gap-3 mb-6">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/dashboard/settings")}
              className="hover:bg-accent"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h2 className="text-2xl font-medium text-foreground">
              Change Password
            </h2>
          </div>

          {/* Info Text */}
          <p className="text-sm text-muted-foreground mb-6">
            Your password must be 8-10 character long.
          </p>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Current Password */}
            <div>
              <Label className="text-sm font-medium text-foreground mb-2">
                Current Password
              </Label>
              <div className="relative mt-2">
                <Input
                  type={showCurrentPassword ? "text" : "password"}
                  placeholder="Set new password"
                  {...register("currentPassword")}
                  className="pr-12 bg-background border-input"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full hover:bg-transparent"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  tabIndex={-1}
                >
                  {showCurrentPassword ? (
                    <EyeOff className="h-5 w-5 text-muted-foreground" />
                  ) : (
                    <Eye className="h-5 w-5 text-muted-foreground" />
                  )}
                </Button>
              </div>
              {errors.currentPassword && (
                <p className="text-xs text-destructive mt-1">
                  {errors.currentPassword.message}
                </p>
              )}
            </div>

            {/* New Password */}
            <div>
              <Label className="text-sm font-medium text-foreground mb-2">
                New Password
              </Label>
              <div className="relative mt-2">
                <Input
                  type={showNewPassword ? "text" : "password"}
                  placeholder="Set new password"
                  {...register("newPassword")}
                  className="pr-12 bg-background border-input"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full hover:bg-transparent"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  tabIndex={-1}
                >
                  {showNewPassword ? (
                    <EyeOff className="h-5 w-5 text-muted-foreground" />
                  ) : (
                    <Eye className="h-5 w-5 text-muted-foreground" />
                  )}
                </Button>
              </div>
              {errors.newPassword && (
                <p className="text-xs text-destructive mt-1">
                  {errors.newPassword.message}
                </p>
              )}
            </div>

            {/* Confirm New Password */}
            <div>
              <Label className="text-sm font-medium text-foreground mb-2">
                Confirm new password
              </Label>
              <div className="relative mt-2">
                <Input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Re-enter new password"
                  {...register("confirmPassword")}
                  className="pr-12 bg-background border-input"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full hover:bg-transparent"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  tabIndex={-1}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-5 w-5 text-muted-foreground" />
                  ) : (
                    <Eye className="h-5 w-5 text-muted-foreground" />
                  )}
                </Button>
              </div>
              {errors.confirmPassword && (
                <p className="text-xs text-destructive mt-1">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 bg-primary hover:bg-primary/80 text-primary-foreground font-semibold rounded-md mt-6"
            >
              {isLoading ? "Saving..." : "Save"}
            </Button>
          </form>
        </div>
      </div>
    </main>
  );
}
