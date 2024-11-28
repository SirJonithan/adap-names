import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";
import { AbstractName } from "./AbstractName";
import { ExceptionType } from "../common/AssertionDispatcher";

export class StringArrayName extends AbstractName {

    protected components: string[] = [];

    constructor(other: string[], delimiter?: string) {
        super(delimiter);

        this.assertIsNotNullOrUndefined(other, ExceptionType.PRECONDITION);
        other.forEach((component) => {
            this.assertIsEscaped(component, ExceptionType.PRECONDITION)});
        this.components = other;
    }

    getNoComponents(): number {
        return this.components.length;
    }

    public getComponent(i: number): string {
        // pre-conditions
        this.assertIndexInBounds(i, ExceptionType.PRECONDITION);

        this.assertIndexInBounds(i, ExceptionType.PRECONDITION);

        let c: string = this.components[i];

        this.assertClassInvariants();
        return c;
    }

    public setComponent(i: number, c: string) {
        // pre-conditions
        this.assertIndexInBounds(i, ExceptionType.PRECONDITION);
        this.assertIsEscaped(c, ExceptionType.PRECONDITION);

        this.components[i] = c;

        this.assertComponentEquals(i, c, ExceptionType.POSTCONDITION);
        this.assertClassInvariants();
    }

    public insert(i: number, c: string) {
        // pre-conditions
        this.assertIsNotNullOrUndefined(i, ExceptionType.PRECONDITION);
        this.assertIsNotNullOrUndefined(c, ExceptionType.PRECONDITION);
        this.assertIndexInBoundsForInsert(i, ExceptionType.PRECONDITION);
        this.assertIsEscaped(c, ExceptionType.PRECONDITION);

        let oldNoComponents: number = this.getNoComponents();

        this.components.splice(i, 0, c);

        this.assertComponentCountChangedBy(oldNoComponents, 1, ExceptionType.POSTCONDITION);
        this.assertComponentEquals(i, c, ExceptionType.POSTCONDITION);
        this.assertClassInvariants();
    }

    public append(c: string) {
        // pre-conditions
        this.assertIsNotNullOrUndefined(c, ExceptionType.PRECONDITION);
        this.assertIsEscaped(c, ExceptionType.PRECONDITION);
        let oldLen: number = this.getNoComponents();

        this.components.push(c);

        this.assertComponentCountChangedBy(oldLen, 1, ExceptionType.POSTCONDITION);
        this.assertComponentEquals(this.getNoComponents() - 1, c, ExceptionType.POSTCONDITION);
        this.assertClassInvariants();
    }

    public remove(i: number) {
        // pre-conditions
        this.assertIndexInBounds(i, ExceptionType.PRECONDITION);
        let oldLen: number = this.getNoComponents();


        this.components.splice(i, 1)

        this.assertComponentCountChangedBy(oldLen, -1, ExceptionType.POSTCONDITION);
        this.assertClassInvariants();
    }
}
