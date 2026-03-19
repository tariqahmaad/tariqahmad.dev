import type { SVGProps } from 'react';

export interface SVGRProps {
    title?: string;
    titleId?: string;
}

export type SVGRIconProps = SVGProps<SVGSVGElement> & SVGRProps;