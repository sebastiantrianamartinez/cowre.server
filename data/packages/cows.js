class Cow {
    constructor() {
        this.packaged = {
            id: null,
            name: null,
            number: null,
            sex: null,
            race: null, 
            farm: {},
            stats: {}
        };
    }

    addCow(cow){
        this.packaged.id = cow.id;
        this.packaged.name = cow.name;
        this.packaged.number = cow.number;
        this.packaged.sex = cow.sex == 1 ? 'Hembra' : 'Macho';
        this.packaged.race = cow.raceData ? cow.raceData.name : null;
    }

    addFarm(farm){
        if (farm) {
            this.packaged.farm = {
                id: farm.id,
                name: farm.name,
                location: farm.location
            };
        }
    }

    addStats(stats){
        this.packaged.stats = stats;
    }

    build(){
        return this.packaged;
    }
}