import { useId } from 'react';
import type { SVGProps } from 'react';
interface SVGRProps {
    title?: string;
    titleId?: string;
}
// SectionTitle falls back to this icon in every section, so the ids SVGR baked
// in would be duplicated six times per page: duplicate ids are invalid HTML and
// every `url(#…)` would silently paint with the first instance's pattern.
//
// SVGR had also inlined the artwork as a ~32 KB base64 data URI, which was
// serialised once per instance — roughly 196 KB of the home page's HTML for an
// identical decorative flower. The PNG now lives in `public/` and is fetched
// once and cached. NOTE: both of these are hand-edits to a generated file;
// re-running `pnpm svgr:icons` would reintroduce the fixed ids and the inline
// data URI.
const SvgSectionFlower = ({
    title,
    titleId,
    ...props
}: SVGProps<SVGSVGElement> & SVGRProps) => {
    // `useId` output carries punctuation (`:` in React 18, `«»` in React 19),
    // which is awkward inside `url(#…)` — strip it so the reference stays plain.
    const uid = useId().replace(/[^a-zA-Z0-9_-]/g, '');
    const patternId = `${uid}-a`;
    const imageId = `${uid}-b`;

    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            xmlnsXlink="http://www.w3.org/1999/xlink"
            fill="none"
            viewBox="0 0 25 29"
            aria-labelledby={titleId}
            {...props}
        >
            {title ? <title id={titleId}>{title}</title> : null}
            <path fill={`url(#${patternId})`} d="M25 0H0v28.929h25z" />
            <defs>
                <pattern
                    id={patternId}
                    width={1}
                    height={1}
                    patternContentUnits="objectBoundingBox"
                >
                    <use
                        xlinkHref={`#${imageId}`}
                        transform="matrix(.00255 0 0 .0022 -.01 0)"
                    />
                </pattern>
                <image
                    /* Extracted from the original inline data URI — see the
                       file header. Same-origin, so the `<use>` reference below
                       resolves exactly as it did when the bytes were inline. */
                    xlinkHref="/section-flower.png"
                    id={imageId}
                    width={400}
                    height={453}
                />
            </defs>
        </svg>
    );
};
export default SvgSectionFlower;
