class ClivagePackage {
    constructor() {
        this.packaged = {
            opu: null,
            clivages: [],
            count: 0
        };
    }

    addSession(session) {
        this.packaged.opu = {
            id: session.id,
            remarks: session.remarks,
            date: session.createdAt,
            vet: session.vet
                ? {
                      id: session.vet.id,
                      name: session.vet.name,
                  }
                : null,
            farm: session.farmData
                ? {
                      id: session.farmData.id,
                      name: session.farmData.name,
                      location: session.farmData.location,
                  }
                : null,
        };
    }

    addClivages(clivages) {
        this.packaged.clivages = clivages;
        this.packaged.count = clivages.length;
    }

    build() {
        return this.packaged;
    }
}

module.exports = ClivagePackage;
