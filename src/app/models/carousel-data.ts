import { Coach } from './Coach';

export interface CarouselData {
    id?: string;
    text: string;
    coach?: Coach;
    dataMerge?: number;
    width?: number;
    dotContent?: string;
    src?: string;
    dataHash?: string;
}
