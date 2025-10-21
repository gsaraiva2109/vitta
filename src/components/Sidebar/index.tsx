import React from 'react';

interface MenuItem {
  name: string;
  icon: React.ReactNode;
  path: string;
}

interface SidebarProps {
  currentPage: string;
}

const Sidebar: React.FC<SidebarProps> = ({ currentPage }) => {
  const menuItems: MenuItem[] = [
    {
      name: 'Home',
      path: 'home',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"/>
        </svg>
      )
    },
    {
      name: 'Máquinas',
      path: 'maquinas',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd"/>
        </svg>
      )
    },
    {
      name: 'Manutenções',
      path: 'manutencoes',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"/>
        </svg>
      )
    },
    {
      name: 'Alertas',
      path: 'alertas',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
        </svg>
      )
    },
    {
      name: 'Relatórios',
      path: 'relatorios',
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
        {/* Logo space */}
      </div>
      <div className="flex flex-col pt-[91px] px-[29px] flex-1">
        {menuItems.map((item) => {
          const isActive = currentPage === item.path;
          return (
            <div
              key={item.path}
              className={`flex items-center gap-3.5 py-2.5 px-[17px] mb-4 rounded-lg cursor-pointer transition-all ${
                isActive 
                  ? 'bg-[#0084FF3B] shadow-[0px_4px_4px_rgba(0,0,0,0.25)]' 
                  : 'hover:bg-gray-50'
              }`}
            >
              <div className={isActive ? 'text-[#0084FF]' : 'text-[#373535]'}>
                {item.icon}
              </div>
              <span 
                className={`text-[15px] font-semibold ${
                  isActive ? 'text-[#0084FF]' : 'text-[#363535]'
                }`}
                style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 600 }}
              >
                {item.name}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Sidebar;
