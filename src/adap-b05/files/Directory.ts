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
    const result = new Set<Node>();
    try {
      super.findNodes(bn);

      // Recursively search in children
      for (const child of this.childNodes) {
        const childResults: Set<Node> = child.findNodes(bn); // Recursive call
        for (const match of childResults) {
          result.add(match); // Add all matches from the child
        }
      }

      this.assertClassInvariants();
    } catch (er: any) {
      let ex: Exception = er as Exception;
      // let tx: Exception = ex.getTrigger();
      let tx: Exception = ex.hasTrigger() ?ex.getTrigger() :ex;
      throw new ServiceFailureException("Service failed", tx as Exception);
    }
    return result;
  }
}
