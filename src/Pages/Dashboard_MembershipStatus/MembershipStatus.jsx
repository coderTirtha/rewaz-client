import React from 'react';
import { useQuery } from '@tanstack/react-query';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import useAuth from '../../hooks/useAuth';
import { Link } from 'react-router-dom';
import { FiClock, FiCreditCard, FiMapPin, FiPhone, FiUser } from 'react-icons/fi';
import { MdVerifiedUser } from 'react-icons/md';
import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';

const MembershipStatus = () => {
    const axiosSecure = useAxiosSecure();
    const { user } = useAuth();

    const { data: membership, isLoading } = useQuery({
        queryKey: ['my-membership', user?.email],
        enabled: !!user?.email,
        queryFn: async () => {
            const result = await axiosSecure.get('/members/me', { withCredentials: true });
            return result?.data;
        }
    });

    const membershipStatus = membership?.membershipStatus || 'not applied';
    const statusClass = membershipStatus === 'approved'
        ? 'bg-emerald-100 text-emerald-900'
        : membershipStatus === 'pending'
            ? 'bg-amber-100 text-amber-900'
            : 'bg-stone-100 text-stone-700';

    return (
        <div className='mx-auto my-12 max-w-5xl space-y-6 px-4'>
            <title>Membership Status | Dashboard - Rewaz</title>
            <div className='rounded-3xl border border-stone-200 bg-gradient-to-r from-stone-900 via-stone-900 to-[#E97451] p-6 text-white shadow-[0_24px_80px_rgba(15,23,42,0.18)]'>
                <p className='text-xs uppercase tracking-[0.45em] text-amber-200'>Dashboard</p>
                <div className='mt-3 flex flex-col gap-3 md:flex-row md:items-end md:justify-between'>
                    <div>
                        <h1 className='text-3xl font-bold'>Membership status</h1>
                        <p className='mt-2 max-w-2xl text-sm text-white/75'>Check your membership request, approval state, and the details you submitted.</p>
                    </div>
                    <Link to='/membership' className='btn border-0 bg-white text-stone-900 hover:bg-stone-100'>Apply or update</Link>
                </div>
            </div>

            <div className='grid gap-4 md:grid-cols-3'>
                <div className='rounded-3xl border border-stone-200 bg-white p-6 shadow-[0_12px_40px_rgba(15,23,42,0.08)]'>
                    <p className='text-sm text-stone-500'>Current status</p>
                    <div className='mt-3 flex items-center justify-between gap-3'>
                        <h2 className='text-3xl font-bold capitalize text-stone-900'>{isLoading ? 'Loading…' : membershipStatus}</h2>
                        <span className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${statusClass}`}>{membershipStatus}</span>
                    </div>
                    <p className='mt-3 text-sm text-stone-500'>Your membership request is tracked here.</p>
                </div>

                <div className='rounded-3xl border border-stone-200 bg-white p-6 shadow-[0_12px_40px_rgba(15,23,42,0.08)]'>
                    <p className='text-sm text-stone-500'>Member name</p>
                    <div className='mt-3 flex items-center gap-3 text-stone-900'><FiUser className='text-[#D26B2E]' /> <span className='text-lg font-semibold'>{membership?.name || user?.displayName || 'N/A'}</span></div>
                    <p className='mt-3 text-sm text-stone-500'>{membership?.email || user?.email}</p>
                </div>

                <div className='rounded-3xl border border-stone-200 bg-white p-6 shadow-[0_12px_40px_rgba(15,23,42,0.08)]'>
                    <p className='text-sm text-stone-500'>Submitted</p>
                    <div className='mt-3 flex items-center gap-3 text-stone-900'><FiClock className='text-[#D26B2E]' /> <span className='text-lg font-semibold'>{membership?.createdAt ? new Date(membership.createdAt).toLocaleDateString() : 'N/A'}</span></div>
                    <p className='mt-3 text-sm text-stone-500'>Last updated when your request changes.</p>
                </div>
            </div>

            <div className='grid gap-6 lg:grid-cols-[1.1fr_0.9fr]'>
                <div className='rounded-3xl border border-stone-200 bg-white p-6 shadow-[0_12px_40px_rgba(15,23,42,0.08)]'>
                    <h3 className='text-lg font-semibold text-stone-900'>Membership details</h3>
                    <div className='mt-5 grid gap-4 sm:grid-cols-2'>
                        <Detail label='Phone' value={membership?.phone} icon={<FiPhone />} />
                        <Detail label='Nationality' value={membership?.nationality} icon={<FiMapPin />} />
                        <Detail label='Occupation' value={membership?.occupation} icon={<FiUser />} />
                        <Detail label='ID method' value={membership?.identificationMethod} icon={<FiCreditCard />} />
                        <Detail label='ID number' value={membership?.identificationNumber} icon={<MdVerifiedUser />} />
                        <Detail label='Date of birth' value={membership?.dateOfBirth} icon={<FiClock />} />
                    </div>
                </div>

                <div className='rounded-3xl border border-stone-200 bg-gradient-to-br from-white to-[#fff4ef] p-6 shadow-[0_12px_40px_rgba(15,23,42,0.08)]'>
                    <h3 className='text-lg font-semibold text-stone-900'>Next step</h3>
                    <p className='mt-2 text-sm text-stone-600'>If your status is pending, wait for approval. If you have not applied yet, submit your membership form.</p>
                    <div className='mt-4 flex flex-col gap-3'>
                        <Link to='/membership' className='btn border-0 bg-[#E97451] text-white hover:bg-[#d8653f]'>Open membership form</Link>
                        <Link to='/dashboard/overview' className='btn btn-outline border-stone-200 text-stone-700 hover:bg-stone-50'>Back to overview</Link>
                    </div>
                    <div className='mt-6'>
                        <h4 className='text-sm font-semibold text-stone-700'>Payment history</h4>
                        <div className='mt-3 space-y-2'>
                            {(membership?.paymentHistory || []).map((p, idx) => (
                                <div key={idx} className='flex items-center justify-between gap-3 rounded-2xl border border-stone-200 bg-white px-3 py-2 text-sm'>
                                    <div>
                                        <div className='font-semibold'>{p?.type === 'initial' ? 'Initial payment' : 'Renewal'}</div>
                                        <div className='text-xs text-stone-500'>{p?.paymentMethod} • {p?.transactionId}</div>
                                    </div>
                                    <div className='text-right'>
                                        <div className='font-semibold'>{p?.amount} BDT</div>
                                        <div className='text-xs text-stone-500'>{p?.paymentDate ? new Date(p.paymentDate).toLocaleDateString() : '—'}</div>
                                    </div>
                                </div>
                            ))}
                            {(!membership?.paymentHistory || membership.paymentHistory.length === 0) && <div className='text-sm text-stone-500'>No payments recorded yet.</div>}
                        </div>

                        <RenewalForm membership={membership} />
                    </div>
                </div>
            </div>
        </div>
    );
};

const RenewalForm = ({ membership }) => {
    const axiosSecure = useAxiosSecure();
    const queryClient = useQueryClient();
    const [submitting, setSubmitting] = useState(false);

    const mutation = useMutation({
        mutationFn: async (payload) => {
            const res = await axiosSecure.patch('/members/me/renewal', payload, { withCredentials: true });
            return res?.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['my-membership']);
            setSubmitting(false);
        },
        onError: () => setSubmitting(false)
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = new FormData(e.target);
        const payload = {
            paymentMethod: data.get('paymentMethod'),
            transactionId: data.get('transactionId'),
            paymentAmount: Number(data.get('paymentAmount')),
            paymentDate: data.get('paymentDate'),
            paymentNote: data.get('paymentNote'),
        };
        setSubmitting(true);
        mutation.mutate(payload);
    };

    return (
        <form onSubmit={handleSubmit} className='mt-4 space-y-3'>
            <h4 className='text-sm font-semibold text-stone-700'>Pay renewal (100 BDT)</h4>
            <div className='grid gap-2'>
                <select name='paymentMethod' required className='select soft-select'>
                    <option value='bKash'>bKash</option>
                    <option value='Nagad'>Nagad</option>
                    <option value='Rocket'>Rocket</option>
                    <option value='Bank transfer'>Bank transfer</option>
                </select>
                <input name='transactionId' required placeholder='Transaction ID' className='input soft-input' />
                <input name='paymentAmount' type='number' defaultValue={100} min={100} required className='input soft-input' />
                <input name='paymentDate' type='date' required className='input soft-input' />
                <textarea name='paymentNote' placeholder='Payment note (optional)' className='textarea soft-input' />
                <div>
                    <button type='submit' disabled={submitting} className='btn w-full border-0 bg-[#E97451] text-white'>Submit renewal</button>
                </div>
            </div>
        </form>
    );
};

const Detail = ({ label, value, icon }) => (
    <div className='rounded-2xl border border-stone-200 bg-stone-50 p-4'>
        <p className='text-xs uppercase tracking-[0.2em] text-stone-400'>{label}</p>
        <div className='mt-2 flex items-center gap-3 text-stone-900'>
            <span className='text-[#D26B2E]'>{icon}</span>
            <span className='font-semibold'>{value || 'N/A'}</span>
        </div>
    </div>
);

export default MembershipStatus;