import React from "react";

import ClientIcon from "../assets/icons/client.png"; 
import Users from "../assets/icons/user.png";
import Help from "../assets/svg/help.svg";
import Settings from "../assets/icons/settings.png";
import Career from "../assets/icons/career.png"
import Skill from "../assets/icons/skill.png"
import Blog from "../assets/icons/blog.png"
import University from "../assets/icons/university.png"

// Define Client variable for direct usage
const Client = <img src={ClientIcon} alt='' />;

const SidebarMapping = () => {
  return {
    admin: [
      {
        id: 16,
        path: "/schools",
        name: "School",
        icon: Client
      },
      {
        id: 2,
        path: "/users",
        name: "Users",
        icon: <img src={Users} alt='' />
      },
      {
        id: 6,
        path: "/student-experience",
        name: "Experience Content",
        icon: <img src={Blog} alt='' />
      },
      {
        id: 13,
        path: "/settings",
        name: "Settings",
        icon: <img src={Settings} alt='' className='sidebar-icons' />
      },
    ],
    superadmin: [
      {
        id: 16,
        path: "/schools",
        name: "School",
        icon: Client
      },
      {
        id: 2,
        path: "/users",
        name: "Users",
        icon: <img src={Users} alt='' />
      },
      {
        id: 3,
        path: "/careers",
        name: "Careers",
        icon: <img src={Career} alt='' />
      },
      {
        id: 4,
        path: "/university",
        name: "Universities",
        icon: <img src={University} alt='' />
      },
      {
        id: 5,
        path: "/skills",
        name: "Skill Readiness",
        icon: <img src={Skill} alt='' />
      },
      {
        id: 5,
        path: "/studentBlog",
        name: "Student Blogs",
        icon: <img src={Blog} alt='' />
      },
      {
        id: 6,
        path: "/student-experience",
        name: "Experience Content",
        icon: <img src={Blog} alt='' />
      },
      {
        id: 13,
        path: "/settings",
        name: "Settings",
        icon: <img src={Settings} alt='' className='sidebar-icons' />
      }
    ],
    clientManager: [
      {
        id: 16,
        path: "/schools",
        name: "School",
        icon: Client
      },

      // {
      //   id: 2,
      //   path: "/users",
      //   name: "Users",
      //   icon: <img src={Users} alt='' />
      // },
      {
        id: 11,
        path: "/settings",
        name: "Settings",
        icon: <img src={Settings} alt='' className='sidebar-icons' />
      }
    ],
    accounts: [
      {
        id: 11,
        path: "/settings",
        name: "Settings",
        icon: <img src={Settings} alt='' />
      },
      {
        id: 12,
        path: "/help-center",
        name: "Help",
        icon: <img src={Help} alt='' />
      }
    ]
  };
};

export default SidebarMapping;
