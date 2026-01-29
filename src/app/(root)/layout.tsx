export const dynamic = "force-dynamic";
import Navbar from '@/components/Navbar'
import { ChildProp } from '@/types/types'
import { getUser } from '@/utils/auth'
import React from 'react'

const RootLayout = async ({ children }: ChildProp) => {
    const user = await getUser();
    console.log('[LAYOUT] User fetched:', user ? `${user.username} (${user.email})` : 'Not authenticated');

    return (
        <>
            <div>
                <Navbar user={user} />
                {children}
            </div>
        </>
    )
}

export default RootLayout