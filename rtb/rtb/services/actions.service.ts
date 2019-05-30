import { Subscription } from "rxjs";

export class Actions {
    subBroadcaster:Subscription = new Subscription();
    constructor() {}
}