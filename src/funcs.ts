import { Mask, parseMask } from "./options";
import { conformToMask } from "text-mask-core";
export function mask(
    input: string,
    mask: Mask,
    options: Record<string, unknown> | null = null
): string {
    const { conformedValue } = conformToMask(
        input,
        parseMask(mask),
        options || { guide: false }
    );
    return conformedValue;
}

export function unMask(input: string, mask: Mask): string {
    const m = parseMask(mask);
    if (!m || !m.length || typeof m === "function") return input;
    return input
        .split("")
        .map((v, index) => {
            if (m[index] && !(m[index] instanceof RegExp)) {
                return "";
            } else {
                return v;
            }
        })
        .filter(Boolean)
        .join("");
}
