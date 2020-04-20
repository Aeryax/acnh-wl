import { DEFAULT_COMBO_VALUE } from '../app.const';

export class ComboboxValue {
    public value: any;
    public name: string;

    public static default(): ComboboxValue {
        return {
            value: DEFAULT_COMBO_VALUE,
            name: 'Non renseigné'
        };
    }
}
