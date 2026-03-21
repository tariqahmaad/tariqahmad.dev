import Button from '@/components/shared/Button';

export default function NotFound() {
    return (
        <div className="flex items-center justify-center min-h-screen bg-background text-foreground">
            <div className="text-center space-y-6 px-4">
                <p className="font-mono text-primary text-body-base tracking-widest uppercase">
                    404
                </p>
                <h1 className="text-display-sm sm:text-display-md font-anton text-foreground leading-none">
                    PAGE NOT<br />
                    <span className="text-primary">FOUND</span>
                </h1>
                <p className="text-body-lg text-muted-foreground max-w-sm mx-auto">
                    The page you are looking for does not exist or has been moved.
                </p>
                <Button as="link" href="/" variant="primary">
                    Back to Home
                </Button>
            </div>
        </div>
    );
}
