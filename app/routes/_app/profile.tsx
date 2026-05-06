import React from 'react';
import { Form, useActionData, useLoaderData, redirect, useNavigation, Link, useFetcher } from 'react-router';
import { ArrowLeft, User, Mail, Save } from 'lucide-react';
import { updateUserProfile } from '~/utils/auth.server';
import { validateForm, profileSchema } from '~/utils/validator';
import { Input } from '~/components/ui/Input';
import { Button } from '~/components/ui/Button';
import { Card, CardHeader, CardTitle, CardDescription } from '~/components/ui/Card';
import { FileUpload } from '~/components/ui/FileUpload';
import type { ActionFunctionArgs, LoaderFunctionArgs } from 'react-router';
import toast from 'react-hot-toast';
import { userContext } from "~/context";
import { uploadProfileImage, deleteProfileImage } from '~/utils/cloudinary.server';

export async function loader({ context }: LoaderFunctionArgs) {
  const user = context.get(userContext);
  return { user };
}

export async function action({ request, context }: ActionFunctionArgs) {
  const user = context.get(userContext);
  const formData = await request.formData();

  const name = formData.get('name') as string;
  const profileImageFile = formData.get('profileImage') as File | null;
  const deleteProfileImageFlag = formData.get('deleteProfileImage') === 'true';

  try {
    // Validate name
    const nameValidation = await validateForm(
      profileSchema,
      { name }
    );

    if (!nameValidation.success) {
      return { errors: nameValidation.errors, values: { name } };
    }

    // Handle profile image upload
    let profileImageUrl = (user as any).profileImage;

    if (deleteProfileImageFlag) {
      // Delete existing profile image
      await deleteProfileImage(user.id);
      profileImageUrl = null;
    } else if (profileImageFile && profileImageFile.size > 0) {
      // Upload new profile image
      profileImageUrl = await uploadProfileImage(profileImageFile, user.id);
    }

    // Update user profile
    await updateUserProfile(user.id, {
      name: nameValidation.data.name,
      profileImage: profileImageUrl,
    });

    return redirect('/profile?message=Profile updated successfully!');
  } catch (error) {
    return {
      errors: {
        _form: error instanceof Error ? error.message : 'Failed to update profile',
      },
      values: { name },
    };
  }
}

export default function Profile() {
  const { user } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();
  const errors = actionData?.errors;
  const values = actionData?.values;
  const isSubmitting = navigation.state === 'submitting';
  const deleteFetcher = useFetcher();

  // Handle profile image deletion
  const handleDeleteProfileImage = () => {
    deleteFetcher.submit(
      { deleteProfileImage: 'true', name: user.name },
      { method: 'post' }
    );
  };

  // Show success message when profile is updated
  React.useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const message = urlParams.get('message');
    if (message) {
      toast.success(message);
      // Clean up the URL
      window.history.replaceState({}, '', window.location.pathname);
    }
  }, []);

  // Show error toast when there's a form error
  React.useEffect(() => {
    if (errors?._form) {
      toast.error(errors._form);
    }
  }, [errors]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <div className="mb-6">
          <Link to="/">
            <Button
              variant="outline"
              icon={<ArrowLeft size={16} />}
            >
              Back to Dashboard
            </Button>
          </Link>
        </div>

        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-blue-600 rounded-xl flex items-center justify-center mb-4">
              <User className="w-8 h-8 text-white" />
            </div>
            <CardTitle>Edit Profile</CardTitle>
            <CardDescription>
              Update your profile information and profile picture
            </CardDescription>
          </CardHeader>

          <Form method="post" className="space-y-8" encType="multipart/form-data">
            {errors?._form && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-sm text-red-700">{errors._form}</p>
              </div>
            )}

            {/* Profile Image Upload */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">Profile Picture</h3>
              <FileUpload
                key={(user as any).profileImage || 'no-image'}
                currentImage={(user as any).profileImage}
                className="mx-auto"
                name="profileImage"
                onRemove={handleDeleteProfileImage}
              />
            </div>

            {/* Name Input */}
            <Input
              name="name"
              type="text"
              label="Full Name"
              placeholder="Enter your full name"
              icon={<User size={20} />}
              defaultValue={values?.name || user.name || ''}
              error={errors?.name}
              autoComplete="name"
            />

            {/* Email (Read-only) */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Email Address
              </label>
              <div className="flex items-center space-x-3 px-4 py-3 bg-gray-100 border border-gray-300 rounded-lg">
                <Mail size={20} className="text-gray-400" />
                <span className="text-gray-700">{user.email}</span>
              </div>
              <p className="text-xs text-gray-500">
                Email address cannot be changed
              </p>
            </div>

            {/* Submit Button */}
            <div className="flex justify-center">
              <Button
                type="submit"
                size="lg"
                loading={isSubmitting}
                icon={<Save size={16} />}
              >
                {isSubmitting ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </Form>
        </Card>
      </div>
    </div>
  );
}
