import { AssertionDispatcher, ExceptionType } from "../common/AssertionDispatcher";
import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";

export abstract class AbstractName implements Name {

    protected delimiter: string = DEFAULT_DELIMITER;

    constructor(delimiter: string = DEFAULT_DELIMITER) {
        this.assertIsValidDelimiter(delimiter, ExceptionType.PRECONDITION);

        this.delimiter = delimiter;

        this.assertDelimiterIsSet(delimiter, ExceptionType.POSTCONDITION);
    }

    public clone(): Name {
        let clone: Name = { ...this };

        this.assertCloneIsEqual(clone, ExceptionType.POSTCONDITION);
        this.assertClassInvariants();

        return clone;
    }

    public asString(delimiter: string = this.delimiter): string {
        // pre-conditions
        this.assertIsValidDelimiter(delimiter, ExceptionType.PRECONDITION);

        let str: string = "";
        let len: number = this.getNoComponents();
        for (let i = 0; i < len; i++) {
            let comp: string = this.getComponent(i);
            comp = comp.replaceAll(ESCAPE_CHARACTER, "");
            str += comp;
            if (i < len - 1) {
                str += delimiter;
            }
        }

        // post-conditions
        this.assertIsValidString(str, ExceptionType.POSTCONDITION);
        this.assertClassInvariants();

        return str;
    }

    public toString(): string {
        return this.asDataString();
    }

    public asDataString(): string {
        // pre-conditions
        this.assertIsValidDelimiter(DEFAULT_DELIMITER, ExceptionType.PRECONDITION);

        let str: string = "";
        let len: number = this.getNoComponents();
        for (let i = 0; i < len; i++) {
            let comp: string = this.getComponent(i);
            if (this.delimiter != DEFAULT_DELIMITER) {
                comp = comp.replaceAll(DEFAULT_DELIMITER, ESCAPE_CHARACTER + DEFAULT_DELIMITER);
                comp = comp.replaceAll(ESCAPE_CHARACTER + this.delimiter, this.delimiter);
            }
            str += comp;
            if (i < len - 1) {
                str += DEFAULT_DELIMITER;
            }
        }

        // post-conditions
        this.assertIsValidString(str, ExceptionType.PRECONDITION);
        this.assertClassInvariants();

        return str;
    }

    public isEqual(other: Name): boolean {
        // pre-conditions
        this.assertIsNotNullOrUndefined(other, ExceptionType.PRECONDITION);
        this.assertSharesDelimiter(other, ExceptionType.PRECONDITION);

        return ((this.asDataString() == other.asDataString()) &&
            (this.getDelimiterCharacter() == other.getDelimiterCharacter()) &&
            (this.getNoComponents() == other.getNoComponents())
        );
    }

    public getHashCode(): number {
        let hashCode: number = 0;
        const s: string = this.asDataString() + this.getDelimiterCharacter() + String(this.getNoComponents());
        for (let i = 0; i < s.length; i++) {
            let c = s.charCodeAt(i);
            hashCode = (hashCode << 5) - hashCode + c;
            hashCode |= 0;
        }
        return hashCode;
    }

    public isEmpty(): boolean {
        return this.getNoComponents() === 0;
    }

    public getDelimiterCharacter(): string {
        return this.delimiter;
    }

    abstract getNoComponents(): number;

    abstract getComponent(i: number): string;
    abstract setComponent(i: number, c: string): void;

    abstract insert(i: number, c: string): void;
    abstract append(c: string): void;
    abstract remove(i: number): void;

    public concat(other: Name): void {
        this.assertIsNotNullOrUndefined(other, ExceptionType.PRECONDITION);
        this.assertSharesDelimiter(other, ExceptionType.PRECONDITION);

        let oldCompoCount: number = this.getNoComponents();

        for (let i = 0; i < other.getNoComponents(); i++) {
            this.append(other.getComponent(i));
        }

        this.assertComponentCountChangedBy(oldCompoCount, other.getNoComponents(), ExceptionType.POSTCONDITION);
        this.assertClassInvariants();
    }

    protected assertClassInvariants(): void {
        //ToDo Implement
    }

    protected assertIsNotNullOrUndefined(o: Object | null, et: ExceptionType): void {
        AssertionDispatcher.dispatch(
            et,
            !(o === undefined) && !(o === null),
            "null or undefined"
        )
    }

    protected assertIndexInBounds(i: number, et: ExceptionType): void {
        AssertionDispatcher.dispatch(
            et,
            (i >= 0) && (i < this.getNoComponents()),
            "Index out of bounds"
        );
    }

    protected assertIndexInBoundsForInsert(i: number, et: ExceptionType): void {
        AssertionDispatcher.dispatch(
            et,
            (i >= 0) && (i <= this.getNoComponents()),
            "Index out of bounds"
        );
    }

    protected assertIsValidDelimiter(delim: string, et: ExceptionType): void {
        this.assertIsNotNullOrUndefined(delim, et);

        AssertionDispatcher.dispatch(
            et,
            delim.length === 1,
            "Delimiter is not a single Char"
        );
        AssertionDispatcher.dispatch(
            et,
            delim !== ESCAPE_CHARACTER,
            "Delimiter cannot equal ESCAPE_CHARACTER"
        );
    }

    protected assertIsEscaped(comp: string, et: ExceptionType): void {
        this.assertIsNotNullOrUndefined(comp, et);

        let hasNoUnescapedDelimiters: boolean =
            comp.split(this.delimiter).length === comp.split(ESCAPE_CHARACTER + this.delimiter).length;
        AssertionDispatcher.dispatch(
            et,
            hasNoUnescapedDelimiters,
            "Component is not escaped correctly"
        );
    }

    protected assertSharesDelimiter(other: Name, et: ExceptionType): void {
        AssertionDispatcher.dispatch(
            et,
            other.getDelimiterCharacter() === this.getDelimiterCharacter(),
            "Delimiter do not match"
        )
    }

    protected assertDelimiterIsSet(delim: string, et: ExceptionType): void {
        AssertionDispatcher.dispatch(
            et,
            delim == this.delimiter,
            "Delimiter not set correctly"
        );
    }

    protected assertCloneIsEqual(clone: Name, et: ExceptionType): void {
        AssertionDispatcher.dispatch(
            et,
            this.isEqual(clone),
            "Clone is not equal"
        );
    }

    protected assertComponentEquals(idx: number, comp: string, et: ExceptionType): void {
        AssertionDispatcher.dispatch(
            et,
            this.getComponent(idx) === comp,
            "Component not set correctly"
        );
    }

    protected assertComponentCountChangedBy(oldNoComponents: number, expectedDiff: number, et: ExceptionType): void {
        AssertionDispatcher.dispatch(
            et,
            this.getNoComponents() === oldNoComponents + expectedDiff,
            "Component-count did not change accordingly"
        );
    }

    protected assertIsValidString(s: string, et: ExceptionType): void {
        this.assertIsNotNullOrUndefined(s, et);
        let isValid: boolean;
        if (!this.isEmpty()) {
            isValid = (s !== "");
        } else {
            isValid = (s === "");
        }

        AssertionDispatcher.dispatch(
            et,
            isValid,
            "String is not correct"
        )
    }
}
