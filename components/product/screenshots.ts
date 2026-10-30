// Single source of truth for the CV Builder captures shown in the homepage
// spotlight and the /product gallery. Width/height are the files' real pixel
// dimensions, so Next reserves the correct box and the images render at their
// own ratio instead of being forced into a shared aspect-ratio (the captures
// differ in height after cropping).

export interface IProductShot {
    src: string;
    alt: string;
    width: number;
    height: number;
}

/** A product shot with its location-specific caption. */
export interface ICaptionedShot extends IProductShot {
    caption: string;
}

export const PRODUCT_SHOTS: IProductShot[] = [
    {
        src: '/screenshots/editor.webp',
        alt: 'The CV Builder guided editor with live A4 preview',
        width: 1280,
        height: 788,
    },
    {
        src: '/screenshots/templates.webp',
        alt: 'The CV Builder template gallery with Classic, Rhyhorn and Nexus',
        width: 1280,
        height: 743,
    },
    {
        src: '/screenshots/landing.webp',
        alt: 'The CV Builder landing page: build a resume that gets you hired',
        width: 1280,
        height: 632,
    },
];
