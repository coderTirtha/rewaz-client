import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import { FiClock, FiCreditCard, FiMapPin, FiPhone, FiUser } from 'react-icons/fi';
import { MdVerifiedUser } from 'react-icons/md';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';

const MemberDetails = () => {
    const { membershipId } = useParams();
    const axiosSecure = useAxiosSecure();

    const { data: member, isLoading, isError } = useQuery({
        queryKey: ['member-details', membershipId],
        enabled: !!membershipId,
        queryFn: async () => {
            const result = await axiosSecure.get(`/member/${membershipId}`, { withCredentials: true });
            return result?.data;
        }
    });

    const status = member?.membershipStatus || 'unknown';
    const statusClass = status === 'approved'
        ? 'bg-emerald-100 text-emerald-900'
        : status === 'pending'
            ? 'bg-amber-100 text-amber-900'
            : 'bg-stone-100 text-stone-700';

    return (
        <div className='page-surface min-h-screen px-4 py-10'>
            <title>Member Details | Dashboard - Rewaz</title>
            <div className='mx-auto max-w-5xl space-y-6'>
                <div className='rounded-3xl border border-stone-200 bg-gradient-to-r from-stone-900 via-stone-900 to-[#E97451] p-6 text-white shadow-[0_24px_80px_rgba(15,23,42,0.18)]'>
                    <p className='text-xs uppercase tracking-[0.45em] text-amber-200'>Administration</p>
                    <div className='mt-3 flex flex-col gap-3 md:flex-row md:items-end md:justify-between'>
                        <div>
                            <h1 className='text-3xl font-bold'>Member details</h1>
                            <p className='mt-2 max-w-2xl text-sm text-white/75'>Review the submitted membership information and payment verification fields.</p>
                        </div>
                        <Link to='/dashboard/manage-members' className='btn border-0 bg-white text-stone-900 hover:bg-stone-100'>Back to members</Link>
                    </div>
                </div>

                {isLoading ? (
                    <div className='rounded-3xl border border-stone-200 bg-white p-8 text-center shadow-[0_12px_40px_rgba(15,23,42,0.08)]'>Loading member details...</div>
                ) : isError ? (
                    <div className='rounded-3xl border border-rose-200 bg-rose-50 p-8 text-center text-rose-700 shadow-[0_12px_40px_rgba(15,23,42,0.08)]'>Failed to load member details.</div>
                ) : (
                    <>
                        <div className='grid gap-4 md:grid-cols-3'>
                            <div className='rounded-3xl border border-stone-200 bg-white p-5 shadow-[0_12px_40px_rgba(15,23,42,0.08)]'>
                                <p className='text-sm text-stone-500'>Current status</p>
                                <div className='mt-3 flex items-center justify-between gap-3'>
                                    <h2 className='text-2xl font-bold capitalize text-stone-900'>{status}</h2>
                                    <span className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${statusClass}`}>{status}</span>
                                </div>
                            </div>
                            <Stat label='Submitted by' value={member?.name || 'N/A'} />
                            <Stat label='Member ID' value={member?._id || 'N/A'} />
                        </div>

                        <div className='grid gap-6 lg:grid-cols-[1.1fr_0.9fr]'>
                            <div className='rounded-3xl border border-stone-200 bg-white p-6 shadow-[0_12px_40px_rgba(15,23,42,0.08)]'>
                                <h3 className='text-lg font-semibold text-stone-900'>Personal details</h3>
                                <div className='mt-5 grid gap-4 sm:grid-cols-2'>
                                    <Detail label='Email' value={member?.email} icon={<FiUser />} />
                                    <Detail label='Phone' value={member?.phone} icon={<FiPhone />} />
                                    <Detail label='Occupation' value={member?.occupation} icon={<FiUser />} />
                                    <Detail label='Nationality' value={member?.nationality} icon={<FiMapPin />} />
                                    <Detail label='ID method' value={member?.identificationMethod} icon={<FiCreditCard />} />
                                    <Detail label='ID number' value={member?.identificationNumber} icon={<MdVerifiedUser />} />
                                    <Detail label='Date of birth' value={member?.dateOfBirth} icon={<FiClock />} />
                                    <Detail label='Applied at' value={member?.createdAt ? new Date(member.createdAt).toLocaleString() : 'N/A'} icon={<FiClock />} />
                                </div>
                            </div>

                            <div className='rounded-3xl border border-stone-200 bg-gradient-to-br from-white to-[#fff4ef] p-6 shadow-[0_12px_40px_rgba(15,23,42,0.08)]'>
                                <h3 className='text-lg font-semibold text-stone-900'>Payment verification</h3>
                                <div className='mt-5 space-y-3 text-sm text-stone-700'>
                                    <Row label='Payment method' value={member?.paymentMethod} />
                                    <Row label='Transaction ID' value={member?.transactionId} />
                                    <Row label='Payment amount' value={member?.paymentAmount ? `${member.paymentAmount} BDT` : 'N/A'} />
                                    <Row label='Payment date' value={member?.paymentDate} />
                                    <Row label='Note' value={member?.paymentNote} />
                                </div>
                                <div className='mt-6'>
                                    <h4 className='text-sm font-semibold text-stone-700'>Payment history</h4>
                                    <div className='mt-3 space-y-2'>
                                        {(member?.paymentHistory || []).map((p) => (
                                            <div key={p._id} className='flex items-center justify-between gap-3 rounded-2xl border border-stone-200 bg-white px-3 py-2 text-sm'>
                                                <div>
                                                    <div className='font-semibold'>{p.type === 'initial' ? 'Initial payment' : 'Renewal'}</div>
                                                    <div className='text-xs text-stone-500'>{p.paymentMethod} • {p.transactionId}</div>
                                                </div>
                                                <div className='text-right'>
                                                    <div className='font-semibold'>{p.amount} BDT</div>
                                                    <div className='text-xs text-stone-500'>{p.paymentDate ? new Date(p.paymentDate).toLocaleDateString() : '—'}</div>
                                                </div>
                                            </div>
                                        ))}
                                        {(!member?.paymentHistory || member.paymentHistory.length === 0) && <div className='text-sm text-stone-500'>No payments recorded yet.</div>}
                                    </div>
                                </div>
                                <RenewalApproval member={member} membershipId={membershipId} />
                                <div className='mt-6 overflow-hidden rounded-2xl border border-stone-200 bg-white'>
                                    {member?.photo ? <img src={member.photo} alt={member?.name || 'Member'} className='h-64 w-full object-cover' /> : <div className='flex h-64 items-center justify-center text-stone-400'>No photo uploaded</div>}
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

const Stat = ({ label, value }) => (
    <div className='rounded-3xl border border-stone-200 bg-white p-5 shadow-[0_12px_40px_rgba(15,23,42,0.08)]'>
        <p className='text-sm text-stone-500'>{label}</p>
        <h2 className='mt-2 text-2xl font-bold text-stone-900'>{value}</h2>
    </div>
);

const Detail = ({ label, value, icon }) => (
    <div className='rounded-2xl border border-stone-200 bg-stone-50 p-4'>
        <p className='text-xs uppercase tracking-[0.2em] text-stone-400'>{label}</p>
        <div className='mt-2 flex items-center gap-3 text-stone-900'>
            <span className='text-[#D26B2E]'>{icon}</span>
            <span className='font-semibold'>{value || 'N/A'}</span>
        </div>
    </div>
);

const Row = ({ label, value }) => (
    <div className='flex items-center justify-between gap-4 rounded-2xl border border-stone-200 bg-white px-4 py-3'>
        <span className='text-stone-500'>{label}</span>
        <span className='font-semibold text-stone-900'>{value || 'N/A'}</span>
    </div>
);

const RenewalApproval = ({ member, membershipId }) => {
    const axiosSecure = useAxiosSecure();
    const queryClient = useQueryClient();
    const [loadingId, setLoadingId] = useState(null);

    const mutation = useMutation({
        mutationFn: async (renewalId) => {
            return await axiosSecure.patch(`/member/${membershipId}/renewals/${renewalId}/verify`, {}, { withCredentials: true });
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['member-details', membershipId]);
            setLoadingId(null);
        },
        onError: () => setLoadingId(null)
    });

    const pending = (member?.paymentHistory || []).filter(p => p.type === 'renewal' && !p.verified);
    if (!pending.length) return null;

    return (
        <div className='mt-6'>
            <h4 className='text-sm font-semibold text-stone-700'>Pending renewals</h4>
            <div className='mt-3 space-y-2'>
                {pending.map(p => (
                    <div key={p._id} className='flex items-center justify-between gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-3 py-2 text-sm'>
                        <div>
                            <div className='font-semibold'>Renewal • {p.paymentMethod}</div>
                            <div className='text-xs text-stone-500'>{p.transactionId}</div>
                        </div>
                        <div className='flex items-center gap-2'>
                            <div className='text-right mr-2'>
                                <div className='font-semibold'>{p.amount} BDT</div>
                                <div className='text-xs text-stone-500'>{p.paymentDate ? new Date(p.paymentDate).toLocaleDateString() : '—'}</div>
                            </div>
                            <button
                                className='btn btn-sm bg-emerald-600 text-white'
                                onClick={() => { setLoadingId(p._id); mutation.mutate(p._id); }}
                                disabled={loadingId === p._id}
                            >{loadingId === p._id ? 'Approving…' : 'Approve'}</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MemberDetails;