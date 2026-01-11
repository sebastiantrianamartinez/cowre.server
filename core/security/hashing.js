class HashingService {
    constructor() {
        this.alphabets = [
            {
                key: "QAZ",
                map: {
                    0: ["A", "Q"], 1: ["B", "W"], 2: ["C", "E"], 3: ["D", "R"], 4: ["E", "T"],
                    5: ["F", "Y"], 6: ["G", "U"], 7: ["H", "I"], 8: ["I", "O"], 9: ["J", "P"],
                }
            },
            {
                key: "WSX",
                map: {
                    0: ["K", "L"], 1: ["M", "N"], 2: ["O", "P"], 3: ["Q", "R"], 4: ["S", "T"],
                    5: ["U", "V"], 6: ["W", "X"], 7: ["Y", "Z"], 8: ["A", "B"], 9: ["C", "D"],
                }
            },
            {
                key: "EDC",
                map: {
                    0: ["Z", "Y"], 1: ["X", "W"], 2: ["V", "U"], 3: ["T", "S"], 4: ["R", "Q"],
                    5: ["P", "O"], 6: ["N", "M"], 7: ["L", "K"], 8: ["J", "I"], 9: ["H", "G"],
                }
            },
            {
                key: "RFV",
                map: {
                    0: ["A", "Z"], 1: ["S", "X"], 2: ["D", "C"], 3: ["F", "V"], 4: ["G", "B"],
                    5: ["H", "N"], 6: ["J", "M"], 7: ["K", "L"], 8: ["Q", "W"], 9: ["E", "R"],
                }
            },
            {
                key: "TGB",
                map: {
                    0: ["P", "O"], 1: ["I", "U"], 2: ["Y", "T"], 3: ["R", "E"], 4: ["W", "Q"],
                    5: ["A", "S"], 6: ["D", "F"], 7: ["G", "H"], 8: ["J", "K"], 9: ["L", "Z"],
                }
            },
        ];

        // Diccionarios inversos
        this.reverseMaps = this.alphabets.map((alphabet) => {
            const reverse = {};
            Object.keys(alphabet.map).forEach((digit) => {
                alphabet.map[digit].forEach((letter) => {
                    reverse[letter.toUpperCase()] = digit; // manejar mayúsculas
                });
            });
            return reverse;
        });

        // Caracteres permitidos para offsets (letras minúsculas + números)
        this.offsetChars = "abcdefghijklmnopqrstuvwxyz0123456789-";
    }

    /** Genera un offset alfanumérico aleatorio */
    generateOffset(length) {
        return Array.from({ length }, () =>
            this.offsetChars.charAt(Math.floor(Math.random() * this.offsetChars.length))
        ).join("");
    }


    async idMasking(id, offsetBefore = 2, offsetAfter = 2) {
        id = String(id);

        // Seleccionar un abecedario aleatorio
        const alphabetIndex = Math.floor(Math.random() * this.alphabets.length);
        const selectedAlphabet = this.alphabets[alphabetIndex];

        // Generar payload en minúscula
        let payload = "";
        for (let char of id) {
            const letters = selectedAlphabet.map[char];
            const selectedLetter = letters[Math.floor(Math.random() * letters.length)];
            payload += selectedLetter.toLowerCase();
        }

        // Generar offsets
        const offset1 = this.generateOffset(offsetBefore);
        const offset2 = this.generateOffset(offsetAfter);

        return `${offset1}${selectedAlphabet.key}${payload}${offset2}`;
    }

 
    async idUnmasking(maskedId, offsetBefore = 2, offsetAfter = 2) {
        if (typeof maskedId !== 'string' || maskedId.length < offsetBefore + offsetAfter + 3) {
            throw new Error("ID enmascarado inválido");
        }
        const core = maskedId.slice(offsetBefore, maskedId.length - offsetAfter);

        const key = core.slice(0, 3);
        const alphabetIndex = this.alphabets.findIndex((a) => a.key === key);
        if (alphabetIndex === -1) throw new Error("Clave de abecedario inválida");

        const reverseMap = this.reverseMaps[alphabetIndex];

        const payload = core.slice(3);

        let originalId = "";
        for (let char of payload) {
            const upperChar = char.toUpperCase();
            if (!reverseMap[upperChar]) throw new Error(`Caracter inválido en payload: ${char}`);
            originalId += reverseMap[upperChar];
        }

        return originalId;
    }
}

module.exports = HashingService;