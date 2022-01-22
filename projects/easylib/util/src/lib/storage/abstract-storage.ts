
abstract class AbstractStorage {

  abstract setItem(key: string, value: any): void;

  abstract getItem(key: string): any;

  abstract removeItem(key: string): void;

}
