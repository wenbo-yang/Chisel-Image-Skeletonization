import { Config } from '../config';

export class RuleSet {
    private config: Config;

    constructor(config?: Config) {
        this.config = config || new Config();
    }
}
