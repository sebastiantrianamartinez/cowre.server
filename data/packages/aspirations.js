class Aspiration {
    constructor (){
        this.packaged = {
            session: null,
            vet: null,
            farm: null,
            aspirations: [],
            aspirationCount: 0
        }
    }

    addSession(session) {
        this.packaged.session = {
            id: session?.uuid,
            remarks: session?.remarks,
            date: session?.createdAt,
            updated: session?.updatedAt
        };

        if (session?.vet) {
            this.packaged.vet = {
                id: session.vet.id,
                name: session.vet.name
            };
        }

        if (session?.farmData) {
            this.packaged.farm = {
                id: session.farmData.id,
                name: session.farmData.name,
                location: session.farmData.location
            };
        }
    }

    addAspirations(aspirations) {
        this.packaged.aspirations = aspirations;
        this.packaged.aspirationCount = aspirations.length;
    }

    addStats(stats) {
        this.packaged.stats = stats;
    }

    addClivages(clivages) {
        this.packaged.clivages = clivages;
    }

    addTransfers(transfers) {
        this.packaged.transfers = transfers;
    }

    build() {
        return this.packaged;
    }
}

module.exports = Aspiration;