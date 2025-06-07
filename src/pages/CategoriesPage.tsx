import React, { useState } from 'react';
import { Plus, Edit, Trash2, Tag } from 'lucide-react';
import { useBlog } from '../context/BlogContext';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Card, { CardContent, CardHeader } from '../components/ui/Card';
import Badge from '../components/ui/Badge';

const CategoriesPage: React.FC = () => {
  const { categories, addCategory } = useBlog();
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !slug) return;

    setIsSubmitting(true);
    try {
      await addCategory({ name, slug });
      setName('');
      setSlug('');
      setShowForm(false);
    } catch (error) {
      console.error('Error creating category:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-');
  };

  const handleNameChange = (value: string) => {
    setName(value);
    if (!slug) {
      setSlug(generateSlug(value));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Categories</h1>
        <Button
          onClick={() => setShowForm(!showForm)}
          variant="primary"
        >
          <Plus className="h-4 w-4 mr-2" />
          New Category
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <h2 className="text-lg font-medium">Create New Category</h2>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Category Name"
                  value={name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="Enter category name"
                  fullWidth
                />
                <Input
                  label="Slug"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="category-slug"
                  fullWidth
                />
              </div>
              <div className="flex space-x-2">
                <Button type="submit" variant="primary" isLoading={isSubmitting}>
                  Create Category
                </Button>
                <Button type="button" variant="secondary" onClick={() => setShowForm(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <h2 className="text-lg font-medium">All Categories</h2>
        </CardHeader>
        <CardContent>
          {categories.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {categories.map((category) => (
                <div
                  key={category.id}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center mb-2">
                        <Tag className="h-4 w-4 text-blue-600 mr-2" />
                        <h3 className="font-medium text-gray-900">{category.name}</h3>
                      </div>
                      <Badge variant="secondary" size="sm">
                        {category.slug}
                      </Badge>
                    </div>
                    <div className="flex space-x-1 ml-2">
                      <button className="p-1 text-gray-400 hover:text-blue-600 rounded">
                        <Edit className="h-4 w-4" />
                      </button>
                      <button className="p-1 text-gray-400 hover:text-red-600 rounded">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Tag className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 mb-4">No categories yet</p>
              <Button onClick={() => setShowForm(true)} variant="primary">
                Create your first category
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CategoriesPage;