import { useState, useEffect } from 'react';
import PageHeader from '../PageHeader';
import AdminWizard from './AdminWizard';
import SkillsGrid from './SkillsGrid';

const dummySkill = {
  id: 'skill-1',
  title: 'Critical Thinking',
};

const dummyWeeks = [
  { id: 'week-1', week_number: 1 },
  { id: 'week-2', week_number: 2 },
  { id: 'week-3', week_number: 3 },
];

const dummyModules = [
  {
    id: 'module-1',
    title: 'Module 1: Theory & Application',
    description:
      'Critical thinking is the intellectually disciplined process of analyzing, evaluating, and applying information logically.',
  },
];

const dummyAssessment = {
  id: 'assessment-1',
  title: 'Assessment: Week 1',
};

const dummyQuestions = [
  {
    id: 'q1',
    question_text: 'What is the primary goal of critical thinking?',
    options: [
      { id: 'q1o1', option_text: 'Confirming biases' },
      { id: 'q1o2', option_text: 'Guided action based on evaluation' },
      { id: 'q1o3', option_text: 'Ignoring evidence' },
      { id: 'q1o4', option_text: 'Quick decision making' },
    ],
  },
  {
    id: 'q2',
    question_text: 'Which of these is a universal intellectual value?',
    options: [
      { id: 'q2o1', option_text: 'Speed' },
      { id: 'q2o2', option_text: 'Clarity' },
      { id: 'q2o3', option_text: 'Popularity' },
      { id: 'q2o4', option_text: 'Novelty' },
    ],
  },
];

export default function SkillsReadiness() {
  const [showAdminWizard, setShowAdminWizard] = useState(false);
  const [selectedSkillId, setSelectedSkillId] = useState(null);

  /* ---------------- ADMIN VIEW ---------------- */
  if (showAdminWizard) {
    return (
      <div className="min-h-screen bg-slate-50">
        <PageHeader name="Admin • Skill Builder" />
        <AdminWizard 
          skillId={selectedSkillId}
          onBack={() => {
            setShowAdminWizard(false);
            setSelectedSkillId(null);
          }} 
        />
      </div>
    );
  }

  /* ---------------- USER VIEW ---------------- */
  return (
    <div className="min-h-screen bg-slate-50">
      <PageHeader name="Skills" />

      {/* Top Action Bar */}
      <div className="px-8 pt-6 flex justify-end">
        <button
          onClick={() => setShowAdminWizard(true)}
          className="px-5 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700"
        >
          + Add Skill
        </button>
      </div>

      <main className="p-8">
        <SkillsGrid
          onEdit={(skillId) => {
            setSelectedSkillId(skillId);
            setShowAdminWizard(true);
          }}
        />
      </main>
    </div>
  );
}
