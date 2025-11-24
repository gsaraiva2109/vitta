import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import 'primeicons/primeicons.css';
import { logout } from '../../services/authService';

interface MenuItem {
  name: string;
  icon: React.ReactNode;
  path: string;
}

interface SidebarProps {
  currentPage?: string;
}

const Sidebar: React.FC<SidebarProps> = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const menuItems: MenuItem[] = [
    {
      name: 'Home',
      path: '/',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"/>
        </svg>
      )
    },
    {
      name: 'Máquinas',
      path: '/maquinas',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd"/>
        </svg>
      )
    },
    {
      name: 'Manutenções',
      path: '/manutencoes',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"/>
        </svg>
      )
    },
    {
      name: 'Alertas',
      path: '/alertas',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
        </svg>
      )
    },
    {
      name: 'Relatórios',
      path: '/relatorios',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"/>
          <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd"/>
        </svg>
      )
    }
  ];

  return (
    <div className="w-[282px] flex-shrink-0 h-full flex flex-col bg-white">
      <div className="h-[67px] border-b border-[#0000001C] flex items-center justify-center">
        <svg width="151" height="37" viewBox="0 0 151 37" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M74.1088 9.08L68.2768 26H62.2528L56.3968 9.08H61.4368L65.2768 21.296L69.0928 9.08H74.1088ZM80.7785 9.08V26H76.0745V9.08H80.7785ZM96.7013 9.08V12.824H92.1893V26H87.4853V12.824H83.0213V9.08H96.7013ZM111.686 9.08V12.824H107.174V26H102.47V12.824H98.0057V9.08H111.686ZM124.63 23.24H118.63L117.718 26H112.774L118.942 9.08H124.366L130.51 26H125.542L124.63 23.24ZM123.454 19.64L121.63 14.168L119.83 19.64H123.454Z" fill="#67B476"/>
          <g clipPath="url(#clip0_415_1671)">
            <path d="M18.5 0.5C28.4417 0.5 36.5 8.55495 36.5 18.5C36.5 28.445 28.4417 36.5 18.5 36.5C8.5583 36.5 0.5 28.445 0.5 18.5C0.5 8.55495 8.5583 0.5 18.5 0.5ZM18.5 9.90625C17.5835 9.90625 16.8438 10.6514 16.8438 11.5625V16.8438H11.5625C10.646 16.8438 9.90625 17.5889 9.90625 18.5C9.90625 19.4111 10.646 20.1562 11.5625 20.1562H16.8438V25.4375C16.8438 26.3486 17.5835 27.0938 18.5 27.0938C19.4165 27.0938 20.1562 26.3486 20.1562 25.4375V20.1562H25.4375C26.354 20.1562 27.0938 19.4111 27.0938 18.5C27.0938 17.5889 26.354 16.8438 25.4375 16.8438H20.1562V11.5625C20.1562 10.6514 19.4165 9.90625 18.5 9.90625Z" fill="#6CCF78" stroke="#67B476"/>
          </g>
          <defs>
            <clipPath id="clip0_415_1671">
              <rect width="37" height="37" fill="white"/>
            </clipPath>
          </defs>
        </svg>
      </div>
      <div className="flex flex-col pt-[91px] px-[29px] flex-1">
        {menuItems.map((item) => (
          <NavLink key={item.path} to={item.path} end>
            {({ isActive }) => (
              <div
                className={`relative flex items-center gap-3.5 py-2.5 px-[17px] mb-4 rounded-lg cursor-pointer transition-all
                ${isActive ? 'bg-[#0084FF3B] shadow-[0px_4px_4px_rgba(0,0,0,0.25)]' : 'hover:bg-gray-50'}`}
              >
                
                <div className={isActive ? 'text-[#0084FF]' : 'text-[#373535]'}>
                  {item.icon}
                </div>
                <span
                  className={`text-[15px] font-semibold ${isActive ? 'text-[#0084FF]' : 'text-[#363535]'}`}
                  style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 600 }}
                >
                  {item.name}
                </span>
              </div>
            )}
          </NavLink>
        ))}
      </div>
      <div className="px-[29px] mb-4">
        <button
          onClick={handleLogout}
          className="relative flex items-center gap-3.5 py-2.5 px-[17px] w-full rounded-lg cursor-pointer bg-transparent transition-all duration-300 hover:bg-gradient-to-r hover:from-red-50 hover:to-red-100 hover:shadow-md group overflow-hidden border-0"
        >
          <div className="text-[#373535] group-hover:text-red-600 transition-all duration-300 group-hover:scale-110">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </div>
          <span
            className="text-[15px] font-semibold text-[#373535] group-hover:text-red-600 transition-all duration-300"
            style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 600 }}
          >
            Sair
          </span>
          {/* Efeito de brilho sutil no hover */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-red-200/20 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700 ease-in-out pointer-events-none"></div>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
