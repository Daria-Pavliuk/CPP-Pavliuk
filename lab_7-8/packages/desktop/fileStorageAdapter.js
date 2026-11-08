
// fileStorageAdapter.js
// Файловий адаптер збереження даних GlowBeauty.

import {
    mkdir,
    readFile,
    writeFile
} from "node:fs/promises";

import { dirname } from "node:path";

import {
    ProductStorageAdapter
} from "@glowbeauty/core";

export class FileStorageAdapter extends ProductStorageAdapter {
    constructor(filePath) {
        super();
        this.filePath = filePath;
    }

    // Завантаження товарів із JSON-файлу
    async load() {
        try {
            const content = await readFile(
                this.filePath,
                "utf-8"
            );

            const products = JSON.parse(content);

            return Array.isArray(products) ? products : [];
        } catch {
            // Якщо файлу немає або JSON пошкоджений
            return [];
        }
    }

    // Збереження косметичних засобів у файл
    async save(products) {
        await mkdir(dirname(this.filePath), {
            recursive: true
        });

        await writeFile(
            this.filePath,
            JSON.stringify(products, null, 2),
            "utf-8"
        );
    }
}
