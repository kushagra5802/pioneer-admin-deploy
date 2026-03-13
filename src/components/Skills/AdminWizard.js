import { useEffect, useState } from 'react';
import { ChevronRight, ChevronLeft, Check } from 'lucide-react';

import SkillDetailsForm from './forms/SkillDetailsForm';
import WeekEditorForm from './forms/WeekEditorForm';
import AssignmentBuilderForm from './forms/AssignmentBuilderForm';
import useAxiosInstance from '../../lib/useAxiosInstance';
import ReviewScreen from './forms/ReviewScreen';

export default function AdminWizard({skillId: initialSkillId,onBack}) {
    const axios=useAxiosInstance();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [skillId, setSkillId] = useState(initialSkillId);
  const [createdWeeks, setCreatedWeeks] = useState({});
  const [reviewData, setReviewData] = useState(null);

  /* ---------- STATE ---------- */

  const [skillData, setSkillData] = useState({
    title: '',
    description: '',
    month: '',
    year: new Date().getFullYear()
  });

  // const [weeksData, setWeeksData] = useState(
  //   Array.from({ length: 4 }, (_, i) => ({
  //     weekNumber: i + 1,
  //     title: '',
  //     content: '',
  //     description: '',
  //     resources: [],
  //     miniAssignment: {
  //       title: `Week ${i + 1} Practice Quiz`,
  //       passingScore: 70,
  //       questions: [
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
  //     }
  //   }))
  // );

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

  const [weeksData, setWeeksData] = useState(
    Array.from({ length: 4 }, (_, i) => ({
      weekNumber: i + 1,
      title: '',
      content: '',
      description: '',
      media: [],
      resources: [],
      miniAssignment: {
        title: `Week ${i + 1} Practice Quiz`,
        passingScore: 70,
        // questions: [
        //   {
        //     questionText: '',
        //     options: [
        //       { text: '', isCorrect: false },
        //       { text: '', isCorrect: false },
        //       { text: '', isCorrect: false },
        //       { text: '', isCorrect: false }
        //     ]
        //   }
        // ]
        questions: [createEmptyQuestion]
      }
    }))
  );
  const [assignmentData, setAssignmentData] = useState({
    title: 'Final Assessment',
    type: 'final',
    passingScore: 70,
    questions: [createEmptyQuestion]
  });

  /* ================= VALIDATION ================= */

  const validateQuestions = (questions) => {
    for (const q of questions) {
      if (!q.questionText.trim()) {
        setError('Question text required');
        return false;
      }

      if (q.type === 'single' || q.type === 'multiple') {
        if (!q.options.length) {
          setError('Options required');
          return false;
        }

        if (q.options.some(o => !o.text.trim())) {
          setError('Option text required');
          return false;
        }

        if (!q.options.some(o => o.isCorrect)) {
          setError('At least one correct option required');
          return false;
        }
      }

      if (q.type === 'text' || q.type === 'number') {
        if (!q.correctAnswerText?.toString().trim()) {
          setError('Correct answer required');
          return false;
        }
      }
    }

    return true;
  };

  const validateStep = () => {
    if (step === 1) {
      if (!skillData.title.trim()) {
        setError('Skill title required');
        return false;
      }
    }

    if (step >= 2 && step <= 5) {
      const week = weeksData[step - 2];
      if (!validateQuestions(week.miniAssignment.questions)) return false;
    }

    if (step === 6) {
      if (!validateQuestions(assignmentData.questions)) return false;
    }

    return true;
  };

  useEffect(() => {
    if (!initialSkillId) return;

    const loadSkill = async () => {
      try {
        const res = await axios.get(
          `api/skillReadiness/${initialSkillId}/edit`
        );

        const { skill, weeks, finalAssignment } = res.data.data;

        setSkillData({
          title: skill.title,
          description: skill.description,
          month: skill.month,
          year: skill.year
        });
        if(weeks?.length!==0)
          setWeeksData(weeks);
        if(finalAssignment)
          setAssignmentData(finalAssignment);

        setSkillId(skill.id);

      } catch (err) {
        setError('Failed to load skill for editing');
      }
    };

    loadSkill();
  }, [initialSkillId]);

  /* ---------- NAVIGATION ---------- */

  const handleStepClick = async (targetStep) => {
  setError('');
  setStep(targetStep);
  }
  console.log("skillId",skillId)

  /* ================= SUBMIT ================= */

  // const handleNextStep = async () => {
  //   if (!validateStep()) return;

  //   setLoading(true);
  //   setError('');

  //   try {
  //     /* ---------- STEP 1: CREATE SKILL ---------- */
  //     if (step === 1) {
  //       // if (skillId) {
  //         const res = await axios.post('api/skillReadiness/skill', skillData);
  //         setSkillId(res.data.data.id);
  //       // } else {
  //       //   await axios.put(
  //       //     `api/skillReadiness/skill/${skillId}`,
  //       //     skillData
  //       //   );
  //       // }
  //       setStep(2);
  //     }

  //     /* ---------- STEPS 2–5: CREATE WEEK ---------- */
  //     else if (step >= 2 && step <= 5) {
  //       const week = weeksData[step - 2];
  //       console.log("week",week)
  //       // Prevent double-submit
  //       if (createdWeeks[week?.weekNumber]) {
  //         setStep(step + 1);
  //         return;
  //       }

  //       const formData = new FormData();

  //       formData.append('skillId', skillId);
  //       formData.append('weekNumber', week?.weekNumber);
  //       formData.append('title', week?.title);
  //       formData.append('content', week?.content);
  //       formData.append('description', week?.description);

  //       formData.append('resources', JSON.stringify(week?.resources));
  //       formData.append(
  //         'assignment',
  //         JSON.stringify({
  //           title: week.miniAssignment.title,
  //           passingScore: week.miniAssignment.passingScore,
  //           questions: week.miniAssignment.questions
  //         })
  //       );

  //       formData.append("media", JSON.stringify(week.media));
  //     for (let [key, value] of formData.entries()) {
  //       console.log(key, value);
  //     }        
  //     const res = await axios.post(
  //         'api/skillReadiness/week',
  //         {
  //           skillId,
  //           weekNumber:week?.weekNumber,
  //           title:week?.title,
  //           content:week?.content,
  //           description:week?.description,
  //           resources: week.resources,
  //           assignment: {
  //             title: week.miniAssignment.title,
  //             passingScore: week.miniAssignment.passingScore,
  //             questions: week.miniAssignment.questions
  //           },
  //           media: week.media
  //         }
  //       );

  //       setCreatedWeeks(prev => ({
  //         ...prev,
  //         [week?.weekNumber]: res.data.data.id
  //       }));

  //       setStep(step + 1);
  //     }

  //     /* ---------- STEP 6: FINAL ASSESSMENT ---------- */
  //     else if (step === 6) {
  //       await axios.post('api/skillReadiness/assignment', {
  //         skillId,
  //         title: assignmentData.title,
  //         type: 'final',
  //         passingScore: assignmentData.passingScore,
  //         questions: assignmentData.questions
  //       });

  //       setStep(7);
  //       const reviewRes = await axios.get(
  //         `api/skillReadiness/${skillId}/review`
  //       );

  //       setReviewData(reviewRes.data.data);
  //     }

  //   } catch (err) {
  //     setError(
  //       err.response?.data?.error?.message ||
  //       'Failed to save this step'
  //     );
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const mapQuestionsForBackend = (questions) =>
    questions.map(q => ({
      type: q.type,
      questionText: q.questionText,
      options:
        q.type === 'single' || q.type === 'multiple'
          ? q.options
          : [],
      correctAnswerText:
        q.type === 'text' || q.type === 'number'
          ? q.correctAnswerText
          : null
    }));

  const handleNextStep = async () => {
    if (!validateStep()) return;

    setLoading(true);
    setError('');

    try {
      if (step === 1) {
        const res = await axios.post('api/skillReadiness/skill', skillData);
        setSkillId(res.data.data.id);
        setStep(2);
      }

      else if (step >= 2 && step <= 5) {
        const week = weeksData[step - 2];

        await axios.post('api/skillReadiness/week', {
          skillId,
          weekNumber: week.weekNumber,
          title: week.title,
          content: week.content,
          description: week.description,
          resources: week.resources,
          media: week.media,
          assignment: {
            title: week.miniAssignment.title,
            passingScore: week.miniAssignment.passingScore,
            questions: mapQuestionsForBackend(
              week.miniAssignment.questions
            )
          }
        });

        setStep(step + 1);
      }

      else if (step === 6) {
        await axios.post('api/skillReadiness/assignment', {
          skillId,
          title: assignmentData.title,
          type: 'final',
          passingScore: assignmentData.passingScore,
          questions: mapQuestionsForBackend(
            assignmentData.questions
          )
        });

        const reviewRes = await axios.get(
          `api/skillReadiness/${skillId}/review`
        );

        setReviewData(reviewRes.data.data);
        setStep(7);
      }

    } catch (err) {
      setError(err.response?.data?.error?.message || 'Failed to save');
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    'Skill Details',
    'Week 1',
    'Week 2',
    'Week 3',
    'Week 4',
    'Final Assessment',
    'Review'
  ];
  const handlePreviousStep = () => {
    setStep((s) => s - 1);
    setError('');
  };
  
  /* ---------- RENDER ---------- */
  console.log("step",step)
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">

        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-6">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={onBack}
              className="text-white text-sm font-semibold hover:underline"
            >
              ← Back to Skills
            </button>
          </div>

          <h1 className="text-3xl font-bold text-white mb-4">
            Admin Skill Creator
          </h1>

          <div className="flex justify-between">
            {steps.map((name, idx) => (
              <div key={idx} className="flex items-center">
                <button
                  onClick={() => handleStepClick(idx + 1)}
                  className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold ${
                    idx + 1 === step
                      ? 'bg-white text-blue-600'
                      : idx + 1 < step
                      ? 'bg-green-500 text-white'
                      : 'bg-blue-400 text-white'
                  }`}
                >
                  {idx + 1 < step ? <Check size={18} /> : idx + 1}
                </button>
                <span className="ml-2 text-white text-xs hidden sm:block">{name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-8 min-h-[420px]">
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
              {error}
            </div>
          )}

          {step === 1 && <SkillDetailsForm data={skillData} onChange={setSkillData} />}

          {step >= 2 && step <= 5 && (
            <WeekEditorForm
              data={weeksData[step - 2]}
              onChange={(updated) => {
                const copy = [...weeksData];
                copy[step - 2] = updated;
                setWeeksData(copy);
              }}
            />
          )}

          {step === 6 && (
            <AssignmentBuilderForm
              data={assignmentData}
              onChange={setAssignmentData}
            />
          )}
          {step === 7 && reviewData && (
            <ReviewScreen data={reviewData} />
          )}
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-8 py-6 flex justify-between">
          <button
            onClick={handlePreviousStep}
            disabled={step === 1 || loading}
            className="px-6 py-2 border rounded-lg font-semibold"
          >
            <ChevronLeft className="inline mr-1" /> Previous
          </button>

          {step!==7 && 
            <button
              onClick={handleNextStep}
              disabled={loading}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold"
            >
              {loading ? 'Saving…' : step === 7 ? 'Finish' : 'Next'}
              <ChevronRight className="inline ml-1" />
            </button>
          }
          {step===7 && 
            <button
              onClick={onBack}
              disabled={loading}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold"
            >
              {loading ? 'Saving…' : step === 7 ? 'Finish' : 'Next'}
              <ChevronRight className="inline ml-1" />
            </button>
          }
        </div>
      </div>
    </div>
  );
}


// import { useEffect, useState } from 'react';
// import { ChevronRight, ChevronLeft, Check } from 'lucide-react';
// import SkillDetailsForm from './forms/SkillDetailsForm';
// import WeekEditorForm from './forms/WeekEditorForm';
// import AssignmentBuilderForm from './forms/AssignmentBuilderForm';
// import ReviewScreen from './forms/ReviewScreen';
// import useAxiosInstance from '../../lib/useAxiosInstance';

// export default function AdminWizard({ skillId: initialSkillId, onBack }) {
//   const axios = useAxiosInstance();

//   const [step, setStep] = useState(1);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');
//   const [skillId, setSkillId] = useState(initialSkillId);
//   const [createdWeeks, setCreatedWeeks] = useState({});
//   const [reviewData, setReviewData] = useState(null);

//   /* ================= STATE ================= */

//   const [skillData, setSkillData] = useState({
//     title: '',
//     description: '',
//     month: '',
//     year: new Date().getFullYear()
//   });

//   const createEmptyQuestion = () => ({
//     type: 'single',
//     questionText: '',
//     correctAnswerText: '',
//     options: [
//       { text: '', isCorrect: false },
//       { text: '', isCorrect: false },
//       { text: '', isCorrect: false },
//       { text: '', isCorrect: false }
//     ]
//   });

//   const [weeksData, setWeeksData] = useState(
//     Array.from({ length: 4 }, (_, i) => ({
//       weekNumber: i + 1,
//       title: '',
//       content: '',
//       description: '',
//       media: [],
//       resources: [],
//       miniAssignment: {
//         title: `Week ${i + 1} Practice Quiz`,
//         passingScore: 70,
//         questions: [createEmptyQuestion()]
//       }
//     }))
//   );

//   const [assignmentData, setAssignmentData] = useState({
//     title: 'Final Assessment',
//     type: 'final',
//     passingScore: 70,
//     questions: [createEmptyQuestion()]
//   });

//   /* ================= VALIDATION ================= */

//   const validateQuestions = (questions) => {
//     for (const q of questions) {
//       if (!q.questionText.trim()) {
//         setError('Question text required');
//         return false;
//       }

//       if (q.type === 'single' || q.type === 'multiple') {
//         if (!q.options.length) {
//           setError('Options required');
//           return false;
//         }

//         if (q.options.some(o => !o.text.trim())) {
//           setError('Option text required');
//           return false;
//         }

//         if (!q.options.some(o => o.isCorrect)) {
//           setError('At least one correct option required');
//           return false;
//         }
//       }

//       if (q.type === 'text' || q.type === 'number') {
//         if (!q.correctAnswerText?.toString().trim()) {
//           setError('Correct answer required');
//           return false;
//         }
//       }
//     }

//     return true;
//   };

//   const validateStep = () => {
//     if (step === 1) {
//       if (!skillData.title.trim()) {
//         setError('Skill title required');
//         return false;
//       }
//     }

//     if (step >= 2 && step <= 5) {
//       const week = weeksData[step - 2];
//       if (!validateQuestions(week.miniAssignment.questions)) return false;
//     }

//     if (step === 6) {
//       if (!validateQuestions(assignmentData.questions)) return false;
//     }

//     return true;
//   };

//   /* ================= SUBMIT ================= */

//   const mapQuestionsForBackend = (questions) =>
//     questions.map(q => ({
//       type: q.type,
//       questionText: q.questionText,
//       options:
//         q.type === 'single' || q.type === 'multiple'
//           ? q.options
//           : [],
//       correctAnswerText:
//         q.type === 'text' || q.type === 'number'
//           ? q.correctAnswerText
//           : null
//     }));

//   const handleNextStep = async () => {
//     if (!validateStep()) return;

//     setLoading(true);
//     setError('');

//     try {
//       if (step === 1) {
//         const res = await axios.post('api/skillReadiness/skill', skillData);
//         setSkillId(res.data.data.id);
//         setStep(2);
//       }

//       else if (step >= 2 && step <= 5) {
//         const week = weeksData[step - 2];

//         await axios.post('api/skillReadiness/week', {
//           skillId,
//           weekNumber: week.weekNumber,
//           title: week.title,
//           content: week.content,
//           description: week.description,
//           resources: week.resources,
//           media: week.media,
//           assignment: {
//             title: week.miniAssignment.title,
//             passingScore: week.miniAssignment.passingScore,
//             questions: mapQuestionsForBackend(
//               week.miniAssignment.questions
//             )
//           }
//         });

//         setStep(step + 1);
//       }

//       else if (step === 6) {
//         await axios.post('api/skillReadiness/assignment', {
//           skillId,
//           title: assignmentData.title,
//           type: 'final',
//           passingScore: assignmentData.passingScore,
//           questions: mapQuestionsForBackend(
//             assignmentData.questions
//           )
//         });

//         const reviewRes = await axios.get(
//           `api/skillReadiness/${skillId}/review`
//         );

//         setReviewData(reviewRes.data.data);
//         setStep(7);
//       }

//     } catch (err) {
//       setError(err.response?.data?.error?.message || 'Failed to save');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const steps = [
//     'Skill Details',
//     'Week 1',
//     'Week 2',
//     'Week 3',
//     'Week 4',
//     'Final Assessment',
//     'Review'
//   ];

//   /* ================= RENDER ================= */

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-8">
//       <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">

//         <div className="bg-blue-600 px-8 py-6">
//           <h1 className="text-2xl font-bold text-white">
//             Admin Skill Creator
//           </h1>
//         </div>

//         <div className="p-8">
//           {error && (
//             <div className="mb-4 p-3 bg-red-100 text-red-600 rounded">
//               {error}
//             </div>
//           )}

//           {step === 1 && (
//             <SkillDetailsForm data={skillData} onChange={setSkillData} />
//           )}

//           {step >= 2 && step <= 5 && (
//             <WeekEditorForm
//               data={weeksData[step - 2]}
//               onChange={(updated) => {
//                 const copy = [...weeksData];
//                 copy[step - 2] = updated;
//                 setWeeksData(copy);
//               }}
//             />
//           )}

//           {step === 6 && (
//             <AssignmentBuilderForm
//               data={assignmentData}
//               onChange={setAssignmentData}
//             />
//           )}

//           {step === 7 && reviewData && (
//             <ReviewScreen data={reviewData} />
//           )}
//         </div>

//         <div className="px-8 py-6 flex justify-between bg-gray-50">
//           <button
//             onClick={() => setStep(s => s - 1)}
//             disabled={step === 1}
//             className="px-4 py-2 border rounded"
//           >
//             <ChevronLeft size={16} /> Previous
//           </button>

//           {step !== 7 && (
//             <button
//               onClick={handleNextStep}
//               disabled={loading}
//               className="px-4 py-2 bg-blue-600 text-white rounded"
//             >
//               {loading ? 'Saving...' : 'Next'}
//               <ChevronRight size={16} />
//             </button>
//           )}

//           {step === 7 && (
//             <button
//               onClick={onBack}
//               className="px-4 py-2 bg-blue-600 text-white rounded"
//             >
//               Finish
//             </button>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }
