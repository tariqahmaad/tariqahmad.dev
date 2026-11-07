import type { Metadata } from 'next';

import HudErrorScreen from '@/components/error/HudErrorScreen';
import HudButton from '@/components/shared/hud/HudButton';

// Without this the 404 inherited the layout's title and canonical URL, so it
// was indexable and looked like a duplicate of the homepage.
export const metadata: Metadata = {
    title: '404 — Page not found',
    robots: { index: false, follow: false },
};

export default function NotFound() {
    return (
        <HudErrorScreen
            command="cd /the-page-you-wanted"
            output="bash: cd: no such file or directory"
            title="PAGE NOT FOUND"
            description="The URL does not exist or has moved. The sections below are the fastest way back into the site."
            actions={
                <>
                    <HudButton href="/" variant="solid" size="md">
                        Back to home
                    </HudButton>
                    <HudButton
                        href="/#selected-projects"
                        variant="outline"
                        size="md"
                    >
                        Projects
                    </HudButton>
                    <HudButton href="/product" variant="outline" size="md">
                        CV Builder
                    </HudButton>
                </>
            }
        />
    );
}
