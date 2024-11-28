import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";
import { AbstractName } from "./AbstractName";
import { ExceptionType } from "../common/AssertionDispatcher";

export class StringName extends AbstractName {

    protected name: string = "";
    protected noComponents: number = 0;

    constructor(other: string, delimiter?: string) {
        super(delimiter);
        this.assertIsNotNullOrUndefined(other, ExceptionType.PRECONDITION);
        this.name = other;

        this.noComponents = this.asStringArray().length;
    }

    private getDelimRegExp(delimiter: string = this.delimiter): RegExp {
        // Escape delimiter if it's a special regex character
        let escapedDelimiter: string = delimiter.replaceAll(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
        let escapedEscapeCharacter: string = ESCAPE_CHARACTER.replaceAll(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');

        // RegExp to find all unescaped delimiter chars
        return new RegExp(`(?<!${escapedEscapeCharacter})${escapedDelimiter}`, 'g');
    }

    private asStringArray(): string[] {
        let reg: RegExp = this.getDelimRegExp();
        return this.name.split(reg);
    }

    public getNoComponents(): number {
        return this.noComponents;

    }

    public getComponent(i: number): string {
        this.assertIsNotNullOrUndefined(i, ExceptionType.PRECONDITION);
        this.assertIndexInBounds(i, ExceptionType.PRECONDITION);

        return this.asStringArray()[i];

    }

    public setComponent(i: number, c: string) {
        this.assertIsNotNullOrUndefined(i, ExceptionType.PRECONDITION);
        this.assertIsNotNullOrUndefined(c, ExceptionType.PRECONDITION);
        this.assertIndexInBounds(i, ExceptionType.PRECONDITION);
        this.assertIsEscaped(c, ExceptionType.PRECONDITION);

        let components: string[] = this.asStringArray();
        components[i] = c;
        this.name = components.join(this.delimiter);

        this.assertComponentEquals(i, c, ExceptionType.POSTCONDITION);
        this.assertClassInvariants();
    }

    public insert(i: number, c: string) {
        this.assertIsNotNullOrUndefined(i, ExceptionType.PRECONDITION);
        this.assertIsNotNullOrUndefined(c, ExceptionType.PRECONDITION);
        this.assertIndexInBoundsForInsert(i, ExceptionType.PRECONDITION);
        this.assertIsEscaped(c, ExceptionType.PRECONDITION)

        let components: string[] = this.asStringArray();
        components.splice(i, 0, c);
        this.name = components.join(this.delimiter);
        let oldNoComponents: number = this.getNoComponents();
        this.noComponents = oldNoComponents + 1;

        this.assertComponentCountChangedBy(oldNoComponents, 1, ExceptionType.POSTCONDITION);
        this.assertComponentEquals(i, c, ExceptionType.POSTCONDITION);
        this.assertClassInvariants();
    }

    public append(c: string) {
        this.assertIsNotNullOrUndefined(c, ExceptionType.PRECONDITION);
        this.assertIsEscaped(c, ExceptionType.PRECONDITION);
        let oldNoComponents: number = this.getNoComponents();

        this.name += this.delimiter + c;
        this.noComponents += 1;

        this.assertComponentCountChangedBy(oldNoComponents, 1, ExceptionType.POSTCONDITION);
        this.assertComponentEquals(this.getNoComponents() - 1, c, ExceptionType.POSTCONDITION);
        this.assertClassInvariants();
    }

    public remove(i: number) {
        this.assertIsNotNullOrUndefined(i, ExceptionType.PRECONDITION);
        this.assertIndexInBounds(i, ExceptionType.PRECONDITION);
        let oldNoComponents: number = this.getNoComponents();

        let components: string[] = this.asStringArray();
        components.splice(i, 1);
        this.name = components.join(this.delimiter);
        this.noComponents -= 1;

        this.assertComponentCountChangedBy(oldNoComponents, -1, ExceptionType.POSTCONDITION);
        this.assertClassInvariants();
    }

}
