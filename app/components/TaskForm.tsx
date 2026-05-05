import React from 'react';
import { Form, useActionData, useNavigation } from 'react-router';
import { ArrowLeft, Plus, Save } from 'lucide-react';
import { Button } from '~/components/ui/Button';
import { Card, CardHeader, CardTitle, CardDescription } from '~/components/ui/Card';
import { Input } from '~/components/ui/Input';
import toast from 'react-hot-toast';

interface TaskFormProps {
  mode: 'create' | 'edit';
  initialValues?: {
    title?: string;
    description?: string;
    priority?: string;
    completed?: boolean;
  };
  action: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  backUrl: string;
  submitText: string;
  loadingText: string;
}


export function TaskForm({
  mode,
  initialValues,
  action,
  title,
  description,
  icon,
  backUrl,
  submitText,
  loadingText,
}: TaskFormProps) {
  const actionData = useActionData();
  const navigation = useNavigation();
  const errors = actionData?.errors;
  const values = actionData?.values;
  const isSubmitting = navigation.state === 'submitting';

  const [selectedPriority, setSelectedPriority] = React.useState(
    values?.priority || initialValues?.priority || 'MEDIUM'
  );

  // Show error toast when there's a form error
  React.useEffect(() => {
    if (errors?._form) {
      toast.error(errors._form);
    }
  }, [errors]);

  const handleQuickTemplate = (template: {
    title: string;
    description: string;
    priority: string;
  }) => {
    const form = document.querySelector('form') as HTMLFormElement;
    const titleInput = form.elements.namedItem('title') as HTMLInputElement;
    const descInput = form.elements.namedItem('description') as HTMLTextAreaElement;

    titleInput.value = template.title;
    descInput.value = template.description;
    setSelectedPriority(template.priority);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <div className="mb-6">
          <Button
            variant="outline"
            onClick={() => window.location.href = backUrl}
            icon={<ArrowLeft size={16} />}
          >
            {mode === 'edit' ? 'Back to Task' : 'Back to Tasks'}
          </Button>
        </div>

        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-blue-600 rounded-xl flex items-center justify-center mb-4">
              {icon}
            </div>
            <CardTitle>{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </CardHeader>

          <Form method="post" action={action} className="space-y-6">
            {errors?._form && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-sm text-red-700">{errors._form}</p>
              </div>
            )}

            {/* Task Info for Edit Mode */}
            {mode === 'edit' && initialValues && (
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-sm font-medium text-gray-900 mb-2">Task Information</h3>
                <div className="space-y-1 text-sm text-gray-600">
                  <p>Task ID: {initialValues.title ? 'Existing Task' : 'New Task'}</p>
                </div>
              </div>
            )}

            {/* Title */}
            <Input
              name="title"
              type="text"
              label="Task Title"
              placeholder="Enter task title"
              defaultValue={values?.title || initialValues?.title || ''}
              error={errors?.title}
              required
              autoComplete="off"
            />

            {/* Description */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Description (Optional)
              </label>
              <textarea
                name="description"
                rows={4}
                placeholder="Add task description..."
                defaultValue={values?.description || initialValues?.description || ''}
                className="w-full px-4 py-3 border text-black border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none resize-vertical"
              />
              {errors?.description && (
                <p className="text-sm text-red-600">{errors.description}</p>
              )}
            </div>

            {/* Priority */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Priority
              </label>
              <div className="grid grid-cols-4 gap-3">
                {[
                  { value: 'LOW', label: 'Low', color: 'bg-gray-100 text-gray-700 border-gray-300' },
                  { value: 'MEDIUM', label: 'Medium', color: 'bg-blue-100 text-blue-700 border-blue-300' },
                  { value: 'HIGH', label: 'High', color: 'bg-orange-100 text-orange-700 border-orange-300' },
                  { value: 'URGENT', label: 'Urgent', color: 'bg-red-100 text-red-700 border-red-300' },
                ].map((priority) => (
                  <label key={priority.value} className="cursor-pointer">
                    <input
                      type="radio"
                      name="priority"
                      value={priority.value}
                      checked={selectedPriority === priority.value}
                      onChange={(e) => setSelectedPriority(e.target.value)}
                      className="sr-only"
                    />
                    <div className={`text-center py-2 px-3 rounded-lg border-2 transition-colors ${priority.color} ${selectedPriority === priority.value
                      ? 'ring-2 ring-offset-2 ring-blue-500'
                      : 'hover:opacity-80'
                      }`}>
                      {priority.label}
                    </div>
                  </label>
                ))}
              </div>
              {errors?.priority && (
                <p className="text-sm text-red-600">{errors.priority}</p>
              )}
            </div>

            {/* Status for Edit Mode */}
            {mode === 'edit' && (
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Status
                </label>
                <div className="flex items-center space-x-4">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      name="completed"
                      defaultChecked={values?.completed !== undefined ? values.completed : initialValues?.completed}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Mark as completed</span>
                  </label>
                </div>
              </div>
            )}

            {/* Quick Actions for Create Mode */}
            {mode === 'create' && (
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-sm font-medium text-gray-900 mb-3">Quick Templates</h3>
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => handleQuickTemplate({
                      title: 'Review project documentation',
                      description: 'Go through the latest project docs and ensure everything is up to date',
                      priority: 'MEDIUM',
                    })}
                  >
                    Review Task
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => handleQuickTemplate({
                      title: 'Team meeting preparation',
                      description: 'Prepare agenda and materials for upcoming team meeting',
                      priority: 'HIGH',
                    })}
                  >
                    Meeting Prep
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => handleQuickTemplate({
                      title: 'Code review',
                      description: '',
                      priority: 'MEDIUM',
                    })}
                  >
                    Code Review
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => handleQuickTemplate({
                      title: 'Bug fix: Critical issue',
                      description: 'Fix the critical bug reported in production',
                      priority: 'URGENT',
                    })}
                  >
                    Urgent Bug
                  </Button>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <div className="flex justify-center">
              <Button
                type="submit"
                size="lg"
                loading={isSubmitting}
                icon={mode === 'create' ? <Plus size={16} /> : <Save size={16} />}
              >
                {isSubmitting ? loadingText : submitText}
              </Button>
            </div>
          </Form>
        </Card>
      </div>
    </div>
  );
}
