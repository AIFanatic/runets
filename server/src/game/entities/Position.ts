export class Position {
    /**
     * Difference in X coordinates for directions array.
    */
    public static DIRECTION_DELTA_X = [-1, 0, 1, -1, 1, -1, 0, 1];
    /**
     * Difference in Y coordinates for directions array.
    */
    public static DIRECTION_DELTA_Y = [1, 1, 1, 0, 0, -1, -1, -1];

    private x: number;
    private y: number;
    private z: number;

    /**
     * Creates a new Position with the specified coordinates.
     *
     * @param x the X coordinate
     * @param y the Y coordinate
     * @param z the Z coordinate
    */
    constructor(x: number, y: number, z: number = 0) {
        this.x = x;
        this.y = y;
        this.z = z;
    }

    /**
     * Returns the delta coordinates. Note that the returned Position is not an
     * actual position, instead it's values represent the delta values between
     * the two arguments.
     *
     * @param a the first position
     * @param b the second position
     * @return the delta coordinates contained within a position
     */
    public static delta(a: Position, b: Position): Position {
        return new Position(b.getX() - a.getX(), b.getY() - a.getY(), b.getZ() - a.getZ());
    }

    /**
     * Calculates the direction between the two coordinates.
     *
     * @param dx the first coordinate
     * @param dy the second coordinate
     * @return the direction
     */
    public static direction(dx: number, dy: number): number {
        if (dx < 0) {
            if (dy < 0) {
                return 5;
            } else if (dy > 0) {
                return 0;
            } else {
                return 3;
            }
        } else if (dx > 0) {
            if (dy < 0) {
                return 7;
            } else if (dy > 0) {
                return 2;
            } else {
                return 4;
            }
        } else {
            if (dy < 0) {
                return 6;
            } else if (dy > 0) {
                return 1;
            } else {
                return -1;
            }
        }
    }

    public fromDirection(direction: number): Position {
        return new Position(this.x + Position.DIRECTION_DELTA_X[direction], this.y + Position.DIRECTION_DELTA_Y[direction], this.z);
    }

    public toString() {
        return "Position(" + this.x + ", " + this.y + ", " + this.z + ")";
    }

    public equals(other: Position): boolean {
        if (other instanceof Position) {
            return this.x == other.x && this.y == other.y && this.z == other.z;
        }
        return false;
    }

    /**
     * Sets this position as the other position. <b>Please use this method
     * instead of player.setPosition(other)</b> because of reference conflicts
     * (if the other position gets modified, so will the players).
     *
     * @param other the other position
     */
    public setAs(other: Position) {
        this.x = other.x;
        this.y = other.y;
        this.z = other.z;
    }

    /**
     * Moves the position.
     *
     * @param amountX the amount of X coordinates
     * @param amountY the amount of Y coordinates
     */
    public move(amountX: number, amountY: number) {
        this.setX(this.getX() + amountX);
        this.setY(this.getY() + amountY);
    }

    /**
     * Gets the X coordinate.
     *
     * @return the X coordinate
     */
    public getX(): number {
        return this.x;
    }

    /**
     * Sets the X coordinate.
     *
     * @param x the X coordinate
     */
    public setX(x: number) {
        this.x = x;
    }

    /**
     * Gets the Y coordinate.
     *
     * @return the Y coordinate
     */
    public getY(): number {
        return this.y;
    }

    /**
     * Sets the Y coordinate.
     *
     * @param y the Y coordinate
     */
    public setY(y: number) {
        this.y = y;
    }

    /**
     * Gets the Z coordinate.
     *
     * @return the Z coordinate.
     */
    public getZ(): number {
        return this.z;
    }

    /**
     * Sets the Z coordinate.
     *
     * @param z the Z coordinate
     */
    public setZ(z: number) {
        this.z = z;
    }

    /**
     * Gets the X coordinate of the region containing this Position.
     *
     * @return the region X coordinate
     */
    public get regionX(): number {
        return (this.x >> 3) - 6;
    }

    /**
     * Gets the Y coordinate of the region containing this Position.
     *
     * @return the region Y coordinate
     */
    public get regionY(): number {
        return (this.y >> 3) - 6;
    }

    /**
     * Gets the local X coordinate of the region containing this Position.
     *
     * @return the local region X coordinate
     */
    public get regionLocalX(): number {
        return this.x - 8 * this.regionX;
    }

    /**
     * Gets the local Y coordinate of the region containing this Position.
     *
     * @return the local region Y coordinate
     */
    public get regionLocalY(): number {
        return this.y - 8 * this.regionY;
    }

    /**
     * Checks if this position is viewable from the other position.
     *
     * @param other the other position
     * @return true if it is viewable, false otherwise
     */
    public isViewableFrom(other: Position): boolean {
        const p = Position.delta(this, other);
        return p.z == 0 && p.x <= 14 && p.x >= -15 && p.y <= 14 && p.y >= -15;
    }

    public distanceBetween(other: Position): number {
        return Math.abs(Math.sqrt((this.x - other.x) * (this.x - other.x) + (this.y - other.y) * (this.y - other.y)));
    }
}