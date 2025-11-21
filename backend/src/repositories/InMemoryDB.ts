/**
 * This is a simple implementation of an in-memory database.
 */
export default class InMemoryDB<T extends { id?: string }> {
    // private storage for the inmemory database
    #storage: Map<string, T> = new Map();

    create(document: Omit<T, 'id'> & { id?: string }): T {
        if (!document.id) document.id = crypto.randomUUID();
        this.#storage.set(document.id, document as T);
        return document as T;
    }

    findById(id:string):T | undefined{
        return this.#storage.get(id);
    }

    findAll(): T[] {
    return Array.from(this.#storage.values());
  }

  update(id:string, partialDocument:T):T|undefined{
      if (this.#storage.has(id)) {
      const existingDocument = this.#storage.get(id)!; // Non-null assertion because we checked with has()
      const updatedDocument = { ...existingDocument, ...partialDocument, id }; // Ensure the id remains unchanged
      this.#storage.set(id, updatedDocument);
      return updatedDocument;
    }
    return undefined;
  }

  delete(id:string):boolean{
      return this.#storage.delete(id);
  }

  createMany(documents:T[]):void{
      documents.forEach((doc) => this.create(doc));
  }
}