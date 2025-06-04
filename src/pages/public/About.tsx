import React from "react";
import { Link } from "react-router-dom";
import { Users, BookOpen, MessageSquare } from "lucide-react";
import Card, { CardContent } from "../../components/ui/Card";

const About: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          About Writers' Haven
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          A community-driven platform where writers share their stories,
          insights, and creative works with readers around the world.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        <Card>
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 bg-blue-100 text-blue-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Our Community
            </h3>
            <p className="text-gray-600">
              Join thousands of writers and readers who share their passion for
              storytelling and creative expression.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 bg-green-100 text-green-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <BookOpen className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Diverse Content
            </h3>
            <p className="text-gray-600">
              Explore a wide range of topics, from personal essays to technical
              articles and creative fiction.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 bg-purple-100 text-purple-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <MessageSquare className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Engagement
            </h3>
            <p className="text-gray-600">
              Connect with other writers, receive feedback, and engage in
              meaningful discussions.
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="bg-gray-50 rounded-2xl p-8 mb-16">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Mission</h2>
          <p className="text-lg text-gray-600 mb-8">
            We believe in the power of words to inspire, educate, and connect
            people. Our platform provides writers with the tools and community
            they need to share their voices with the world.
          </p>
          <Link
            to="/blog"
            className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-800 hover:bg-blue-900"
          >
            Start Reading
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div>
          <h3 className="text-2xl font-bold text-gray-900 mb-4">For Writers</h3>
          <ul className="space-y-4 text-gray-600">
            <li className="flex items-start">
              <span className="flex-shrink-0 h-6 w-6 text-green-500">✓</span>
              <span className="ml-3">
                Easy-to-use content management system
              </span>
            </li>
            <li className="flex items-start">
              <span className="flex-shrink-0 h-6 w-6 text-green-500">✓</span>
              <span className="ml-3">Rich text editing and media support</span>
            </li>
            <li className="flex items-start">
              <span className="flex-shrink-0 h-6 w-6 text-green-500">✓</span>
              <span className="ml-3">
                Analytics and reader engagement insights
              </span>
            </li>
            <li className="flex items-start">
              <span className="flex-shrink-0 h-6 w-6 text-green-500">✓</span>
              <span className="ml-3">Community feedback and support</span>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-2xl font-bold text-gray-900 mb-4">For Readers</h3>
          <ul className="space-y-4 text-gray-600">
            <li className="flex items-start">
              <span className="flex-shrink-0 h-6 w-6 text-green-500">✓</span>
              <span className="ml-3">Curated content from diverse writers</span>
            </li>
            <li className="flex items-start">
              <span className="flex-shrink-0 h-6 w-6 text-green-500">✓</span>
              <span className="ml-3">Personalized reading recommendations</span>
            </li>
            <li className="flex items-start">
              <span className="flex-shrink-0 h-6 w-6 text-green-500">✓</span>
              <span className="ml-3">
                Interactive commenting and discussions
              </span>
            </li>
            <li className="flex items-start">
              <span className="flex-shrink-0 h-6 w-6 text-green-500">✓</span>
              <span className="ml-3">Bookmark and save favorite articles</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default About;
