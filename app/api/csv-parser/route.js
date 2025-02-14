import { NextResponse } from "next/server";
import fs from 'fs';
import path from 'path';
import csv from 'csv-parser';

export async function GET(req) {
    const sort = req.nextUrl.searchParams.get("sort");
    const data = await readDataFromCSV();

    if (sort === 'created-at') {
        data.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
    } else if (sort === 'filename-asc') {
        data.sort((a, b) => proposalSort(a.filename, b.filename));
    } else if (sort === 'filename-dsc') {
        data.sort((a, b) => proposalSort(b.filename, a.filename));
    }

    return NextResponse.json({ data }, { status: 200 });
}

const readDataFromCSV = () => {
    const filePath = path.join(process.cwd(), 'data.csv');
    const results = [];
    return new Promise((resolve) => {
        fs.createReadStream(filePath)
            .pipe(csv())
            .on('data', (data) => {
                const value = data[Object.keys(data)[0]].split(';');
                results.push({ created_at: value[0], filename: value[1] });
            })
            .on('end', () => resolve(results));
    });
};

const proposalSort = (a, b) => {
    const extractNumbers = (str) => str.replace(/(\d+)/g, (n) => ` ${n.padStart(10, '0')} `);
    return extractNumbers(a).localeCompare(extractNumbers(b), undefined, { numeric: true });
};
