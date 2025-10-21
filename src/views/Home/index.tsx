const Home = () => {
  return (
    <div className="min-h-screen bg-white">
      <div className="w-full max-w-screen mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-start bg-[#F4EEEE] mb-1 min-h-screen">
          {/* Sidebar */}
          <div className="w-full lg:w-[282px] lg:mr-[34px]">
            <div className="self-stretch bg-white h-[67px] border border-solid border-[#0000001C]">
            </div>
            <div className="flex flex-col items-start self-stretch bg-white pt-[91px] pb-[353px] rounded-[1px]">
              <div className="flex items-center self-stretch bg-[#0084FF3B] py-[9px] mb-[17px] mx-[29px] rounded-lg home-shadow">
                <img
                  src={"https://storage.googleapis.com/tagjs-prod.appspot.com/v1/v1HAnSFym6/69g1z5mj_expires_30_days.png"} 
                  className="w-[15px] h-[15px] ml-[17px] mr-3.5 object-fill"
                />
                <span className="text-[#0084FF] text-[15px] font-bold" >
                  {"Home"}
                </span>
              </div>
              <div className="flex items-start mb-4 ml-[74px]">
                <span className="text-[#363535] text-[15px] font-bold ml-[1px]" >
                  {"Máquinas"}
                </span>
              </div>
              <div className="flex items-center mb-[15px] ml-[43px] gap-[13px]">
                <img
                  src={"https://storage.googleapis.com/tagjs-prod.appspot.com/v1/v1HAnSFym6/f1p7k6ou_expires_30_days.png"} 
                  className="w-[19px] h-5 object-fill"
                />
                <span className="text-[#373535] text-[15px] font-bold my-[1px]" >
                  {"Manutenções"}
                </span>
              </div>
              <div className="flex items-center mb-3.5 ml-[43px] gap-[11px]">
                <img
                  src={"https://storage.googleapis.com/tagjs-prod.appspot.com/v1/v1HAnSFym6/vxh3vw5g_expires_30_days.png"} 
                  className="w-5 h-[19px] object-fill"
                />
                <span className="text-[#373535] text-[15px] font-bold my-0.5" >
                  {"Alertas"}
                </span>
              </div>
              <div className="flex items-start ml-[41px] gap-2.5">
                <img
                  src={"https://storage.googleapis.com/tagjs-prod.appspot.com/v1/v1HAnSFym6/cliuyhmi_expires_30_days.png"} 
                  className="w-6 h-6 object-fill"
                />
                <span className="text-[#373535] text-[15px] font-bold" >
                  {"Relatórios"}
                </span>
              </div>
            </div>
          </div>

          {/* Coluna Central */}
          <div className="flex flex-col items-start w-full lg:w-auto lg:flex-1 lg:max-w-[462px] mt-8 lg:mt-[58px] px-4 lg:px-0 lg:mr-4">
            <span className="text-black text-4xl font-bold mb-[9px] ml-0.5" >
              {"Home"}
            </span>
            <span className="text-[#767575] text-xs mb-[30px]" >
              {"Visão geral do sistema"}
            </span>
            <div className="flex items-start self-stretch mb-[47px] gap-4">
              <div className="flex items-center bg-[#31BA271F] w-[223px] py-[15px] rounded-lg">
                <button className="flex flex-col items-center bg-[#2B9804DB] text-left w-[72px] py-2.5 ml-[15px] mr-2 rounded-lg border-0"
                  onClick={()=>alert("Pressed!")}> 
                  <img
                    src={"https://storage.googleapis.com/tagjs-prod.appspot.com/v1/v1HAnSFym6/s7vd4zx9_expires_30_days.png"} 
                    className="w-[30px] h-[30px] object-fill"
                  />
                </button>
                <div className="flex flex-col items-start w-[106px] mr-[22px] gap-[7px]">
                  <span className="text-[#2B9803] text-xs text-center" >
                    {"Máquinas Ativas"}
                  </span>
                  <span className="text-[#2B9803] text-[32px] ml-1.5" >
                    {"4"}
                  </span>
                </div>
              </div>
              <div className="flex items-center bg-[#E6E3201F] w-[223px] py-3 rounded-lg">
                <button className="flex flex-col items-center bg-[#D4D016DB] text-left w-[72px] py-2.5 ml-[17px] mr-[5px] rounded-lg border-0"
                  onClick={()=>alert("Pressed!")}> 
                  <img
                    src={"https://storage.googleapis.com/tagjs-prod.appspot.com/v1/v1HAnSFym6/186rpb5a_expires_30_days.png"} 
                    className="w-[30px] h-8 object-fill"
                  />
                </button>
                <div className="flex flex-col items-start w-[103px] mr-[25px] gap-2">
                  <span className="text-[#D4D116] text-xs text-center" >
                    {"Em Manutenção"}
                  </span>
                  <span className="text-[#D4D116] text-[32px] ml-[3px]" >
                    {"4"}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex flex-col items-start self-stretch relative">
              <div className="flex flex-col items-start self-stretch bg-white pt-6 rounded-[10px]">
                <div className="flex items-start mb-[21px] ml-7 gap-[7px]">
                  <img
                    src={"https://storage.googleapis.com/tagjs-prod.appspot.com/v1/v1HAnSFym6/49fdmbn6_expires_30_days.png"} 
                    className="w-7 h-[27px] object-fill"
                  />
                  <div className="flex flex-col items-start w-[216px] my-0.5">
                    <span className="text-[#373535] text-base ml-[9px]" >
                      {"Últimas Manutenções"}
                    </span>
                    <span className="text-black text-base ml-[41px]" >
                      {"Últimas Manutenções"}
                    </span>
                  </div>
                </div>
                <div className="flex flex-col items-start self-stretch bg-[#D9D9D970] py-4 mb-2 mx-[25px] gap-0.5 rounded-lg">
                  <div className="flex flex-col items-end self-stretch">
                    <div className="flex flex-col items-start bg-[#73E064D4] py-[3px] mr-[19px] rounded-[10px]">
                      <span className="text-[#595454] text-[6px] mx-2" >
                        {"Concluída"}
                      </span>
                    </div>
                  </div>
                  <span className="text-[#595454] text-[6px] ml-[17px]" >
                    {"preventiva - dd/mm/aaaa"}
                  </span>
                </div>
                <div className="flex flex-col items-start self-stretch bg-[#D9D9D970] py-4 mb-2 mx-6 gap-1 rounded-lg">
                  <div className="flex flex-col items-end self-stretch">
                    <div className="flex flex-col items-start bg-[#73E064D4] py-[3px] mr-[19px] rounded-[10px]">
                      <span className="text-[#595454] text-[6px] mx-[9px]" >
                        {"Concluída"}
                      </span>
                    </div>
                  </div>
                  <span className="text-[#595454] text-[6px] ml-[18px]" >
                    {"preventiva - dd/mm/aaaa"}
                  </span>
                </div>
                <div className="flex flex-col items-start self-stretch bg-[#D9D9D970] py-4 mb-2 mx-[22px] gap-1 rounded-lg">
                  <div className="flex items-center self-stretch mx-5">
                    <span className="flex-1 text-black text-[10px] text-center mr-[269px]" >
                      {"Máquina X"}
                    </span>
                    <div className="flex flex-col bg-[#73E064D4] w-[53px] py-[3px] rounded-[10px]">
                      <span className="text-[#595454] text-[6px] text-center" >
                        {"Concluída"}
                      </span>
                    </div>
                  </div>
                  <span className="text-[#595454] text-[6px] ml-5" >
                    {"preventiva - dd/mm/aaaa"}
                  </span>
                </div>
                <div className="flex flex-col items-end self-stretch bg-[#D9D9D970] py-4 mx-[22px] rounded-tl-lg rounded-tr-lg">
                  <div className="flex flex-col items-start bg-[#73E064D4] py-[3px] mr-[19px] rounded-[10px]">
                    <span className="text-[#595454] text-[6px] mx-2" >
                      {"Concluída"}
                    </span>
                  </div>
                </div>
              </div>
              <span className="text-black text-[10px] absolute top-[81px] left-[42px]" >
                {"Máquina X"}
              </span>
              <span className="text-black text-[10px] absolute bottom-[133px] left-[42px]" >
                {"Máquina X"}
              </span>
              <span className="text-black text-[10px] absolute bottom-[3px] left-[42px]" >
                {"Máquina X"}
              </span>
            </div>
          </div>

          {/* Coluna Direita */}
          <div className="flex flex-col w-full lg:w-auto lg:flex-1 lg:max-w-[460px] mt-8 lg:mt-36 px-4 lg:px-0 lg:mr-[21px] gap-[47px]">
            <div className="flex items-center self-stretch gap-3.5">
              <div className="flex flex-col items-start bg-[#F215151F] w-[223px] py-3 gap-2 rounded-lg">
                <span className="text-[#F21515] text-xs ml-[101px]" >
                  {"Alertas"}
                </span>
                <div className="flex flex-col items-center self-stretch">
                  <span className="text-[#F21515] text-[32px]" >
                    {"0"}
                  </span>
                </div>
              </div>
              <div className="flex items-center bg-[#0084FF1F] w-[223px] py-[13px] rounded-lg">
                <button className="flex flex-col items-center bg-[#0083FFDB] text-left w-[72px] py-[13px] ml-4 mr-1.5 rounded-lg border-0"
                  onClick={()=>alert("Pressed!")}> 
                  <img
                    src={"https://storage.googleapis.com/tagjs-prod.appspot.com/v1/v1HAnSFym6/dz3uejux_expires_30_days.png"} 
                    className="w-[29px] h-[25px] object-fill"
                  />
                </button>
                <div className="flex flex-col items-start w-[119px] mr-2.5 gap-[7px]">
                  <span className="text-[#0084FF] text-xs text-center" >
                    {"Total de Máquinas"}
                  </span>
                  <span className="text-[#0084FF] text-[32px] ml-[3px]" >
                    {"0"}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex flex-col items-start self-stretch bg-white pt-[17px] rounded-[10px]">
              <div className="flex flex-col items-start pb-[13px] mb-[13px] ml-4">
                <img
                  src={"https://storage.googleapis.com/tagjs-prod.appspot.com/v1/v1HAnSFym6/vsashy33_expires_30_days.png"} 
                  className="w-[52px] h-11 ml-[3px] object-fill"
                />
                <span className="text-[#373535] text-base mx-[60px]" >
                  {"Previsões"}
                </span>
              </div>
              <div className="flex flex-col items-start self-stretch bg-[#D9D9D970] py-4 mb-2 mx-[25px] gap-[5px] rounded-lg">
                <div className="flex items-center self-stretch mx-[22px]">
                  <span className="flex-1 text-black text-[10px] text-center mr-[265px]" >
                    {"Máquina X"}
                  </span>
                  <div className="flex flex-col bg-[#0084FFD4] w-[53px] py-[3px] rounded-[10px]">
                    <span className="text-[#595454] text-[6px] text-center" >
                      {"Prevista"}
                    </span>
                  </div>
                </div>
                <span className="text-[#595454] text-[6px] ml-[22px]" >
                  {"preventiva - dd/mm/aaaa"}
                </span>
              </div>
              <div className="flex flex-col items-start self-stretch bg-[#D9D9D970] py-4 mb-2 mx-6 gap-1 rounded-lg">
                <div className="flex items-center self-stretch mx-[23px]">
                  <span className="flex-1 text-black text-[10px] text-center mr-[264px]" >
                    {"Máquina X"}
                  </span>
                  <div className="flex flex-col bg-[#D4D116D4] w-[53px] py-[3px] rounded-[10px]">
                    <span className="text-[#595454] text-[6px] text-center" >
                      {"Urgente"}
                    </span>
                  </div>
                </div>
                <span className="text-[#595454] text-[6px] ml-[23px]" >
                  {"preventiva - dd/mm/aaaa"}
                </span>
              </div>
              <div className="flex flex-col items-start self-stretch bg-[#D9D9D970] py-4 mb-2 mx-[22px] gap-1 rounded-lg">
                <div className="flex items-center self-stretch mx-[25px]">
                  <span className="flex-1 text-black text-[10px] text-center mr-[262px]" >
                    {"Máquina X"}
                  </span>
                  <div className="flex flex-col bg-[#0084FFD4] w-[53px] py-[3px] rounded-[10px]">
                    <span className="text-[#595454] text-[6px] text-center" >
                      {"Prevista"}
                    </span>
                  </div>
                </div>
                <span className="text-[#595454] text-[6px] ml-[25px]" >
                  {"preventiva - dd/mm/aaaa"}
                </span>
              </div>
              <div className="flex items-center self-stretch bg-[#D9D9D970] py-4 mx-[22px] rounded-tl-lg rounded-tr-lg">
                <span className="flex-1 text-black text-[10px] text-center ml-[25px] mr-[262px]" >
                  {"Máquina X"}
                </span>
                <div className="flex flex-col bg-[#F21515A8] w-[53px] py-[3px] mr-[19px] rounded-[10px]">
                  <span className="text-[#595454] text-[6px] text-center" >
                    {"Pendente"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
export default Home;
