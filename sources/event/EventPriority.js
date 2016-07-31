/* global minejs */
class EventPriority {
    /**
     * Event call is of very low importance and should be ran first, to allow
     * other plugins to further customise the outcome
     */
    static get LOWEST() {
        return 0;
    }

    /**
     * Event call is of low importance
     */
    static get LOW() {
        return 1;
    }

    /**
     * Event call is neither important nor unimportant, and may be ran
     * normally
     */
    static get NORMAL() {
        return 2;
    }

    /**
     * Event call is of high importance
     */
    static get HIGH() {
        return 3;
    }

    /**
     * Event call is critical and must have the final say in what happens
     * to the event
     */
    static get HIGHEST() {
        return 4;
    }

    /**
     * Event is listened to purely for monitoring the outcome of an event.
     * <p>
     * No modifications to the event should be made under this priority
     */
    static get MONITOR() {
        return 5;
    }
}