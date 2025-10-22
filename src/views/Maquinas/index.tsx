import Sidebar from "../../components/Sidebar";

const Maquinas = () => {
  return (
    <div className="h-screen bg-[#F4EEEE] w-full overflow-hidden flex">
      <Sidebar currentPage="maquinas" />
      <div className="flex-1 h-full overflow-y-auto">
        <div className="p-8 mt-5 h-full flex flex-col gap-6">
          <div className="flex items-center justify-between">
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
              className="bg-[#0084FF] hover:bg-[#0073E6] text-white font-semibold px-6 py-3 rounded-xl flex items-center gap-3 shadow-lg transition-all duration-200 hover:shadow-xl"
              style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 600 }}
              onClick={() => console.log('Nova Máquina')}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4"/>
              </svg>
              <span className="text-lg">Nova Máquina</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Maquinas;
