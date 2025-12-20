'use client';

export default function ProjectLoading() {
    return (
        <div className="pt-5 pb-14">
            <div className="container">
                <div className="h-12 w-32 bg-background-light rounded animate-pulse mb-16"></div>

                <div className="min-h-[calc(100svh-100px)]">
                    <div className="max-w-[635px] space-y-7 pb-20 mx-auto">
                        <div className="space-y-3">
                            <div className="h-12 bg-background-light rounded animate-pulse w-3/4"></div>
                        </div>

                        <div className="space-y-3">
                            <div className="h-6 w-24 bg-background-light rounded animate-pulse"></div>
                            <div className="h-8 w-32 bg-background-light rounded animate-pulse"></div>
                        </div>

                        <div className="space-y-3">
                            <div className="h-6 w-36 bg-background-light rounded animate-pulse"></div>
                            <div className="h-8 w-48 bg-background-light rounded animate-pulse"></div>
                        </div>

                        <div className="space-y-3">
                            <div className="h-6 w-28 bg-background-light rounded animate-pulse"></div>
                            <div className="h-10 w-64 bg-background-light rounded animate-pulse"></div>
                        </div>

                        <div className="space-y-3">
                            <div className="h-6 w-32 bg-background-light rounded animate-pulse"></div>
                            <div className="h-6 w-full bg-background-light rounded animate-pulse"></div>
                            <div className="h-6 w-5/6 bg-background-light rounded animate-pulse"></div>
                            <div className="h-6 w-4/5 bg-background-light rounded animate-pulse"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
