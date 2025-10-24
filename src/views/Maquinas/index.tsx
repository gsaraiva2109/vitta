import Sidebar from "../../components/Sidebar";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { useState } from "react";

const Maquinas = () => {
  const [selectedFilter, setSelectedFilter] = useState(null);
  
  const filterOptions = [
    { label: 'Todos os status', value: null },
    { label: 'Ativos', value: 'ativos' },
    { label: 'Inativos', value: 'inativos' },
    { label: 'Em Manutenção', value: 'manutencao' }
  ];

  return (
    <div className="h-screen bg-[#F4EEEE] w-full overflow-hidden flex">
      <Sidebar currentPage="maquinas" />
      <div className="flex-1 h-full overflow-y-auto">
        <div className="p-8 h-full flex flex-col gap-6">
          {/* Header com título e botão */}
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-[48px] font-semibold text-black mb-2" style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 600 }}>
                Máquinas hospitalares
              </h1>
              <p className="text-base text-[#767575]" style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 400 }}>
                Gerencie o cadastro de máquinas e equipamentos
              </p>
            </div>
            
            {/* Botão Nova Máquina */}
            <button 
              className="bg-[#0084FF] hover:bg-[#0073E6] text-white font-semibold px-6 py-3 mt-24 mb-4 rounded-xl flex items-center gap-3 shadow-lg transition-all duration-200 hover:shadow-xl"
              style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 600 }}
              onClick={() => console.log('Nova Máquina')}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4"/>
              </svg>
              <span className="text-lg">Nova Máquina</span>
            </button>
          </div>

          {/* Container arredondado com as barras de busca e filtro */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex flex-col sm:flex-row gap-4 w-full">
              {/* Input de Busca */}
              <div className="flex-1 relative">
                <svg 
                  viewBox="0 0 20 20" 
                  aria-hidden="true" 
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 fill-gray-400 transition z-10"
                >
                  <path d="M16.72 17.78a.75.75 0 1 0 1.06-1.06l-1.06 1.06ZM9 14.5A5.5 5.5 0 0 1 3.5 9H2a7 7 0 0 0 7 7v-1.5ZM3.5 9A5.5 5.5 0 0 1 9 3.5V2a7 7 0 0 0-7 7h1.5ZM9 3.5A5.5 5.5 0 0 1 14.5 9H16a7 7 0 0 0-7-7v1.5Zm3.89 10.45 3.83 3.83 1.06-1.06-3.83-3.83-1.06 1.06ZM14.5 9a5.48 5.48 0 0 1-1.61 3.89l1.06 1.06A6.98 6.98 0 0 0 16 9h-1.5Zm-1.61 3.89A5.48 5.48 0 0 1 9 14.5V16a6.98 6.98 0 0 0 4.95-2.05l-1.06-1.06Z"></path>
                </svg>
                <InputText 
                  placeholder="Buscar por nome ou patrimônio" 
                  className="w-full h-[52px] pl-12 pr-4 text-base rounded-xl border border-gray-200 shadow-sm"
                  style={{ 
                    fontFamily: 'Poppins, sans-serif', 
                    fontWeight: 400,
                    fontSize: '15px'
                  }}
                />
              </div>

              {/* Dropdown de Filtro */}
              <div className="w-full sm:w-[280px] relative">
                <svg 
                  viewBox="0 0 20 20" 
                  aria-hidden="true" 
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 fill-gray-400 transition z-10"
                >
                  <path d="M2.75 3h14.5a.75.75 0 0 1 0 1.5H2.75a.75.75 0 0 1 0-1.5ZM5 7.75A.75.75 0 0 1 5.75 7h8.5a.75.75 0 0 1 0 1.5h-8.5A.75.75 0 0 1 5 7.75ZM7.75 11.5a.75.75 0 0 0 0 1.5h4.5a.75.75 0 0 0 0-1.5h-4.5ZM10 15.25a.75.75 0 0 1 .75-.75h.5a.75.75 0 0 1 0 1.5h-.5a.75.75 0 0 1-.75-.75Z" />
                </svg>
                <Dropdown
                  value={selectedFilter}
                  onChange={(e) => setSelectedFilter(e.value)}
                  options={filterOptions}
                  placeholder="Todos os status"
                  className="w-full h-[52px] pl-12 rounded-xl border border-gray-200 shadow-sm"
                  panelClassName="rounded-xl"
                  style={{ 
                    fontFamily: 'Poppins, sans-serif', 
                    fontWeight: 400 
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Maquinas;
