
import { Footer } from '@/components/layout/footer';
import Header from '@/components/layout/header';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    robots: {
        index: true,
        follow: true,
    },
};

export default function LegalLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen flex flex-col bg-[#09090B]">
            <Header />
            <div className="grow pt-24 pb-16">
                {children}
            </div>
            <Footer />
        </div>

    );
}
