class Cow {
    constructor() {
        this.packaged = {
            id: null,
            name: null,
            number: null,
            sex: null,
            race: null, 
            farm: {},
            stats: {},
            shares: [],
            management: null,
            status: null,
            statusNumber: null
        };
    }

    addCow(cow){
        this.packaged.id = cow.id;
        this.packaged.name = cow.name;
        this.packaged.number = cow.number;
        this.packaged.sex = cow.sex == 1 ? 'Hembra' : 'Macho';
        this.packaged.race = cow.raceData ? cow.raceData.name : null;
        this.packaged.status = cow.status == 1 ? 'inactive' : cow.status == 2 ? 'active' : 'deleted';
        this.packaged.statusNumber = cow.status;

        if(cow.farm){
            this.addFarm(cow.farm);
        }
        if(cow.stats){
            this.addStats(cow.stats);
        }
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

    addShares(shares){
        this.packaged.shares = shares.map(share => ({
            id: share.id,
            percent: share.percent,
            owner: share.ownerData
        }));

        if(shares.length > 0){
            this.packaged.management = shares[0].remarks?.management || null;
        }
    }

    build(){
        return this.packaged;
    }
}

module.exports = Cow;