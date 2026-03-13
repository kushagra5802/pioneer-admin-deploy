// import { Plus, Trash2 } from 'lucide-react';

// export default function AssignmentBuilderForm({ data, onChange }) {
//   const handleAddQuestion = () => {
//     onChange({
//       ...data,
//       questions: [
//         ...data.questions,
//         {
//           questionText: '',
//           options: [
//             { text: '', isCorrect: false },
//             { text: '', isCorrect: false },
//             { text: '', isCorrect: false },
//             { text: '', isCorrect: false }
//           ]
//         }
//       ]
//     });
//   };

//   const handleRemoveQuestion = (index) => {
//     onChange({
//       ...data,
//       questions: data.questions.filter((_, i) => i !== index)
//     });
//   };

//   const handleUpdateQuestion = (index, text) => {
//     const updated = [...data.questions];
//     updated[index].questionText = text;
//     onChange({ ...data, questions: updated });
//   };

//   const handleUpdateOption = (qIndex, oIndex, field, value) => {
//     const updated = [...data.questions];
//     updated[qIndex].options[oIndex] = {
//       ...updated[qIndex].options[oIndex],
//       [field]: value
//     };
//     onChange({ ...data, questions: updated });
//   };

//   return (
//     <div className="space-y-6">
//       <div>
//         <h2 className="text-2xl font-bold text-gray-900 mb-2">
//           Final Assessment
//         </h2>
//         <p className="text-gray-600">
//           Create a multiple-choice assessment for this skill.
//         </p>
//       </div>

//       <div className="grid grid-cols-2 gap-4">
//         <div>
//           <label className="block text-sm font-semibold text-gray-700 mb-2">
//             Assessment Title
//           </label>
//           <input
//             type="text"
//             value={data.title}
//             onChange={(e) => onChange({ ...data, title: e.target.value })}
//             placeholder="e.g., Final Assessment"
//             className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
//           />
//         </div>

//         <div>
//           <label className="block text-sm font-semibold text-gray-700 mb-2">
//             Passing Score (%)
//           </label>
//           <input
//             type="number"
//             min="0"
//             max="100"
//             value={data.passingScore}
//             onChange={(e) =>
//               onChange({ ...data, passingScore: parseInt(e.target.value, 10) })
//             }
//             className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
//           />
//         </div>
//       </div>

//       <div>
//         <div className="flex justify-between items-center mb-4">
//           <h3 className="text-lg font-semibold text-gray-900">
//             Questions
//           </h3>
//           <button
//             onClick={handleAddQuestion}
//             className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
//           >
//             <Plus size={18} />
//             Add Question
//           </button>
//         </div>

//         <div className="space-y-6">
//           {data.questions.map((question, qIndex) => (
//             <div
//               key={qIndex}
//               className="border-2 border-gray-200 rounded-lg p-5"
//             >
//               <div className="flex justify-between items-start mb-4">
//                 <label className="block text-sm font-semibold text-gray-700">
//                   Question {qIndex + 1}
//                 </label>
//                 {data.questions.length > 1 && (
//                   <button
//                     onClick={() => handleRemoveQuestion(qIndex)}
//                     className="text-red-600 hover:text-red-700"
//                   >
//                     <Trash2 size={18} />
//                   </button>
//                 )}
//               </div>

//               <textarea
//                 value={question.questionText}
//                 onChange={(e) =>
//                   handleUpdateQuestion(qIndex, e.target.value)
//                 }
//                 placeholder="Enter your question here"
//                 rows={2}
//                 className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none mb-4 resize-none"
//               />

//               <div className="space-y-2 mb-4">
//                 <label className="text-sm font-semibold text-gray-700">
//                   Options
//                 </label>

//                 <div className="grid grid-cols-2 gap-3">
//                   {question.options.map((option, oIndex) => (
//                     <div key={oIndex} className="flex items-center gap-2">
//                       <input
//                         type="checkbox"
//                         checked={option.isCorrect}
//                         onChange={(e) =>
//                           handleUpdateOption(
//                             qIndex,
//                             oIndex,
//                             'isCorrect',
//                             e.target.checked
//                           )
//                         }
//                         className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
//                         title="Mark as correct answer"
//                       />
//                       <input
//                         type="text"
//                         value={option.text}
//                         onChange={(e) =>
//                           handleUpdateOption(
//                             qIndex,
//                             oIndex,
//                             'text',
//                             e.target.value
//                           )
//                         }
//                         placeholder={`Option ${oIndex + 1}`}
//                         className="flex-1 px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none text-sm"
//                       />
//                     </div>
//                   ))}
//                 </div>

//                 <p className="text-xs text-gray-500">
//                   Check to mark as correct answer
//                 </p>
//               </div>
//             </div>
//           ))}

//           {data.questions.length === 0 && (
//             <div className="text-center py-8 text-gray-500">
//               No questions added. Click "Add Question" to get started.
//             </div>
//           )}
//         </div>
//       </div>

//       <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4">
//         <div className="text-sm text-green-700">
//           <strong>Ready to go!</strong> You have {data.questions.length}{' '}
//           question{data.questions.length !== 1 ? 's' : ''} with a passing
//           score of {data.passingScore}%.
//         </div>
//       </div>
//     </div>
//   );
// }


import { Plus, Trash2 } from 'lucide-react';

