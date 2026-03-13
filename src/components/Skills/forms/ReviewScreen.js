import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

export default function ReviewScreen({ data }) {
  const [openWeeks, setOpenWeeks] = useState({});
  const [openFinal, setOpenFinal] = useState(false);

  const toggleWeek = (weekId) => {
    setOpenWeeks((prev) => ({
      ...prev,
      [weekId]: !prev[weekId]
    }));
  };

  return (
    <div className="space-y-6">
      {/* =========================
          SKILL INFO
      ========================= */}
      <section className="border rounded-xl p-6 bg-gray-50">
        <h2 className="text-2xl font-bold mb-2">Skill Review</h2>
        <p className="text-lg font-semibold">{data.skill.title}</p>
        <p className="text-gray-600">{data.skill.description}</p>
        <p className="text-sm text-gray-500 mt-1">
          {data.skill.month} {data.skill.year}
        </p>
      </section>

      {/* =========================
          WEEKS
      ========================= */}
      <section className="space-y-4">
        <h3 className="text-xl font-semibold">Weeks</h3>

        {data.weeks.map((week) => {
          const isOpen = openWeeks[week._id];
          const assessment = data.weeklyAssessments.find(
            (a) => a.weekId === week._id
          );
          const questions = data.weeklyQuestions.filter(
            (q) => q.assessmentId === assessment?._id
          );
          const resources = data.resources.filter(
            (r) => r.weekId === week._id
          );

          return (
            <div
              key={week._id}
              className="border rounded-xl overflow-hidden"
            >
              {/* Header */}
              <button
                onClick={() => toggleWeek(week._id)}
                className="w-full flex justify-between items-center p-4 bg-white hover:bg-gray-50"
              >
                <div className="text-left">
                  <p className="font-semibold">
                    Week {week.weekNumber}: {week.title}
                  </p>
                  <p className="text-sm text-gray-500">
                    {week.description}
                  </p>
                </div>

                {isOpen ? <ChevronUp /> : <ChevronDown />}
              </button>

              {/* Body */}
              {isOpen && (
                <div className="p-4 space-y-6 bg-gray-50">
                  {/* Content */}
                  <div>
                    <h4 className="font-semibold mb-1">Content</h4>
                    <p className="text-gray-700 whitespace-pre-line">
                      {week.content}
                    </p>
                  </div>

                  {/* Media */}
                  {(week.imageUrls?.length > 0 ||
                    week.videoUrls?.length > 0) && (
                    <div>
                      <h4 className="font-semibold mb-2">Media</h4>
                      <div className="flex gap-3 flex-wrap">
                        {week.imageUrls?.map((img, i) => (
                          <img
                            key={i}
                            src={img.url}
                            alt={img.name}
                            className="h-24 rounded object-cover border"
                          />
                        ))}
                        {week.videoUrls?.map((vid, i) => (
                          <video
                            key={i}
                            src={vid.url}
                            controls
                            className="h-24 rounded border"
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Resources */}
                  {resources.length > 0 && (
                    <div>
                      <h4 className="font-semibold mb-2">Resources</h4>
                      <ul className="list-disc ml-6 space-y-1">
                        {resources.map((r) => (
                          <li key={r._id}>
                            <span className="font-medium">{r.title}</span>{" "}
                            <span className="text-gray-500">
                              ({r.resourceType})
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Weekly Assignment */}
                  {assessment && (
                    <div>
                      <h4 className="font-semibold mb-2">
                        Weekly Assignment: {assessment.title}
                      </h4>

                      <div className="space-y-4">
                        {questions.map((q, qi) => (
                          <div
                            key={q._id}
                            className="border rounded p-3 bg-white"
                          >
                            <p className="font-medium">
                              Q{qi + 1}. {q.questionText}
                            </p>

                            <ul className="ml-4 mt-2 space-y-1">
                              {q.options.map((o, oi) => (
                                <li
                                  key={oi}
                                  className={
                                    o.isCorrect
                                      ? "text-green-600 font-medium"
                                      : "text-gray-700"
                                  }
                                >
                                  {o.optionText}
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </section>

      {/* =========================
          FINAL ASSESSMENT
      ========================= */}
      {data.finalAssessment && (
        <section className="border rounded-xl overflow-hidden">
          <button
            onClick={() => setOpenFinal(!openFinal)}
            className="w-full flex justify-between items-center p-4 bg-white hover:bg-gray-50"
          >
            <div className="text-left">
              <p className="font-semibold text-lg">
                Final Assessment: {data.finalAssessment.title}
              </p>
              <p className="text-sm text-gray-500">
                Passing Score: {data.finalAssessment.passingScore}
              </p>
            </div>
            {openFinal ? <ChevronUp /> : <ChevronDown />}
          </button>

          {openFinal && (
            <div className="p-4 bg-gray-50 space-y-4">
              {data.finalQuestions.map((q, qi) => (
                <div
                  key={q._id}
                  className="border rounded p-3 bg-white"
                >
                  <p className="font-medium">
                    Q{qi + 1}. {q.questionText}
                  </p>
                  <ul className="ml-4 mt-2 space-y-1">
                    {q.options.map((o, oi) => (
                      <li
                        key={oi}
                        className={
                          o.isCorrect
                            ? "text-green-600 font-medium"
                            : "text-gray-700"
                        }
                      >
                        {o.optionText}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}
        </section>
      )}
    </div>
  );
}
