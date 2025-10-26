
import React, { useState } from 'react';


import { useAuth } from "@/hooks/useAuth";
import { useUserPreferences } from "@/context";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import ProfileAvatarUpload from "@/components/profile/ProfileAvatarUpload";

const profileFormSchema = z.object({
  firstName: z.string().min(1, { message: "First name is required" }),
  lastName: z.string().optional(),
  email: z.string().email({ message: "Please enter a valid email address" }).optional(),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

const AccountPage = () => {
  const { user, updateProfile, loading, signOut } = useAuth();
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);
  
  // Extract first and last name from the user data, if available
  const firstName = user?.email?.split('@')[0] || '';
  const lastName = '';
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      firstName: firstName,
      lastName: lastName,
      email: user?.email || '',
    },
  });
  
  const onSubmit = async (data: ProfileFormValues) => {
    try {
      const displayName = `${data.firstName} ${data.lastName || ''}`.trim();
      await updateProfile({ displayName });
      toast.success("Profile updated successfully");
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile");
    }
  };
  
  const handleDeleteAccount = async () => {
    setIsDeletingAccount(true);
    // This would be connected to an actual API in a production app
    setTimeout(() => {
      toast.success("Your account has been scheduled for deletion");
      setIsDeletingAccount(false);
      signOut();
    }, 1500);
  };
  
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <main className="flex-grow py-16 px-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">


      <main className="flex-grow py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Account Settings</h1>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>
                  Update your account profile details and profile picture
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Profile Picture Section */}
                  <div className="flex items-center space-x-4">
                    <ProfileAvatarUpload size="lg" showUploadButton={true} />
                    <div>
                      <h3 className="font-medium">Profile Picture</h3>
                      <p className="text-sm text-muted-foreground">
                        Click to upload or change your profile picture
                      </p>
                    </div>
                  </div>

                  {/* Profile Form */}
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="firstName">First Name</Label>
                        <Input
                          id="firstName"
                          {...register("firstName")}
                          className="mt-1"
                        />
                        {errors.firstName && (
                          <p className="mt-1 text-sm text-destructive">{errors.firstName.message}</p>
                        )}
                      </div>
                      
                      <div>
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input
                          id="lastName"
                          {...register("lastName")}
                          className="mt-1"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        {...register("email")}
                        disabled
                        className="mt-1"
                      />
                      <p className="mt-1 text-sm text-muted-foreground">
                        Your email address cannot be changed
                      </p>
                    </div>
                    
                    <Button type="submit" disabled={loading}>
                      {loading ? "Saving..." : "Save changes"}
                    </Button>
                  </form>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Delete Account</CardTitle>
                <CardDescription>
                  Permanently delete your account and all associated data
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="mb-4 text-muted-foreground">
                  This action is irreversible and will immediately delete all your data including meditation history, progress, and preferences.
                </p>
                <Button 
                  variant="destructive" 
                  onClick={handleDeleteAccount}
                  disabled={isDeletingAccount}
                >
                  {isDeletingAccount ? "Processing..." : "Delete my account"}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      
      
    </div>
  );
};

export default AccountPage;
