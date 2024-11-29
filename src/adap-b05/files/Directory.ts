import { Z_UNKNOWN } from "zlib";
import { Exception } from "../common/Exception";
import { ServiceFailureException } from "../common/ServiceFailureException";
import { Node } from "./Node";

export class Directory extends Node {

    protected childNodes: Set<Node> = new Set<Node>();

    constructor(bn: string, pn: Directory) {
        super(bn, pn);
    }

    public add(cn: Node): void {
        this.childNodes.add(cn);
    }

    public remove(cn: Node): void {
        this.childNodes.delete(cn); // Yikes! Should have been called remove
    }

    /** Override findNodes to include recursive traversal */
    public override findNodes(bn: string): Set<Node> {
        try {
            const result = new Set<Node>();
            super.findNodes(bn);

            // Recursively search in children
            for (const child of this.childNodes) {
                const childResults: Set<Node> = child.findNodes(bn); // Recursive call
                for (const match of childResults) {
                    result.add(match); // Add all matches from the child
                }
            }

            this.assertClassInvariants();
            return result;
        } catch (ex) {
            ServiceFailureException.assertCondition(false, undefined, ex as Exception);
            return new Set<Node>;
        }
    }
}
