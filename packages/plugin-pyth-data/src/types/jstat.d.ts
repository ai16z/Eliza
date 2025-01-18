declare module 'jstat' {
    const jStat: {
        normal: {
            inv: (p: number, mean: number, std: number) => number;
        };
    };
    export default jStat;
} 