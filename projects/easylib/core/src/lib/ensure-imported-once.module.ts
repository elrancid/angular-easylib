/**
 * This abstract class used for module building by extending this class
 * prevents importing the module into somewhere else than root App Module.
 */
export abstract class EnsureImportedOnceModule {
  protected constructor(targetModule: any) {
    if (targetModule) {
      throw new Error(`${targetModule.constructor.name} has already been loaded.
      You should only import Core modules in the AppModule only.`);
    }
  }
}
