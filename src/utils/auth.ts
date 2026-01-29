import { apiRequestSSR } from "@/api/sever-request";
import { getCookies } from "@/lib/session"
import { User } from "@/types/types";

export const getUser = async (): Promise<User | null> => {
    try {
        const cookies = await getCookies();
        console.log('[AUTH] Fetching user with cookies:', cookies ? 'Present' : 'Missing');

        const response = await apiRequestSSR(`/api/auth/me`, "GET", cookies);

        if (response?.data) {
            console.log('[AUTH] User fetched successfully:', response.data.username);
            return response.data;
        }

        console.log('[AUTH] No user data in response');
        return null;
    } catch (error) {
        console.error('[AUTH] Failed to fetch user:', error);
        return null;
    }
}