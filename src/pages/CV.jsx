import { useEffect, useState } from "react";
import {
  Mail,
  Phone,
  GraduationCap,
  User,
  Download,
  Loader2,
  FileText,
  RefreshCw,
} from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "../hooks/useAuth";
import { getProfile } from "../services/profileService";

export default function CV() {
  const { user } = useAuth();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadProfile = async () => {
    if (!user?.id) return;

    try {
      setLoading(true);

      const data = await getProfile(user.id);

      setProfile(data);
    } catch (error) {
      console.error("CV profile error:", error);
      toast.error(
        error.message || "Failed to load profile."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, [user?.id]);

  const displayName =
    profile?.full_name ||
    user?.user_metadata?.full_name ||
    "Your Name";

  const email = user?.email || "";

  const skills = profile?.skills
    ? profile.skills
        .split(",")
        .map((skill) => skill.trim())
        .filter(Boolean)
    : [];

  if (loading) {
    return (
      <div className="flex min-h-[500px] items-center justify-center">
        <div className="text-center">
          <Loader2
            size={34}
            className="mx-auto animate-spin text-[#60A5FA]"
          />

          <p className="mt-3 text-sm text-[#94A3B8]">
            Building your CV...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl">
      {/* Page Header */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#F8FAFC]">
            My CV
          </h1>

          <p className="mt-1 text-sm text-[#94A3B8]">
            Your CV is automatically generated from your
            profile information.
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={loadProfile}
            className="inline-flex items-center gap-2 rounded-lg border border-[#1E293B] bg-[#111827] px-4 py-3 text-sm font-medium text-[#94A3B8] transition hover:border-[#2563EB] hover:text-[#60A5FA]"
          >
            <RefreshCw size={17} />
            Refresh
          </button>

          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-2 rounded-lg bg-[#2563EB] px-5 py-3 font-semibold text-white transition hover:bg-[#1D4ED8]"
          >
            <Download size={18} />
            Download / Print
          </button>
        </div>
      </div>

      {/* CV */}
      <div
        id="cv-document"
        className="overflow-hidden rounded-2xl border border-[#1E293B] bg-white text-slate-900 shadow-2xl"
      >
        {/* CV Header */}
        <div className="border-b-4 border-[#2563EB] px-8 py-8 sm:px-12">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900">
            {displayName}
          </h2>

          <p className="mt-2 text-lg font-medium text-[#2563EB]">
            Student
          </p>

          <div className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-sm text-slate-600">
            {email && (
              <span className="inline-flex items-center gap-2">
                <Mail size={15} />
                {email}
              </span>
            )}

            {profile?.phone && (
              <span className="inline-flex items-center gap-2">
                <Phone size={15} />
                {profile.phone}
              </span>
            )}
          </div>
        </div>

        {/* CV Body */}
        <div className="grid gap-10 px-8 py-8 sm:px-12 md:grid-cols-[1fr_280px]">
          {/* Main Column */}
          <div className="space-y-8">
            {/* About */}
            {profile?.bio && (
              <section>
                <div className="mb-3 flex items-center gap-3">
                  <User
                    size={20}
                    className="text-[#2563EB]"
                  />

                  <h3 className="text-lg font-bold text-slate-900">
                    Profile
                  </h3>
                </div>

                <p className="leading-7 text-slate-600">
                  {profile.bio}
                </p>
              </section>
            )}

            {/* Education */}
            {profile?.education && (
              <section>
                <div className="mb-4 flex items-center gap-3">
                  <GraduationCap
                    size={21}
                    className="text-[#2563EB]"
                  />

                  <h3 className="text-lg font-bold text-slate-900">
                    Education
                  </h3>
                </div>

                <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">
                  <p className="whitespace-pre-line leading-7 text-slate-700">
                    {profile.education}
                  </p>
                </div>
              </section>
            )}

            {/* Empty profile message */}
            {!profile?.bio && !profile?.education && (
              <section>
                <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center">
                  <FileText
                    size={30}
                    className="mx-auto text-slate-400"
                  />

                  <h3 className="mt-3 font-semibold text-slate-700">
                    Complete your profile
                  </h3>

                  <p className="mt-1 text-sm text-slate-500">
                    Add your bio and education details in
                    Profile to make your CV more complete.
                  </p>
                </div>
              </section>
            )}
          </div>

          {/* Sidebar */}
          <aside>
            <section>
              <h3 className="mb-4 text-lg font-bold text-slate-900">
                Skills
              </h3>

              {skills.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {skills.map((skill, index) => (
                    <span
                      key={`${skill}-${index}`}
                      className="rounded-full bg-[#2563EB]/10 px-3 py-2 text-sm font-medium text-[#2563EB]"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-sm leading-6 text-slate-500">
                  No skills added yet. Add your skills from
                  the Profile page.
                </p>
              )}
            </section>

            {/* Contact */}
            <section className="mt-8 border-t border-slate-200 pt-6">
              <h3 className="mb-4 text-lg font-bold text-slate-900">
                Contact
              </h3>

              <div className="space-y-4 text-sm text-slate-600">
                {email && (
                  <div className="flex items-start gap-3">
                    <Mail
                      size={17}
                      className="mt-0.5 shrink-0 text-[#2563EB]"
                    />

                    <span className="break-all">
                      {email}
                    </span>
                  </div>
                )}

                {profile?.phone && (
                  <div className="flex items-start gap-3">
                    <Phone
                      size={17}
                      className="mt-0.5 shrink-0 text-[#2563EB]"
                    />

                    <span>{profile.phone}</span>
                  </div>
                )}
              </div>
            </section>
          </aside>
        </div>

        {/* CV Footer */}
        <div className="border-t border-slate-200 bg-slate-50 px-8 py-4 text-center text-xs text-slate-400 sm:px-12">
          Generated by Here | Am Personal Assistant
        </div>
      </div>

      {/* Print styles */}
      <style>
        {`
          @media print {
            body {
              background: white !important;
            }

            body * {
              visibility: hidden;
            }

            #cv-document,
            #cv-document * {
              visibility: visible;
            }

            #cv-document {
              position: absolute;
              left: 0;
              top: 0;
              width: 100%;
              margin: 0;
              border: none !important;
              border-radius: 0 !important;
              box-shadow: none !important;
            }
          }
        `}
      </style>
    </div>
  );
}