export default function AssignmentBuilderForm({ data, onChange }) {

  /* =========================
     Helpers
  ========================= */

  const createEmptyQuestion = () => ({
    type: 'single',
    questionText: '',
    correctAnswerText: '',
    options: [
      { text: '', isCorrect: false },
      { text: '', isCorrect: false },
      { text: '', isCorrect: false },
      { text: '', isCorrect: false }
    ]
  });

  /* =========================
     Question Handlers
  ========================= */

  const handleAddQuestion = () => {
    onChange({
      ...data,
      questions: [...data.questions, createEmptyQuestion()]
    });
  };

  const handleRemoveQuestion = (index) => {
    onChange({
      ...data,
      questions: data.questions.filter((_, i) => i !== index)
    });
  };

  const handleUpdateQuestion = (index, text) => {
    const updated = [...data.questions];
    updated[index].questionText = text;
    onChange({ ...data, questions: updated });
  };

  const handleUpdateQuestionType = (index, type) => {
    const updated = [...data.questions];

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

    onChange({ ...data, questions: updated });
  };

  const handleUpdateOption = (qIndex, oIndex, field, value) => {
    const updated = [...data.questions];
    const question = updated[qIndex];

    if (field === 'isCorrect' && question.type === 'single') {
      // enforce only 1 correct
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

    onChange({ ...data, questions: updated });
  };

  const handleUpdateCorrectAnswer = (qIndex, value) => {
    const updated = [...data.questions];
    updated[qIndex].correctAnswerText = value;
    onChange({ ...data, questions: updated });
  };

  /* =========================
     Render
  ========================= */

  return (
    <div className="space-y-6">

      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Final Assessment
        </h2>
        <p className="text-gray-600">
          Create assessment with multiple question types.
        </p>
      </div>

      {/* Title + Passing Score */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold mb-2">
            Assessment Title
          </label>
          <input
            type="text"
            value={data.title}
            onChange={(e) =>
              onChange({ ...data, title: e.target.value })
            }
            className="w-full px-4 py-3 border-2 rounded-lg"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2">
            Passing Score (%)
          </label>
          <input
            type="number"
            min="0"
            max="100"
            value={data.passingScore}
            onChange={(e) =>
              onChange({
                ...data,
                passingScore: parseInt(e.target.value, 10)
              })
            }
            className="w-full px-4 py-3 border-2 rounded-lg"
          />
        </div>
      </div>

      {/* Questions */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Questions</h3>
          <button
            onClick={handleAddQuestion}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg"
          >
            <Plus size={18} />
            Add Question
          </button>
        </div>

        <div className="space-y-6">
          {data.questions.map((question, qIndex) => (
            <div key={qIndex} className="border-2 rounded-lg p-5">

              {/* Header */}
              <div className="flex justify-between mb-3">
                <span className="font-semibold">
                  Question {qIndex + 1}
                </span>
                {data.questions.length > 1 && (
                  <button
                    onClick={() => handleRemoveQuestion(qIndex)}
                    className="text-red-600"
                  >
                    <Trash2 size={18} />
                  </button>
                )}
              </div>

              {/* Question Text */}
              <textarea
                value={question.questionText}
                onChange={(e) =>
                  handleUpdateQuestion(qIndex, e.target.value)
                }
                placeholder="Enter question text"
                rows={2}
                className="w-full border-2 rounded-lg p-2 mb-3"
              />

              {/* Question Type */}
              <select
                value={question.type}
                onChange={(e) =>
                  handleUpdateQuestionType(qIndex, e.target.value)
                }
                className="w-full border-2 rounded-lg p-2 mb-4"
              >
                <option value="single">Single Choice</option>
                <option value="multiple">Multiple Choice</option>
                <option value="text">Written Answer</option>
                <option value="number">Numeric Answer</option>
              </select>

              {/* Choice Questions */}
              {(question.type === 'single' ||
                question.type === 'multiple') && (
                <div className="grid grid-cols-2 gap-3">
                  {question.options.map((option, oIndex) => (
                    <div key={oIndex} className="flex gap-2 items-center">
                      <input
                        type={
                          question.type === 'single'
                            ? 'radio'
                            : 'checkbox'
                        }
                        checked={option.isCorrect}
                        onChange={(e) =>
                          handleUpdateOption(
                            qIndex,
                            oIndex,
                            'isCorrect',
                            e.target.checked
                          )
                        }
                      />
                      <input
                        type="text"
                        value={option.text}
                        onChange={(e) =>
                          handleUpdateOption(
                            qIndex,
                            oIndex,
                            'text',
                            e.target.value
                          )
                        }
                        placeholder={`Option ${oIndex + 1}`}
                        className="flex-1 border-2 rounded p-2 text-sm"
                      />
                    </div>
                  ))}
                </div>
              )}

              {/* Text / Number Questions */}
              {(question.type === 'text' ||
                question.type === 'number') && (
                <div>
                  <label className="text-sm font-semibold">
                    Correct Answer
                  </label>
                  <input
                    type={
                      question.type === 'number'
                        ? 'number'
                        : 'text'
                    }
                    value={question.correctAnswerText}
                    onChange={(e) =>
                      handleUpdateCorrectAnswer(
                        qIndex,
                        e.target.value
                      )
                    }
                    placeholder="Enter correct answer"
                    className="w-full border-2 rounded-lg p-2 mt-1"
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Summary */}
      <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4">
        <div className="text-sm text-green-700">
          You have {data.questions.length}{' '}
          question{data.questions.length !== 1 ? 's' : ''}.
        </div>
      </div>
    </div>
  );
}
