import ApplicationLogo from '@/Components/ApplicationLogo';
import { Link } from '@inertiajs/react';
import { PropsWithChildren } from 'react';

export default function Guest({ children }: PropsWithChildren) {
    return (
        <div className="flex min-h-screen flex-col items-center bg-mjt-slateDark pt-6 sm:justify-center sm:pt-0">
            <div>
                <Link href="/">
                    <ApplicationLogo className="w-auto h-12" />
                </Link>
            </div>

            <div className="mt-8 w-full overflow-hidden bg-mjt-slate/50 px-8 py-10 shadow-2xl backdrop-blur-md border border-mjt-slate sm:max-w-md sm:rounded-2xl">
                {children}
            </div>
        </div>
    );
}
