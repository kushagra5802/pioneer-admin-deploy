import { Plus, Trash2 } from 'lucide-react';
import { useRef, useState } from 'react';
import useAxiosInstance from '../../../lib/useAxiosInstance';

export default function WeekEditorForm({ data, onChange }) {
  const axios = useAxiosInstance();
  const fileInputRef = useRef(null);
  const [uploading, setUploading] = useState(false);

  /* =========================
     Resources handlers
  ========================= */
  const handleAddResource = () => {
    onChange({
      ...data,
      resources: [...data.resources, { title: '', url: '', type: 'article' }]
    });
  };

  const handleUpdateResource = (index, field, value) => {
    const updated = [...data.resources];
    updated[index] = { ...updated[index], [field]: value };
    onChange({ ...data, resources: updated });
  };

  const handleRemoveResource = (index) => {
    onChange({
      ...data,
      resources: data.resources.filter((_, i) => i !== index)
    });
  };

  /* =========================
     MEDIA UPLOAD (NEW)
  ========================= */
  const handleMediaUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    const formData = new FormData();
    files.forEach(file => formData.append('media', file));

    try {
      setUploading(true);
      const res = await axios.post(
        'api/skillReadiness/mediaUpload',
        formData
      );

      onChange({
        ...data,
        media: [...(data.media || []), ...res.data.data]
      });
    } catch (err) {
      console.error('Media upload failed', err);
    } finally {
      setUploading(false);
      fileInputRef.current.value = '';
    }
  };

  const removeMedia = (index) => {
    const updated = [...data.media];
    updated.splice(index, 1);
    onChange({ ...data, media: updated });
  };

  /* =========================
     Mini assignment handlers
  ========================= */
  const handleAddQuestion = () => {
    onChange({
      ...data,
      miniAssignment: {
        ...data.miniAssignment,
        questions: [
          ...data.miniAssignment.questions,
          {
            type: 'single', 
            questionText: '',
            correctAnswerText: '', // for text/number
            options: [
              { text: '', isCorrect: false },
              { text: '', isCorrect: false },
              { text: '', isCorrect: false },
              { text: '', isCorrect: false }
            ]
          }
        ]
      }
    });
  };

  const handleUpdateQuestionType = (index, type) => {
    const updated = [...data.miniAssignment.questions];

    updated[index] = {
      ...updated[index],
      type,
      correctAnswerText: '',
      options:
        type === 'single' || type === 'multiple'
          ? [
              { text: '', isCorrect: false },
              { text: '', isCorrect: false },
              { text: '', isCorrect: false },
              { text: '', isCorrect: false }
            ]
          : []
    };
    console.log("updated question type",updated)
    onChange({
      ...data,
      miniAssignment: {
        ...data.miniAssignment,
        questions: updated
      }
    });
  };


  const handleRemoveQuestion = (index) => {
    onChange({
      ...data,
      miniAssignment: {
        ...data.miniAssignment,
        questions: data.miniAssignment.questions.filter((_, i) => i !== index)
      }
    });
  };

  const handleUpdateQuestion = (index, text) => {
    const updated = [...data.miniAssignment.questions];
    updated[index].questionText = text;
    console.log("updated question",updated)
    onChange({
      ...data,
      miniAssignment: { ...data.miniAssignment, questions: updated }
    });
  };

  const handleUpdateOption = (qIndex, oIndex, field, value) => {
    const updated = [...data.miniAssignment.questions];
    const question = updated[qIndex];

    if (field === 'isCorrect' && question.type === 'single') {
      // Only one correct allowed
      question.options = question.options.map((opt, idx) => ({
        ...opt,
        isCorrect: idx === oIndex ? value : false
      }));
    } else {
      question.options[oIndex] = {
        ...question.options[oIndex],
        [field]: value
      };
    }
    console.log("updated option",updated)
    onChange({
      ...data,
      miniAssignment: { ...data.miniAssignment, questions: updated }
    });
  };


  /* =========================
     Render
  ========================= */
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Week {data?.weekNumber} Content
        </h2>
        <p className="text-gray-600">
          Add educational content, media, and resources for this week.
        </p>
      </div>

      {/* Title */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Week Title
        </label>
        <input
          type="text"
          value={data?.title}
          placeholder="e.g., Theory & Application"
          onChange={(e) => onChange({ ...data, title: e.target.value })}
          className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg"
        />
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Week Description
        </label>
        <input
          type="text"
          value={data?.description}
          placeholder="Brief description of this week's focus"
          onChange={(e) => onChange({ ...data, description: e.target.value })}
          className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg"
        />
      </div>

      {/* Content */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Content
        </label>
        <textarea
            value={data?.content}
            onChange={(e) => onChange({ ...data, content: e.target.value })}
            rows={8}
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg resize-none font-mono text-sm"
        />
      </div>

      {/* 🔹 SINGLE MEDIA PLACEHOLDER */}
      <div
        onClick={() => fileInputRef.current.click()}
        className="border-2 border-dashed rounded-xl p-6 text-center cursor-pointer hover:bg-gray-50"
      >
        <p className="text-sm font-semibold text-gray-700">
          Upload Images or Videos
        </p>
        <p className="text-xs text-gray-400">
          JPG, PNG, MP4, MOV • Multiple allowed
        </p>
        {uploading && <p className="text-blue-600 mt-2">Uploading…</p>}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*,video/*"
        multiple
        hidden
        onChange={handleMediaUpload}
      />

      {/* 🔹 MEDIA PREVIEW */}
      {data?.media?.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {data.media.map((item, idx) => (
            <div key={idx} className="border rounded-lg p-2 relative">
              {item.type === 'image' ? (
                <img
                  src={item.url}
                  alt={item.name}
                  className="h-24 w-full object-cover rounded"
                />
              ) : (
                <video
                  src={item.url}
                  controls
                  className="h-24 w-full object-cover rounded"
                />
              )}

              <button
                onClick={() => removeMedia(idx)}
                className="absolute top-1 right-1 bg-red-500 text-white text-xs px-2 rounded"
              >
                ✕
              </button>

              <p className="text-xs mt-1 truncate">{item.name}</p>
            </div>
          ))}
        </div>
      )}

      {/* Resources */}
      <div>
        <div className="flex justify-between items-center mb-3">
          <label className="block text-sm font-semibold text-gray-700">
            Resources
          </label>
          <button
            onClick={handleAddResource}
            className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 text-white rounded-lg text-sm"
          >
            <Plus size={16} /> Add Resource
          </button>
        </div>

        <div className="space-y-3">
          {data?.resources.map((resource, idx) => (
            <div key={idx} className="border-2 border-gray-200 rounded-lg p-4 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="text"
                  value={resource.title}
                  onChange={(e) => handleUpdateResource(idx, 'title', e.target.value)}
                  placeholder="Resource title"
                  className="px-3 py-2 border-2 border-gray-300 rounded-lg"
                />
                <select
                  value={resource.type}
                  onChange={(e) => handleUpdateResource(idx, 'type', e.target.value)}
                  className="px-3 py-2 border-2 border-gray-300 rounded-lg"
                >
                  <option value="article">Article</option>
                  <option value="pdf">PDF</option>
                  <option value="video">Video</option>
                  <option value="document">Document</option>
                </select>
              </div>

              <div className="flex gap-2">
                <input
                  type="url"
                  value={resource.url}
                  onChange={(e) => handleUpdateResource(idx, 'url', e.target.value)}
                  placeholder="https://..."
                  className="flex-1 px-3 py-2 border-2 border-gray-300 rounded-lg"
                />
                <button
                  onClick={() => handleRemoveResource(idx)}
                  className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Mini Assignment */}
      <div className="bg-orange-50 border-2 border-orange-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">
          Mini Assignment for Week {data?.weekNumber}
        </h3>

        {data?.miniAssignment.questions.map((question, qIdx) => (
          <div key={qIdx} className="border-2 border-orange-300 rounded-lg p-4 bg-white mb-4">

            {/* Question Text */}
            <input
              type="text"
              value={question.questionText}
              onChange={(e) => handleUpdateQuestion(qIdx, e.target.value)}
              placeholder="Enter question text"
              className="w-full px-3 py-2 border-2 border-orange-200 rounded-lg mb-3"
            />

            {/* Question Type Selector */}
            <div className="mb-3">
              <label className="text-sm font-semibold">Question Type</label>
              <select
                value={question.type}
                onChange={(e) =>
                  handleUpdateQuestionType(qIdx, e.target.value)
                }
                className="w-full mt-1 px-3 py-2 border-2 border-orange-200 rounded-lg"
              >
                <option value="single">Single Choice</option>
                <option value="multiple">Multiple Choice</option>
                <option value="text">Written Answer</option>
                <option value="number">Numeric Answer</option>
              </select>
            </div>

            {/* Conditional Rendering */}

            {(question.type === 'single' || question.type === 'multiple') && (
              <div className="grid grid-cols-2 gap-2">
                {question.options.map((option, oIdx) => (
                  <div key={oIdx} className="flex items-center gap-2">
                    <input
                      type={question.type === 'single' ? 'radio' : 'checkbox'}
                      name={`question-${qIdx}`}
                      checked={option.isCorrect}
                      onChange={(e) =>
                        handleUpdateOption(qIdx, oIdx, 'isCorrect', e.target.checked)
                      }
                    />
                    <input
                      type="text"
                      value={option.text}
                      onChange={(e) =>
                        handleUpdateOption(qIdx, oIdx, 'text', e.target.value)
                      }
                      placeholder={`Option ${oIdx + 1}`}
                      className="flex-1 px-2 py-1 border-2 border-orange-200 rounded"
                    />
                  </div>
                ))}
              </div>
            )}

            {(question.type === 'text' || question.type === 'number') && (
              <div>
                <label className="text-sm font-semibold">
                  Correct Answer
                </label>
                <input
                  type={question.type === 'number' ? 'number' : 'text'}
                  value={question.correctAnswerText}
                  onChange={(e) => {
                    const updated = [...data.miniAssignment.questions];
                    updated[qIdx].correctAnswerText = e.target.value;

                    onChange({
                      ...data,
                      miniAssignment: {
                        ...data.miniAssignment,
                        questions: updated
                      }
                    });
                  }}
                  placeholder="Enter correct answer"
                  className="w-full mt-1 px-3 py-2 border-2 border-orange-200 rounded-lg"
                />
              </div>
            )}

            {/* Remove Question */}
            <button
              onClick={() => handleRemoveQuestion(qIdx)}
              className="mt-3 text-red-600 text-sm"
            >
              Remove Question
            </button>
          </div>
        ))}

        <button
          onClick={handleAddQuestion}
          className="mt-2 px-4 py-2 bg-orange-600 text-white rounded-lg"
        >
          <Plus size={16} /> Add Question
        </button>
      </div>
    </div>
  );
}

