import React, { useState } from 'react';
import Signin from './Signin';
import Signup from './Signup';
import Verification from './Verification';
import { UserType } from '../../types/authTyps';

const AuthContainer = ({ user }: { user: UserType | null }) => {
    const [mode, setMode] = useState<'signin' | 'signup' | 'verify'>('signin');

    // Example: based on your auth state, you can switch to 'verify'
    const handleVerificationRedirect = () => setMode('verify');

    return (
        <>
            {
                !user ?
                    <>
                        {mode === 'signin' && <Signin onSwitch={() => setMode('signup')} />}
                        {mode === 'signup' && <Signup onSwitch={() => setMode('signin')} />}
                    </>
                    : <Verification />

            }


        </>
    );
};

export default AuthContainer;
