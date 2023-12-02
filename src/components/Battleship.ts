class Battleship {
    // An array representing parts of the ship, where each part is either hit (true) or not hit (false).
    private parts: boolean[];

    // Origin of the ship on the grid, represented by x and y coordinates.
    private origin: [number, number];

    // Boolean indicating whether the ship is vertical.
    private isVertical: boolean;

    /**
     * Constructor to create a new Battleship instance.
     * 
     * @param shipLength The length of the ship.
     * @param origin The starting coordinate of the ship.
     * @param isVertical Boolean indicating whether the ship is vertical.
     */
    constructor(shipLength: number, origin: [number, number], isVertical: boolean) {
        this.parts = new Array(shipLength).fill(false);  // Initialize all parts as not hit
        this.origin = origin;
        this.isVertical = isVertical;

    }

    // Getter to access the parts of the ship.
    get getParts(): boolean[] {
        return this.parts;
    }

    // Getter to access the length of the ship.
    get getLength(): number {
        return this.parts.length;
    }

    // Getter to access the origin of the ship.
    get getOrigin(): [number, number] {
        return this.origin;
    }

    // Getter to check if the ship is vertical.
    get getIsVertical(): boolean {
        return this.isVertical;
    }
    
    /**
     * Method to record a hit on a part of the ship.
     * 
     * @param part The index of the part of the ship that is hit.
     * @throws Error if the part index is greater than the length of the ship.
     */
    hit(part: number): void {
        if (part > this.parts.length - 1) {
            throw new Error("Value higher than ship length");
        }
        this.parts[part] = true;
    }

    // Method to determine if the ship has been sunk (all parts hit).
    isSunk(): boolean {
        return this.parts.every((part) => part);
    }
}

export default Battleship;
