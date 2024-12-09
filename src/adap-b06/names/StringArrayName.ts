import { Name } from "./Name";
import { AbstractName } from "./AbstractName";
import { ExceptionType } from "../common/AssertionDispatcher";
import { MethodFailedException } from "../common/MethodFailedException";

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

    public setComponent(i: number, c: string): Name {
        // pre-conditions
        this.assertIndexInBounds(i, ExceptionType.PRECONDITION);
        this.assertIsEscaped(c, ExceptionType.PRECONDITION);

        let compCopy: string[] = [...this.components];
        compCopy[i] = c;

        const newName: Name = new StringArrayName(compCopy, this.delimiter);

        MethodFailedException.assert(newName.getComponent(i) === c, "setComponent failed")
        this.assertClassInvariants();
        
        return newName;
    }

    public insert(i: number, c: string): Name {
        // pre-conditions
        this.assertIsNotNullOrUndefined(i, ExceptionType.PRECONDITION);
        this.assertIsNotNullOrUndefined(c, ExceptionType.PRECONDITION);
        this.assertIndexInBoundsForInsert(i, ExceptionType.PRECONDITION);
        this.assertIsEscaped(c, ExceptionType.PRECONDITION);


        let compCopy: string[] = [...this.components];
        compCopy.splice(i, 0, c);
        const newName: Name = new StringArrayName(compCopy, this.delimiter);


        MethodFailedException.assert(newName.getNoComponents() === this.getNoComponents() + 1, "insert failed");
        MethodFailedException.assert(newName.getComponent(i) === c, "insert failed");
        this.assertClassInvariants();

        return newName;
    }

    public append(c: string): Name {
        // pre-conditions
        this.assertIsNotNullOrUndefined(c, ExceptionType.PRECONDITION);
        this.assertIsEscaped(c, ExceptionType.PRECONDITION);

        let compCopy: string[] = [...this.components];
        compCopy.push(c);

        const newName: Name = new StringArrayName(compCopy, this.delimiter);

        MethodFailedException.assert(newName.getNoComponents() === this.getNoComponents() + 1, "append failed");
        MethodFailedException.assert(newName.getComponent(newName.getNoComponents() -1 ) === c, "append failed");
        this.assertClassInvariants();

        return newName;
    }

    public remove(i: number): Name {
        // pre-conditions
        this.assertIndexInBounds(i, ExceptionType.PRECONDITION);

        let compCopy: string[] = [...this.components];
        compCopy.splice(i, 1);
        const newName: StringArrayName = new StringArrayName(compCopy, this.delimiter);

        MethodFailedException.assert(newName.getNoComponents() === this.getNoComponents() - 1, "remove failed");
        this.assertClassInvariants();
        return newName;
    }
}
