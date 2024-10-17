export const returnRoute = (path: string, tgt: string, st?: string): string => {
    const url = new URL(path);
    url.searchParams.set("tgt", tgt);
    if (st) url.searchParams.set("st", st);
    return url.toString();
};