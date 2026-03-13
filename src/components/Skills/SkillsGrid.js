// import { useEffect, useState } from 'react';
// import useAxiosInstance from '../../lib/useAxiosInstance';

// export default function SkillsGrid({ onEdit }) {
//   const axios = useAxiosInstance();
//   const [skills, setSkills] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchSkills = async () => {
//       try {
//         const res = await axios.get('api/skillReadiness/skills');
//         setSkills(res.data.data || []);
//       } catch (err) {
//         console.error('Failed to load skills');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchSkills();
//   }, []);

//   if (loading) {
//     return <div className="text-gray-500">Loading skills…</div>;
//   }

//   if (!skills.length) {
//     return <div className="text-gray-500">No skills added yet.</div>;
//   }

//   return (
//     <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//       {skills.map((skill) => (
//         <button
//           key={skill.id}
//           onClick={() => onEdit(skill.id)}
//           className="p-6 bg-white rounded-xl shadow hover:shadow-lg transition text-left"
//         >
//           {/* Month + Year */}
//           <div className="text-xs font-medium text-gray-500 uppercase tracking-wide">
//             {skill.month} {skill.year}
//           </div>

//           {/* Title */}
//           <h3 className="text-lg font-semibold text-gray-900 mt-1">
//             {skill.title}
//           </h3>

//           {/* Description */}
//           <p className="text-sm text-gray-600 mt-2 line-clamp-2">
//             {skill.description || 'No description'}
//           </p>

//           {/* Action */}
//           <div className="mt-4 text-blue-600 font-medium text-sm">
//             Edit Skill →
//           </div>
//         </button>
//       ))}
//     </div>
//   );
// }


import { useEffect, useState } from 'react';
import useAxiosInstance from '../../lib/useAxiosInstance';
import DeleteModal from '../DeleteModal';

export default function SkillsGrid({ onEdit }) {
  const axios = useAxiosInstance();

  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);

  const [isDeleteModal, setIsDeleteModal] = useState(false);
  const [selectedSkill, setSelectedSkill] = useState(null);

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const res = await axios.get('api/skillReadiness/skills');
        setSkills(res.data.data || []);
      } catch (err) {
        console.error('Failed to load skills');
      } finally {
        setLoading(false);
      }
    };

    fetchSkills();
  }, []);

  /* ---------- DELETE HANDLERS ---------- */

  const openDeleteModal = (skill, e) => {
    e.stopPropagation(); // prevent edit click
    setSelectedSkill(skill);
    setIsDeleteModal(true);
  };

  const closeDeleteModal = () => {
    setSelectedSkill(null);
    setIsDeleteModal(false);
  };

  const handleDeleteSkill = async () => {
    if (!selectedSkill) return;

    try {
      await axios.delete(
        `api/skillReadiness/${selectedSkill.id}/deleteSkill`
      );

      // Remove from UI
      setSkills((prev) =>
        prev.filter((s) => s.id !== selectedSkill.id)
      );

      closeDeleteModal();
    } catch (err) {
      console.error('Failed to delete skill');
    }
  };

  /* ---------- UI STATES ---------- */

  if (loading) {
    return <div className="text-gray-500">Loading skills…</div>;
  }

  if (!skills.length) {
    return <div className="text-gray-500">No skills added yet.</div>;
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {skills.map((skill) => (
          <div
            key={skill.id}
            onClick={() => onEdit(skill.id)}
            className="relative p-6 bg-white rounded-xl shadow hover:shadow-lg transition cursor-pointer"
          >
            {/* Delete button */}
            <button
              onClick={(e) => openDeleteModal(skill, e)}
              className="absolute top-3 right-3 text-red-500 text-xs font-semibold hover:underline"
            >
              Delete
            </button>

            {/* Month + Year */}
            <div className="text-xs font-medium text-gray-500 uppercase tracking-wide">
              {skill.month} {skill.year}
            </div>

            {/* Title */}
            <h3 className="text-lg font-semibold text-gray-900 mt-1">
              {skill.title}
            </h3>

            {/* Description */}
            <p className="text-sm text-gray-600 mt-2 line-clamp-2">
              {skill.description || 'No description'}
            </p>

            {/* Action */}
            <div className="mt-4 text-blue-600 font-medium text-sm">
              Edit Skill →
            </div>
          </div>
        ))}
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteModal
        isDeleteModal={isDeleteModal}
        showModalDelete={closeDeleteModal}
        handleDelete={handleDeleteSkill}
        textheading="Delete Skill"
        action="delete"
        deleteTitle={selectedSkill?.title}
        deleteBtn="Delete"
      />
    </>
  );
}
