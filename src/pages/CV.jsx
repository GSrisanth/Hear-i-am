import { useEffect, useMemo, useState } from "react";
import {
  Download,
  FileText,
  Loader2,
  Mail,
  MapPin,
  Phone,
  Printer,
  RefreshCw,
  Sparkles,
} from "lucide-react";

import { useAuth } from "../hooks/useAuth";
import { getProfile } from "../services/profileService";

export default function CV() {
  const { user } = useAuth();

  const [profile, setProfile] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [generating, setGenerating] =
    useState(false);

  const [error, setError] =
    useState("");

  const loadProfile = async () => {
    if (!user?.id) return;

    try {
      setLoading(true);
      setError("");

      const data =
        await getProfile(user.id);

      setProfile(data);
    } catch (err) {
      console.error(
        "Failed to load profile:",
        err
      );

      setError(
        err?.message ||
          "Unable to load your profile."
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

  const email =
    user?.email || "";

  const phone =
    profile?.phone || "";

  const bio =
    profile?.bio ||
    "Add a professional summary from your Profile page.";

  const education =
    profile?.education ||
    "Add your educational qualifications from your Profile page.";

  const skills = useMemo(() => {
    if (!profile?.skills) {
      return [];
    }

    return profile.skills
      .split(/[,;\n]+/)
      .map((skill) => skill.trim())
      .filter(Boolean);
  }, [profile?.skills]);

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = async () => {
    try {
      setGenerating(true);

      const { jsPDF } =
        await import("jspdf");

      const doc = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const pageWidth =
        doc.internal.pageSize.getWidth();

      const pageHeight =
        doc.internal.pageSize.getHeight();

      const margin = 18;

      let y = 20;

      /*
       * ----------------------------------------------------
       * HEADER
       * ----------------------------------------------------
       */

      doc.setFillColor(
        37,
        99,
        235
      );

      doc.rect(
        0,
        0,
        pageWidth,
        42,
        "F"
      );

      doc.setTextColor(
        255,
        255,
        255
      );

      doc.setFont(
        "helvetica",
        "bold"
      );

      doc.setFontSize(25);

      doc.text(
        displayName,
        margin,
        20
      );

      doc.setFont(
        "helvetica",
        "normal"
      );

      doc.setFontSize(10);

      doc.text(
        "CURRICULUM VITAE",
        margin,
        29
      );

      /*
       * Contact information
       */

      let contactX = margin;

      const contactY = 37;

      doc.setFontSize(8.5);

      if (email) {
        doc.text(
          email,
          contactX,
          contactY
        );

        contactX +=
          doc.getTextWidth(
            email
          ) + 7;
      }

      if (phone) {
        doc.text(
          phone,
          contactX,
          contactY
        );
      }

      y = 55;

      /*
       * Helper functions
       */

      const checkPage = (
        requiredHeight = 25
      ) => {
        if (
          y + requiredHeight >
          pageHeight - 18
        ) {
          doc.addPage();

          y = 20;

          return true;
        }

        return false;
      };

      const sectionTitle = (
        title
      ) => {
        checkPage(20);

        doc.setTextColor(
          23,
          37,
          84
        );

        doc.setFont(
          "helvetica",
          "bold"
        );

        doc.setFontSize(13);

        doc.text(
          title.toUpperCase(),
          margin,
          y
        );

        y += 3;

        doc.setDrawColor(
          129,
          140,
          248
        );

        doc.setLineWidth(0.7);

        doc.line(
          margin,
          y,
          pageWidth - margin,
          y
        );

        y += 8;
      };

      const addParagraph = (
        text
      ) => {
        if (!text) return;

        checkPage(25);

        doc.setTextColor(
          55,
          65,
          81
        );

        doc.setFont(
          "helvetica",
          "normal"
        );

        doc.setFontSize(10);

        const lines =
          doc.splitTextToSize(
            text,
            pageWidth -
              margin * 2
          );

        doc.text(
          lines,
          margin,
          y
        );

        y +=
          lines.length * 5 +
          5;
      };

      /*
       * ----------------------------------------------------
       * PROFESSIONAL SUMMARY
       * ----------------------------------------------------
       */

      sectionTitle(
        "Professional Summary"
      );

      addParagraph(bio);

      /*
       * ----------------------------------------------------
       * EDUCATION
       * ----------------------------------------------------
       */

      sectionTitle(
        "Education"
      );

      addParagraph(
        education
      );

      /*
       * ----------------------------------------------------
       * SKILLS
       * ----------------------------------------------------
       */

      sectionTitle(
        "Skills"
      );

      if (skills.length > 0) {
        let skillX = margin;
        let skillY = y;

        doc.setFont(
          "helvetica",
          "normal"
        );

        doc.setFontSize(9.5);

        skills.forEach(
          (skill) => {
            const width =
              doc.getTextWidth(
                skill
              ) + 10;

            if (
              skillX + width >
              pageWidth - margin
            ) {
              skillX = margin;
              skillY += 9;
            }

            if (
              skillY >
              pageHeight - 20
            ) {
              doc.addPage();
              skillX = margin;
              skillY = 20;
            }

            doc.setFillColor(
              239,
              246,
              255
            );

            doc.setDrawColor(
              191,
              219,
              254
            );

            doc.roundedRect(
              skillX,
              skillY - 5,
              width,
              7,
              2,
              2,
              "FD"
            );

            doc.setTextColor(
              37,
              99,
              235
            );

            doc.text(
              skill,
              skillX + 5,
              skillY
            );

            skillX +=
              width + 4;
          }
        );

        y = skillY + 13;
      } else {
        addParagraph(
          "No skills added yet. Update your Profile to add skills."
        );
      }

      /*
       * ----------------------------------------------------
       * CONTACT
       * ----------------------------------------------------
       */

      sectionTitle(
        "Contact Information"
      );

      if (email) {
        doc.setTextColor(
          71,
          85,
          105
        );

        doc.setFont(
          "helvetica",
          "bold"
        );

        doc.setFontSize(10);

        doc.text(
          "Email:",
          margin,
          y
        );

        doc.setFont(
          "helvetica",
          "normal"
        );

        doc.text(
          email,
          margin + 20,
          y
        );

        y += 7;
      }

      if (phone) {
        doc.setFont(
          "helvetica",
          "bold"
        );

        doc.text(
          "Phone:",
          margin,
          y
        );

        doc.setFont(
          "helvetica",
          "normal"
        );

        doc.text(
          phone,
          margin + 20,
          y
        );

        y += 7;
      }

      /*
       * ----------------------------------------------------
       * FOOTER
       * ----------------------------------------------------
       */

      const totalPages =
        doc.getNumberOfPages();

      for (
        let i = 1;
        i <= totalPages;
        i++
      ) {
        doc.setPage(i);

        doc.setDrawColor(
          226,
          232,
          240
        );

        doc.setLineWidth(0.3);

        doc.line(
          margin,
          pageHeight - 13,
          pageWidth - margin,
          pageHeight - 13
        );

        doc.setTextColor(
          148,
          163,
          184
        );

        doc.setFont(
          "helvetica",
          "normal"
        );

        doc.setFontSize(7.5);

        doc.text(
          "Generated with Here I Am",
          margin,
          pageHeight - 7
        );

        doc.text(
          `Page ${i} of ${totalPages}`,
          pageWidth - margin,
          pageHeight - 7,
          {
            align: "right",
          }
        );
      }

      const safeName =
        displayName
          .replace(
            /[^a-zA-Z0-9]/g,
            "_"
          )
          .replace(
            /_+/g,
            "_"
          );

      doc.save(
        `${safeName}_CV.pdf`
      );
    } catch (err) {
      console.error(
        "PDF generation failed:",
        err
      );

      alert(
        "Unable to generate the CV PDF. Please try again."
      );
    } finally {
      setGenerating(false);
    }
  };

  /*
   * ------------------------------------------------------
   * LOADING
   * ------------------------------------------------------
   */

  if (loading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2
            size={32}
            className="animate-spin text-indigo-500"
          />

          <p className="text-sm font-semibold text-slate-500">
            Building your CV...
          </p>
        </div>
      </div>
    );
  }

  /*
   * ------------------------------------------------------
   * PAGE
   * ------------------------------------------------------
   */

  return (
    <div className="space-y-5">
      {/* ==================================================
          HEADER
          ================================================== */}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600">
              <Sparkles size={19} />
            </div>

            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-indigo-500">
                Personal Assistant
              </p>

              <h1 className="text-3xl font-black tracking-tight text-[#172554]">
                CV Generator
              </h1>
            </div>
          </div>

          <p className="mt-2 max-w-2xl text-sm text-slate-500">
            Your CV is automatically created
            from the information saved in
            your Profile.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={loadProfile}
            className="inline-flex items-center gap-2 rounded-xl border border-indigo-100 bg-white/70 px-4 py-2.5 text-sm font-bold text-slate-600 shadow-sm hover:bg-white"
          >
            <RefreshCw size={16} />

            Refresh
          </button>

          <button
            type="button"
            onClick={handlePrint}
            className="inline-flex items-center gap-2 rounded-xl border border-indigo-100 bg-white/70 px-4 py-2.5 text-sm font-bold text-slate-600 shadow-sm hover:bg-white"
          >
            <Printer size={16} />

            Print
          </button>

          <button
            type="button"
            onClick={handleDownloadPDF}
            disabled={generating}
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-indigo-200 hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {generating ? (
              <>
                <Loader2
                  size={16}
                  className="animate-spin"
                />

                Generating...
              </>
            ) : (
              <>
                <Download size={16} />

                Generate PDF
              </>
            )}
          </button>
        </div>
      </div>

      {/* ==================================================
          ERROR
          ================================================== */}

      {error && (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-600">
          {error}
        </div>
      )}

      {/* ==================================================
          PROFILE STATUS
          ================================================== */}

      <div className="flex flex-col gap-3 rounded-2xl border border-indigo-100 bg-white/60 p-4 shadow-sm backdrop-blur-xl sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600">
            <FileText size={18} />
          </div>

          <div>
            <p className="text-sm font-bold text-[#172554]">
              CV data connected to your profile
            </p>

            <p className="text-xs text-slate-400">
              Update your Profile and refresh
              this page to regenerate your CV.
            </p>
          </div>
        </div>

        <a
          href="/profile"
          className="text-sm font-bold text-indigo-600 hover:text-purple-600"
        >
          Edit Profile →
        </a>
      </div>

      {/* ==================================================
          CV DOCUMENT
          ================================================== */}

      <div className="rounded-[26px] border border-white/80 bg-white/45 p-3 shadow-[0_20px_60px_rgba(79,70,229,0.1)] backdrop-blur-xl sm:p-5">
        <div
          id="cv-document"
          className="mx-auto min-h-[1123px] max-w-[794px] bg-white p-8 text-slate-800 shadow-[0_15px_50px_rgba(15,23,42,0.12)] sm:p-12 print:min-h-0 print:max-w-none print:p-10 print:shadow-none"
        >
          {/* CV HEADER */}

          <div className="border-b-2 border-indigo-500 pb-6">
            <h2 className="text-4xl font-black tracking-tight text-[#172554]">
              {displayName}
            </h2>

            <p className="mt-2 text-xs font-bold uppercase tracking-[0.25em] text-indigo-500">
              Curriculum Vitae
            </p>

            <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-xs text-slate-500">
              {email && (
                <span className="inline-flex items-center gap-1.5">
                  <Mail
                    size={13}
                    className="text-indigo-500"
                  />

                  {email}
                </span>
              )}

              {phone && (
                <span className="inline-flex items-center gap-1.5">
                  <Phone
                    size={13}
                    className="text-indigo-500"
                  />

                  {phone}
                </span>
              )}
            </div>
          </div>

          {/* SUMMARY */}

          <section className="mt-8">
            <h3 className="text-sm font-black uppercase tracking-[0.18em] text-[#172554]">
              Professional Summary
            </h3>

            <div className="mt-2 h-0.5 w-12 bg-indigo-500" />

            <p className="mt-4 whitespace-pre-line text-sm leading-7 text-slate-600">
              {bio}
            </p>
          </section>

          {/* EDUCATION */}

          <section className="mt-8">
            <h3 className="text-sm font-black uppercase tracking-[0.18em] text-[#172554]">
              Education
            </h3>

            <div className="mt-2 h-0.5 w-12 bg-indigo-500" />

            <p className="mt-4 whitespace-pre-line text-sm leading-7 text-slate-600">
              {education}
            </p>
          </section>

          {/* SKILLS */}

          <section className="mt-8">
            <h3 className="text-sm font-black uppercase tracking-[0.18em] text-[#172554]">
              Skills
            </h3>

            <div className="mt-2 h-0.5 w-12 bg-indigo-500" />

            {skills.length > 0 ? (
              <div className="mt-4 flex flex-wrap gap-2">
                {skills.map(
                  (
                    skill,
                    index
                  ) => (
                    <span
                      key={`${skill}-${index}`}
                      className="rounded-full border border-indigo-100 bg-indigo-50 px-3 py-1.5 text-xs font-semibold text-indigo-700"
                    >
                      {skill}
                    </span>
                  )
                )}
              </div>
            ) : (
              <p className="mt-4 text-sm italic text-slate-400">
                No skills added yet.
              </p>
            )}
          </section>

          {/* CONTACT */}

          <section className="mt-8">
            <h3 className="text-sm font-black uppercase tracking-[0.18em] text-[#172554]">
              Contact Information
            </h3>

            <div className="mt-2 h-0.5 w-12 bg-indigo-500" />

            <div className="mt-4 space-y-3 text-sm text-slate-600">
              {email && (
                <div className="flex items-center gap-3">
                  <Mail
                    size={15}
                    className="text-indigo-500"
                  />

                  <span>
                    {email}
                  </span>
                </div>
              )}

              {phone && (
                <div className="flex items-center gap-3">
                  <Phone
                    size={15}
                    className="text-indigo-500"
                  />

                  <span>
                    {phone}
                  </span>
                </div>
              )}

              <div className="flex items-center gap-3">
                <MapPin
                  size={15}
                  className="text-indigo-500"
                />

                <span>
                  India
                </span>
              </div>
            </div>
          </section>

          {/* FOOTER */}

          <div className="mt-16 border-t border-slate-200 pt-4 text-[10px] text-slate-400">
            <div className="flex items-center justify-between">
              <span>
                Generated by Here I Am
              </span>

              <span>
                Personal CV
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ==================================================
          BOTTOM INFO
          ================================================== */}

      <div className="grid gap-4 md:grid-cols-3 print:hidden">
        <div className="rounded-2xl border border-indigo-100 bg-white/60 p-4">
          <p className="text-xs font-bold uppercase tracking-wider text-indigo-500">
            Step 1
          </p>

          <p className="mt-1 text-sm font-bold text-[#172554]">
            Update Profile
          </p>

          <p className="mt-1 text-xs leading-5 text-slate-400">
            Add your personal,
            educational and professional
            information.
          </p>
        </div>

        <div className="rounded-2xl border border-indigo-100 bg-white/60 p-4">
          <p className="text-xs font-bold uppercase tracking-wider text-indigo-500">
            Step 2
          </p>

          <p className="mt-1 text-sm font-bold text-[#172554]">
            Preview CV
          </p>

          <p className="mt-1 text-xs leading-5 text-slate-400">
            Your CV is automatically
            assembled from your saved
            profile.
          </p>
        </div>

        <div className="rounded-2xl border border-indigo-100 bg-white/60 p-4">
          <p className="text-xs font-bold uppercase tracking-wider text-indigo-500">
            Step 3
          </p>

          <p className="mt-1 text-sm font-bold text-[#172554]">
            Generate PDF
          </p>

          <p className="mt-1 text-xs leading-5 text-slate-400">
            Download a clean PDF version
            of your generated CV.
          </p>
        </div>
      </div>
    </div>
  );
}