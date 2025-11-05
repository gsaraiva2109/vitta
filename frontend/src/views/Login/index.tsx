import React, { useState } from 'react';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { login as loginService } from '../../services/authService';
import type { LoginRequest } from '../../models/User';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [matricula, setMatricula] = useState('');
    const [senha, setSenha] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    const onSubmit = async (e?: React.FormEvent) => {
        e?.preventDefault();
        setError(null);
        setLoading(true);
        try {
            const payload: LoginRequest = { matricula, senha };
            await loginService(payload);
            navigate('/');
        } catch (err: any) {
            setError(err.message || 'Erro no login');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#D4EAD7]">
            <Card className="w-[560px] h-[400px] rounded-lg shadow-md">
                <div className="flex flex-col items-center gap-4 py-10">
                    <div className="flex items-center gap-4">
                        <svg width="64" height="64" viewBox="0 0 37 37" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M18.5 0.5C28.4417 0.5 36.5 8.55495 36.5 18.5C36.5 28.445 28.4417 36.5 18.5 36.5C8.5583 36.5 0.5 28.445 0.5 18.5C0.5 8.55495 8.5583 0.5 18.5 0.5ZM18.5 9.90625C17.5835 9.90625 16.8438 10.6514 16.8438 11.5625V16.8438H11.5625C10.646 16.8438 9.90625 17.5889 9.90625 18.5C9.90625 19.4111 10.646 20.1562 11.5625 20.1562H16.8438V25.4375C16.8438 26.3486 17.5835 27.0938 18.5 27.0938C19.4165 27.0938 20.1562 26.3486 20.1562 25.4375V20.1562H25.4375C26.354 20.1562 27.0938 19.4111 27.0938 18.5C27.0938 17.5889 26.354 16.8438 25.4375 16.8438H20.1562V11.5625C20.1562 10.6514 19.4165 9.90625 18.5 9.90625Z" fill="#6CCF78" stroke="#67B476"/>
                        </svg>
                        <div className="text-center">
                            <div className="text-2xl font-extrabold text-[#2E8A4A]">VITTA</div>
                            <div className="text-sm text-[#9FBFA8]">Gerenciamento hospitalar</div>
                        </div>
                    </div>

                                <form className="w-full px-10" onSubmit={onSubmit}>
                                    <label className="block text-base font-bold text-[#6B6B6B] mb-2">Matrícula</label>
                                    <div className="mb-4">
                                          <div className="flex items-center bg-white shadow rounded-lg overflow-hidden input-focus-group">
                                            <div className="w-12 h-12 flex items-center justify-center bg-[#F3FBF4]">
                                                <i className="pi pi-user text-[#9DBE9F] text-xl" />
                                            </div>
                                            <InputText
                                                value={matricula}
                                                onChange={(e) => setMatricula(e.currentTarget.value)}
                                                placeholder="Sua matrícula"
                                                className="flex-1 px-4 py-3 bg-transparent border-none"
                                            />
                                        </div>
                                    </div>

                                    <label className="block text-base font-bold text-[#6B6B6B] mb-2">Senha</label>
                                    <div className="mb-6">
                                          <div className="flex items-center bg-white shadow rounded-lg overflow-hidden input-focus-group">
                                            <div className="w-12 h-12 flex items-center justify-center bg-[#F3FBF4]">
                                                <i className="pi pi-lock text-[#9DBE9F] text-xl" />
                                            </div>
                                            <div className="flex-1">
                                                <Password
                                                    value={senha}
                                                    onChange={(e: any) => setSenha(e.target.value)}
                                                    toggleMask
                                                    placeholder="Sua senha"
                                                    feedback={false}
                                                    inputClassName="px-4 py-3 w-[27rem] bg-transparent border-none"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {error && <div className="text-sm text-red-600 mb-4">{error}</div>}

                                    <div className="flex justify-center">
                                        <Button
                                            type="submit"
                                            label="Entrar no Sistema"
                                            icon="pi pi-shield"
                                            iconPos="left"
                                            loading={loading}
                                            className="w-full md:w-80 h-12 rounded-lg text-white shadow-md"
                                            style={{ backgroundImage: 'linear-gradient(90deg,#5ED08A 0%,#4DA0F7 100%)', border: 'none' }}
                                        />
                                    </div>
                                </form>
                </div>
            </Card>
        </div>
    );
};

export default Login;