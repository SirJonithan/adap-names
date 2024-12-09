import { ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";
import { AbstractName } from "./AbstractName";
import { ExceptionType } from "../common/AssertionDispatcher";
import { MethodFailedException } from "../common/MethodFailedException";

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

    public setComponent(i: number, c: string): Name {
        this.assertIsNotNullOrUndefined(i, ExceptionType.PRECONDITION);
        this.assertIsNotNullOrUndefined(c, ExceptionType.PRECONDITION);
        this.assertIndexInBounds(i, ExceptionType.PRECONDITION);
        this.assertIsEscaped(c, ExceptionType.PRECONDITION);

        let components: string[] = this.asStringArray();
        components[i] = c;
        const newNameString: string = components.join(this.delimiter);
        const newName: Name = new StringName(newNameString, this.delimiter);

        MethodFailedException.assert(newName.getComponent(i) === c, "setComponent failed");
        this.assertClassInvariants();

        return newName;
    }

    public insert(i: number, c: string): Name {
        this.assertIsNotNullOrUndefined(i, ExceptionType.PRECONDITION);
        this.assertIsNotNullOrUndefined(c, ExceptionType.PRECONDITION);
        this.assertIndexInBoundsForInsert(i, ExceptionType.PRECONDITION);
        this.assertIsEscaped(c, ExceptionType.PRECONDITION)

        let components: string[] = this.asStringArray();
        components.splice(i, 0, c);
        const newNameString: string = components.join(this.delimiter);
        const newName: Name = new StringName(newNameString, this.delimiter);

        MethodFailedException.assert(newName.getNoComponents() === this.getNoComponents() + 1, "insert failed");
        MethodFailedException.assert(newName.getComponent(i) === c, "insert failed");
        this.assertClassInvariants();

        return newName;
    }

    public append(c: string): Name {
        this.assertIsNotNullOrUndefined(c, ExceptionType.PRECONDITION);
        this.assertIsEscaped(c, ExceptionType.PRECONDITION);

        const newNameString: string = this.name + this.delimiter + c;
        const newName: Name = new StringName(newNameString, this.delimiter);

        MethodFailedException.assert(newName.getNoComponents() === this.getNoComponents() + 1, "append failed");
        MethodFailedException.assert(newName.getComponent(newName.getNoComponents() - 1) === c, "append failed");
        this.assertClassInvariants();

        return newName;
    }

    public remove(i: number): Name {
        this.assertIsNotNullOrUndefined(i, ExceptionType.PRECONDITION);
        this.assertIndexInBounds(i, ExceptionType.PRECONDITION);

        let components: string[] = this.asStringArray();
        components.splice(i, 1);
        const newNameString: string = components.join(this.delimiter);
        const newName: Name = new StringName(newNameString, this.delimiter);

        MethodFailedException.assert(newName.getNoComponents() === this.getNoComponents() - 1);
        this.assertClassInvariants();

        return newName;
    }

}
