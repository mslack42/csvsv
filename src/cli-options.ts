export default class CliOptions {
  private static instance: CliOptions;
  public options: any;

  private constructor() {

  }

  public static getInstance() {
    if (!CliOptions.instance) {
      CliOptions.instance = new CliOptions();
    }
    return CliOptions.instance;
  }

  public loadOptions = (opts: any) => {
    this.options = opts;
  };
}
