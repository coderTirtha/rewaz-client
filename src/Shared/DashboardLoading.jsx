import React, { useEffect, useState } from 'react';

const DashboardLoading = ({ title = 'Loading dashboard data', subtitle = 'Refreshing your workspace…', lines = 3, variant = 'skeleton' }) => {
    const [progress, setProgress] = useState(1);

    useEffect(() => {
        setProgress(1);

        const timer = window.setInterval(() => {
            setProgress((current) => {
                if (current >= 100) {
                    return 100;
                }

                const next = current + (current < 50 ? 5 : current < 80 ? 3 : 1);
                return next >= 100 ? 100 : next;
            });
        }, 70);

        return () => window.clearInterval(timer);
    }, []);

    return (
        <div className='mx-auto flex min-h-[55vh] w-full max-w-7xl items-center justify-center px-4 py-10'>
            <div className='brand-surface w-full overflow-hidden p-6 md:p-8'>
                <div className='mb-6 rounded-[2rem] border border-[#E97451]/15 bg-gradient-to-r from-[#fff4ef] via-white to-[#fff9f6] p-5 shadow-[0_12px_40px_rgba(15,23,42,0.08)]'>
                    <div className='flex flex-col gap-4 md:flex-row md:items-center md:justify-between'>
                        <div>
                            <p className='text-xs font-semibold uppercase tracking-[0.35em] text-[#D26B2E]'>Page loading</p>
                            <h2 className='mt-2 text-2xl font-bold text-stone-900'>{title}</h2>
                            <p className='mt-1 text-sm text-stone-500'>{subtitle}</p>
                        </div>
                        <div className='flex items-center gap-4'>
                            <div className='relative flex h-20 w-20 items-center justify-center rounded-full border border-[#E97451]/20 bg-white shadow-sm'>
                                <div className='absolute inset-2 rounded-full border border-dashed border-[#E97451]/25 rewaz-float' />
                                <div className='text-center'>
                                    <div className='text-2xl font-black text-[#D26B2E]'>{progress}%</div>
                                    <div className='text-[11px] font-semibold uppercase tracking-[0.25em] text-stone-400'>Ready</div>
                                </div>
                            </div>
                            <div className='hidden min-w-44 md:block'>
                                <div className='h-1.5 w-full overflow-hidden rounded-full bg-stone-200'>
                                    <div
                                        className='h-full rounded-full bg-gradient-to-r from-[#E97451] to-[#D26B2E] transition-[width] duration-75 ease-out'
                                        style={{ width: `${progress}%` }}
                                    />
                                </div>
                                <p className='mt-2 text-xs text-stone-500'>Loading your experience, one step at a time.</p>
                            </div>
                        </div>
                    </div>
                </div>

                {variant === 'progress' ? (
                    <div className='mt-2 rounded-[2rem] border border-stone-200 bg-white p-6 shadow-[0_12px_40px_rgba(15,23,42,0.08)]'>
                        <div className='flex flex-col items-center gap-5 text-center'>
                            <div className='relative flex h-28 w-28 items-center justify-center rounded-full border border-[#E97451]/20 bg-gradient-to-br from-[#fff7f3] to-white shadow-sm'>
                                <div className='absolute inset-3 rounded-full border border-dashed border-[#E97451]/20 rewaz-float' />
                                <div className='text-center'>
                                    <div className='text-4xl font-black text-[#D26B2E]'>{progress}%</div>
                                    <div className='text-[11px] font-semibold uppercase tracking-[0.25em] text-stone-400'>Loading</div>
                                </div>
                            </div>

                            <div className='w-full max-w-xl space-y-3'>
                                <div className='h-1.5 w-full overflow-hidden rounded-full bg-stone-200'>
                                    <div
                                        className='h-full rounded-full bg-gradient-to-r from-[#E97451] via-[#F4A261] to-[#D26B2E] transition-[width] duration-75 ease-out'
                                        style={{ width: `${progress}%` }}
                                    />
                                </div>
                                <p className='text-sm text-stone-500'>
                                    {progress < 100 ? `Please wait, ${progress}% loaded` : 'Almost there, finalizing 100%'}
                                </p>
                            </div>

                            <div className='flex items-center gap-2 pt-2'>
                                {[0, 1, 2].map((index) => (
                                    <span
                                        key={index}
                                        className='h-3 w-3 rounded-full bg-[#E97451] rewaz-float'
                                        style={{ animationDelay: `${index * 160}ms` }}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className='grid gap-6 lg:grid-cols-[1.2fr_0.8fr]'>
                        <div className='space-y-5'>
                            <div className='inline-flex items-center gap-3 rounded-full border border-[#E97451]/15 bg-[#fff4ef] px-4 py-2 text-sm font-semibold text-[#D26B2E] rewaz-dots'>
                                <span className='h-2.5 w-2.5 rounded-full bg-[#E97451] rewaz-float' />
                                {progress < 100 ? `Loading ${progress}%` : 'Finalizing 100%'}
                            </div>
                            <div className='space-y-3'>
                                <div className='rewaz-skeleton h-8 w-3/4 rounded-2xl' />
                                <div className='rewaz-skeleton h-5 w-1/2 rounded-full' />
                            </div>

                            <div className='grid gap-3 sm:grid-cols-3'>
                                {[0, 1, 2].map((index) => (
                                    <div key={index} className='rounded-3xl border border-stone-200 bg-white p-4 shadow-sm'>
                                        <div className='rewaz-skeleton h-3 w-24 rounded-full' />
                                        <div className='mt-3 rewaz-skeleton h-10 w-20 rounded-2xl' />
                                        <div className='mt-4 rewaz-skeleton h-3 w-3/4 rounded-full' />
                                    </div>
                                ))}
                            </div>

                            <div className='space-y-3 rounded-3xl border border-stone-200 bg-white p-5 shadow-sm'>
                                <div className='rewaz-skeleton h-4 w-44 rounded-full' />
                                {Array.from({ length: lines }).map((_, index) => (
                                    <div key={index} className='space-y-2'>
                                        <div className='rewaz-skeleton h-4 w-full rounded-full' />
                                        <div className='rewaz-skeleton h-4 w-5/6 rounded-full' />
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className='space-y-4'>
                            <div className='rounded-[2rem] border border-stone-200 bg-gradient-to-br from-[#fff7f3] to-white p-5 shadow-[0_12px_40px_rgba(15,23,42,0.08)]'>
                                <div className='rewaz-skeleton h-4 w-36 rounded-full' />
                                <div className='mt-4 grid gap-3'>
                                    <div className='rewaz-skeleton h-36 rounded-[1.5rem]' />
                                    <div className='rewaz-skeleton h-12 rounded-2xl' />
                                    <div className='rewaz-skeleton h-12 rounded-2xl' />
                                </div>
                            </div>

                            <div className='rounded-[2rem] border border-stone-200 bg-white p-5 shadow-[0_12px_40px_rgba(15,23,42,0.08)]'>
                                <div className='rewaz-skeleton h-4 w-28 rounded-full' />
                                <div className='mt-4 space-y-3'>
                                    {Array.from({ length: 4 }).map((_, index) => (
                                        <div key={index} className='flex items-center gap-3'>
                                            <div className='rewaz-skeleton h-12 w-12 rounded-2xl' />
                                            <div className='flex-1 space-y-2'>
                                                <div className='rewaz-skeleton h-4 w-3/4 rounded-full' />
                                                <div className='rewaz-skeleton h-3 w-1/2 rounded-full' />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                <div className='mt-6 border-t border-stone-200 pt-4 text-center text-sm text-stone-500'>
                    {progress}% loaded
                </div>
            </div>
        </div>
    );
};

export default DashboardLoading;