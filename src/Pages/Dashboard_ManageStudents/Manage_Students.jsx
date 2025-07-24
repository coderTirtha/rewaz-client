import React, { useState } from 'react';
import { FiPlus } from 'react-icons/fi';
import { IoIosSearch } from 'react-icons/io';

const Manage_Students = () => {
    const [search, setSearch] = useState('');
    const handleAddStudent = () => {

    }
    return (
        <div className='w-full px-4'>
            <div className='my-8 w-full'>
                <h1 className='text-4xl font-bold text-center'>All Students</h1>
                <div className='my-4 flex justify-between items-center'>
                    <form className=''>
                        <div className='flex justify-center items-center gap-2 max-w-md'>
                            <label className="input max-w-xs input-sm">
                                <span className="label"><IoIosSearch /></span>
                                <input
                                    type="text"
                                    placeholder="Search by name, email or phone"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className=""
                                />
                            </label>
                            <button type="submit" className="btn btn-outline btn-sm">Search</button>
                        </div>
                    </form>
                    <button onClick={handleAddStudent} className='btn btn-outline btn-xs'><FiPlus /> Add Student</button>
                </div>
            </div>
        </div>
    );
};

export default Manage_Students;