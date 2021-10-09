import { ObjectDirective } from "@vue/runtime-core";
import { createTextMaskInputElement } from "text-mask-core";
import { Mask, parseMask } from "./options";

interface MaskRecord {
    instance: any;
    mask: Mask;
    options: Record<string, unknown>;
}
const records = new Map<HTMLInputElement, MaskRecord>();

const getInput = (el: any): HTMLInputElement =>
    el instanceof HTMLInputElement ? el : el.querySelector("input") || el;
const getOptions = (v: any) => {
    const def = { mask: "", options: { guide: false } };
    const options = v.mask ? v : { mask: v };
    options.mask = parseMask(options.mask);
    return Object.assign(def, options);
};

const setRecord = (
    el: HTMLInputElement,
    options: any
): MaskRecord | undefined => {
    records.set(el, {
        instance: createTextMaskInputElement({
            inputElement: el,
            mask: options.mask,
            ...(options.options || {})
        }),
        mask: options.mask,
        options: options.options
    });
    return records.get(el);
};

/**
 * Clear input value by escape key
 */
export const vMask: ObjectDirective<any> = {
    mounted(el, { value }) {
        const iEl = getInput(el);
        const options = getOptions(value);
        const rec = setRecord(iEl, options);
        rec && rec.instance && rec.instance.update();
    },
    updated(el, { oldValue, value }) {
        const iEl = getInput(el);
        let record: MaskRecord | undefined = undefined;
        const oldOptions = getOptions(oldValue);
        const newOptions = getOptions(value);
        if (JSON.stringify(oldOptions) != JSON.stringify(newOptions)) {
            record = setRecord(iEl, newOptions);
        } else {
            record = records.get(iEl);
        }
        record && record.instance && record.instance.update();
        iEl.dispatchEvent(
            new Event("input", { bubbles: true, cancelable: true })
        );
    },
    beforeUnmount(el) {
        const iEl = getInput(el);
        records.delete(iEl);
    }
};
