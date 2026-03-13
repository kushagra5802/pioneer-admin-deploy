export default function SkillDetailsForm({ data, onChange }) {
  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
  ];

  const years = Array.from(
    { length: 5 },
    (_, i) => new Date().getFullYear() + i
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Skill Details</h2>
        <p className="text-gray-600 mb-4">
          Enter the basic information about your skill.
        </p>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Skill Title
        </label>
        <input
          type="text"
          value={data.title}
          onChange={(e) =>
            onChange({ ...data, title: e.target.value })
          }
          placeholder="e.g., Critical Thinking"
          className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none text-lg"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Description
        </label>
        <textarea
          value={data.description}
          onChange={(e) =>
            onChange({ ...data, description: e.target.value })
          }
          placeholder="Describe what students will learn from this skill..."
          rows={5}
          className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none resize-none"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Month
          </label>
          <select
            value={data.month}
            onChange={(e) =>
              onChange({ ...data, month: e.target.value })
            }
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
          >
            <option value="">Select Month</option>
            {months.map((month) => (
              <option key={month} value={month}>
                {month}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Year
          </label>
          <select
            value={data.year}
            onChange={(e) =>
              onChange({ ...data, year: parseInt(e.target.value, 10) })
            }
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
          >
            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4">
        <div className="text-sm text-blue-700">
          <strong>Note:</strong> This skill will be divided into 4 weeks of
          content and a final assessment.
        </div>
      </div>
    </div>
  );
}
