export class CreateCategoryCommand {
  constructor(
    public readonly name: string,
    public readonly icon: string,
    public readonly color: string,
    public readonly userId: string,
  ) {}
}
