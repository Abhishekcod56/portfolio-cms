"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { getSkills } from "../../../lib/skillApi";
import { getProjects } from "../../../lib/projectApi";
import { getExperience } from "../../../lib/experienceApi";
import { getServices } from "../../../lib/serviceApi";
import { getTestimonials } from "../../../lib/testimonialApi";
import { getBlogs } from "../../../lib/blogApi";
import { getMessages } from "../../../lib/messageApi";

const DashboardPage = () => {
  const [loading, setLoading] = useState(true);

  const [stats, setStats] = useState({
    skills: 0,
    projects: 0,
    experience: 0,
    services: 0,
    testimonials: 0,
    blogs: 0,
    messages: 0
  });

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const [
          skills,
          projects,
          experience,
          services,
          testimonials,
          blogs,
          messages
        ] = await Promise.all([
          getSkills(),
          getProjects(),
          getExperience(),
          getServices(),
          getTestimonials(),
          getBlogs(),
          getMessages()
        ]);

        setStats({
          skills: Array.isArray(skills)
            ? skills.length
            : skills?.data?.length || 0,

          projects: Array.isArray(projects)
            ? projects.length
            : projects?.data?.length || 0,

          experience: Array.isArray(experience)
            ? experience.length
            : experience?.data?.length || 0,

          services: Array.isArray(services)
            ? services.length
            : services?.data?.length || 0,

          testimonials: Array.isArray(testimonials)
            ? testimonials.length
            : testimonials?.data?.length || 0,

          blogs: Array.isArray(blogs)
            ? blogs.length
            : blogs?.data?.length || 0,

          messages: Array.isArray(messages)
            ? messages.length
            : messages?.data?.length || 0
        });
      } catch (error) {
        console.error(
          "Failed to load dashboard:",
          error
        );
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  const statCards = [
    {
      title: "Projects",
      count: stats.projects,
      href: "/admin/projects"
    },
    {
      title: "Skills",
      count: stats.skills,
      href: "/admin/skills"
    },
    {
      title: "Experience",
      count: stats.experience,
      href: "/admin/experience"
    },
    {
      title: "Services",
      count: stats.services,
      href: "/admin/services"
    },
    {
      title: "Testimonials",
      count: stats.testimonials,
      href: "/admin/testimonials"
    },
    {
      title: "Blogs",
      count: stats.blogs,
      href: "/admin/blogs"
    },
    {
      title: "Messages",
      count: stats.messages,
      href: "/admin/messages"
    }
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          Dashboard
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          Manage your portfolio content from one place.
        </p>
      </div>

      {loading ? (
        <div className="rounded-xl border border-gray-200 bg-white p-10 text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-gray-300 border-t-black" />

          <p className="mt-4 text-sm text-gray-500">
            Loading dashboard...
          </p>
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {statCards.map((card) => (
            <Link
              key={card.title}
              href={card.href}
              className="group rounded-xl border border-gray-200 bg-white p-6 transition hover:-translate-y-1 hover:border-gray-300 hover:shadow-md"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    {card.title}
                  </p>

                  <p className="mt-2 text-3xl font-bold text-gray-900">
                    {card.count}
                  </p>
                </div>

                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 text-lg font-bold text-gray-700 transition group-hover:bg-black group-hover:text-white">
                  {card.count}
                </div>
              </div>

              <p className="mt-5 text-xs font-medium text-gray-500 group-hover:text-gray-900">
                Manage {card.title.toLowerCase()} →
              </p>
            </Link>
          ))}
        </div>
      )}

      <div className="mt-8 rounded-xl border border-gray-200 bg-white p-6">
        <h2 className="text-lg font-bold text-gray-900">
          Quick Actions
        </h2>

        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Link
            href="/admin/projects"
            className="rounded-lg bg-black px-5 py-3 text-center text-sm font-medium text-white transition hover:bg-gray-800"
          >
            Add Project
          </Link>

          <Link
            href="/admin/blogs"
            className="rounded-lg border border-gray-300 px-5 py-3 text-center text-sm font-medium text-gray-700 transition hover:bg-gray-100"
          >
            Write Blog
          </Link>

          <Link
            href="/admin/media"
            className="rounded-lg border border-gray-300 px-5 py-3 text-center text-sm font-medium text-gray-700 transition hover:bg-gray-100"
          >
            Upload Media
          </Link>

          <Link
            href="/admin/messages"
            className="rounded-lg border border-gray-300 px-5 py-3 text-center text-sm font-medium text-gray-700 transition hover:bg-gray-100"
          >
            View Messages
          </Link>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;