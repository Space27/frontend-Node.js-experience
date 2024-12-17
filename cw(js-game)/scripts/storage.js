class Storage {
    addResult(level, player, result) {
        const records = this.getAllRecords(level);

        records.push({player, result});
        records.sort((a, b) => b.result - a.result);

        localStorage.setItem(`${level}`, JSON.stringify(records));
    }

    getAllRecords(level) {
        const recordsStr = localStorage.getItem(`${level}`);

        return recordsStr ? JSON.parse(recordsStr) : [];
    }
}

export const storage = new Storage();