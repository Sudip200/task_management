
import { useNavigate } from 'react-router';
import toast from 'react-hot-toast';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import useRegister from '../hooks/useRegister';

type RegisterForm = {
    email: string;
    password: string;
};

const initialForm: RegisterForm = {
    email: '',
    password: '',
};

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const getErrorMessage = (error: unknown) => {
    if (error instanceof Error) {
        return error.message;
    }

    if (typeof error === 'object' && error !== null && 'response' in error) {
        const response = error as { response?: { data?: { message?: string } } };
        return response.response?.data?.message ?? 'Registration failed. Please try again.';
    }

    return 'Registration failed. Please try again.';
};

export default function RegisterPage() {
    const navigate = useNavigate();
    const registerMutation = useRegister();
    const [submitError, setSubmitError] = useState('');
    const {
        register: registerField,
        handleSubmit,
        reset,
        formState: { errors, isValid },
    } = useForm<RegisterForm>({
        defaultValues: initialForm,
        mode: 'onTouched',
    });

    const onSubmit = async (form: RegisterForm) => {
        try {
            await registerMutation.mutateAsync(form);
            toast.success('Registration successful. Please sign in.');
            reset(initialForm);
            navigate('/login', { replace: true });
        } catch (error) {
            setSubmitError(getErrorMessage(error));
        }
    };

    return (
        <main className="min-h-screen bg-slate-950 px-4 py-10 text-slate-100 sm:px-6 lg:px-8">
            <div className="mx-auto grid w-full max-w-5xl overflow-hidden rounded-3xl border border-white/10 bg-white/5 shadow-2xl shadow-black/25 backdrop-blur-xl lg:grid-cols-2">
                <section className="flex flex-col justify-between gap-8 bg-slate-900/70 p-8 sm:p-10">
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-cyan-300/80">
                            Register
                        </p>
                        <h1 className="mt-4 text-4xl font-semibold tracking-tight text-white sm:text-5xl">
                            Create your workspace account.
                        </h1>
                        <p className="mt-4 max-w-md text-sm leading-6 text-slate-300 sm:text-base">
                            Add your email and password to get access to the task dashboard and task
                            management tools.
                        </p>
                    </div>

                   
                </section>

                <section className="bg-slate-950/80 p-6 sm:p-8">
                    <div className="mb-6 flex items-center justify-between gap-4">
                        <div>
                            <p className="text-xs uppercase tracking-[0.3em] text-cyan-300/80">Sign up</p>
                            <h2 className="mt-2 text-2xl font-semibold text-white">Create account</h2>
                        </div>
                        <button
                            type="button"
                            onClick={() => navigate('/login')}
                            className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-slate-200 transition hover:bg-white/10"
                        >
                            Login
                        </button>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <label className="block">
                            <span className="mb-2 block text-sm font-medium text-slate-200">Email</span>
                            <input
                                type="email"
                                {...registerField('email', {
                                    required: 'Email is required.',
                                    pattern: {
                                        value: emailPattern,
                                        message: 'Enter a valid email address.',
                                    },
                                })}
                                className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-400/70 focus:ring-2 focus:ring-cyan-400/20"
                                placeholder="you@example.com"
                            />
                            {errors.email ? <p className="mt-2 text-sm text-rose-300">{errors.email.message}</p> : null}
                        </label>

                        <label className="block">
                            <span className="mb-2 block text-sm font-medium text-slate-200">Password</span>
                            <input
                                type="password"
                                {...registerField('password', {
                                    required: 'Password is required.',
                                    minLength: {
                                        value: 6,
                                        message: 'Password must be at least 6 characters.',
                                    },
                                })}
                                className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-400/70 focus:ring-2 focus:ring-cyan-400/20"
                                placeholder="••••••••"
                            />
                            {errors.password ? (
                                <p className="mt-2 text-sm text-rose-300">{errors.password.message}</p>
                            ) : null}
                        </label>

                        {submitError ? (
                            <div className="rounded-2xl border border-rose-400/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
                                {submitError}
                            </div>
                        ) : null}

                        <button
                            type="submit"
                            disabled={registerMutation.isPending || !isValid}
                            className="flex w-full items-center justify-center rounded-2xl bg-linear-to-r from-cyan-400 to-blue-500 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {registerMutation.isPending ? 'Creating account...' : 'Create account'}
                        </button>
                    </form>
                </section>
            </div>
        </main>
    );
}